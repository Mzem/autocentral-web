import type { CarPostListItem } from '../../api/services/car-posts.service'

// `publishedAt` is a "DD/MM/YYYY" (fr) string.
const publishedTime = (post: CarPostListItem): number => {
  const [d, m, y] = (post.publishedAt || '').split('/').map(Number)
  return d && m && y ? new Date(y, m - 1, d).getTime() : 0
}

/** Newest first (stable: same-day listings keep the API order). */
export const newestFirst = (posts: CarPostListItem[]): CarPostListItem[] =>
  [...posts].sort((a, b) => publishedTime(b) - publishedTime(a))
