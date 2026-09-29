import { Flex } from '@sanity/ui'
import type { NavbarProps } from 'sanity'
import { UpdateWebsiteButton } from './UpdateWebsiteButton'

export function UpdateWebsiteNavbar(props: NavbarProps) {
  return (
    <Flex align="center" gap={2} paddingRight={2}>
      <div style={{ flex: 1, minWidth: 0 }}>{props.renderDefault(props)}</div>
      <UpdateWebsiteButton />
    </Flex>
  )
}
