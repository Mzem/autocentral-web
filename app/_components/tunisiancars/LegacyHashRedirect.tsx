'use client'

import { useEffect } from 'react'

/**
 * The showroom used to be a section of the home, linked as "/#vente" (header,
 * shared links, bookmarks). It is now its own page: send those old links to
 * /vente. (A hash never reaches the server, so the middleware can't do it.)
 */
export default function LegacyHashRedirect() {
  useEffect(() => {
    if (window.location.hash === '#vente') window.location.replace('/vente')
  }, [])
  return null
}
