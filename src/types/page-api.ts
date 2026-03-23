/** GET /api/pages/:slug */
export type PageApiResponse = {
  slug: string
  title: string
  content: string
  status: string
}

export type FetchPageResult =
  | { status: 'ok'; data: PageApiResponse }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
