import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { evaluate, parse } from 'groq-js'

type Doc = { _id: string; _type: string; [key: string]: unknown }
type Page = Parameters<AstroContainer['renderToString']>[0]

interface Content {
  documents: Doc[]
  now: Date
}

let content: Content = { documents: [], now: new Date() }

/** Runs a real GROQ query against the documents of the current test, with now() pinned. */
export async function queryInMemory<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const result = await evaluate(parse(query), {
    dataset: content.documents,
    params,
    timestamp: content.now,
  })
  return (await result.get()) as T
}

interface RenderOptions {
  documents: Doc[]
  now: string
  params?: Record<string, string>
}

/** Renders a page over in-memory Sanity documents, as a visitor at `now` would see it. */
export async function renderPage(page: Page, options: RenderOptions): Promise<string> {
  content = { documents: options.documents, now: new Date(options.now) }
  const container = await AstroContainer.create()
  return container.renderToString(page, { params: options.params })
}
