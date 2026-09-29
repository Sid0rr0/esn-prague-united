import { useEffect, useState } from 'react'
import { RefreshIcon } from '@sanity/icons/Refresh'
import { Button } from '@sanity/ui'
import { useToast } from '@sanity/ui/toast'
import { useClient, useCurrentUser } from 'sanity'
import {
  SITE_UPDATE_REQUEST_ID,
  buildSiteUpdateRequest,
  cooldownRemainingMs,
  type SiteUpdateRequest,
} from './siteUpdate'

const API_VERSION = '2026-01-01'

export function UpdateWebsiteButton() {
  const client = useClient({ apiVersion: API_VERSION })
  const user = useCurrentUser()
  const toast = useToast()
  const [pressedAt, setPressedAt] = useState<string>()
  const [remainingMs, setRemainingMs] = useState(0)

  // Follow the request document so the cooldown is shared across editors.
  useEffect(() => {
    const read = (doc: Pick<SiteUpdateRequest, 'pressedAt'> | null) => setPressedAt(doc?.pressedAt)
    const subscription = client
      .listen<SiteUpdateRequest>(
        '*[_id == $id]',
        { id: SITE_UPDATE_REQUEST_ID },
        { includeResult: true },
      )
      .subscribe((event) => {
        if (event.type === 'mutation') read(event.result ?? null)
      })
    client
      .getDocument<SiteUpdateRequest>(SITE_UPDATE_REQUEST_ID)
      .then((doc) => read(doc ?? null))
      .catch(() => {})
    return () => subscription.unsubscribe()
  }, [client])

  useEffect(() => {
    const tick = () => setRemainingMs(cooldownRemainingMs(pressedAt, new Date()))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [pressedAt])

  const isUpdating = remainingMs > 0

  const press = async () => {
    const request = buildSiteUpdateRequest(user, new Date())
    try {
      await client.createOrReplace(request)
      setPressedAt(request.pressedAt)
      toast.push({
        status: 'success',
        title: 'Site update started, live in about two minutes',
      })
    } catch (error) {
      console.error('Update website failed', error)
      toast.push({
        status: 'error',
        title: 'Could not start the site update',
        description: 'Please try again.',
      })
    }
  }

  return (
    <Button
      icon={RefreshIcon}
      text={isUpdating ? 'Updating…' : 'Update website'}
      tone="primary"
      mode="ghost"
      disabled={isUpdating}
      onClick={press}
    />
  )
}
