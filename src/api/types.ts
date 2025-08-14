export type Token = string | null | undefined

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    path: string
    per_page: number
    to: number
  }
}
