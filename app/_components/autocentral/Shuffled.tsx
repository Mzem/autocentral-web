'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Renders `items` in a random order, drawn again on every visit. The page is
 * static (ISR), so the shuffle happens in the browser: the server order is
 * rendered first (identical hydration), then reordered once mounted.
 */
export default function Shuffled({ items }: { items: ReactNode[] }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i))

  useEffect(() => {
    const next = items.map((_, i) => i)
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    setOrder(next)
  }, [items.length])

  return <>{order.map((i) => items[i])}</>
}
