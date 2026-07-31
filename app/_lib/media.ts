import fs from 'fs'
import path from 'path'

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif'
])

/**
 * Lists the images inside a `/public/<dir>` folder at request time and returns
 * their web-served paths.
 *
 * Self-feeding by design: the folder is re-read on every request, so dropping a
 * new photo into it (or deleting one) changes the result with zero code change
 * and never throws if the folder is missing/empty.
 *
 * Server-only (uses `fs`); import it from server components.
 */
export function getPublicImages(dir: string): string[] {
  try {
    const absoluteDir = path.join(process.cwd(), 'public', dir)
    return fs
      .readdirSync(absoluteDir)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => '/' + path.posix.join(dir, file))
  } catch {
    return []
  }
}
