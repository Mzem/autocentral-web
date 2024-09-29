import { NextRequest } from 'next/server'
import { getCarPosts } from '../../../api/services/car-posts.service'

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get('page')) || 1
  const searchText = req.nextUrl.searchParams.get('searchText') || undefined
  const isShop = req.nextUrl.searchParams.get('isShop') === 'true'
  const isFirstOwner = req.nextUrl.searchParams.get('isFirstOwner') === 'true'
  const isExchange = req.nextUrl.searchParams.get('isExchange') === 'true'
  const isLeasing = req.nextUrl.searchParams.get('isLeasing') === 'true'
  const posts = await getCarPosts(page, {
    searchText,
    isShop,
    isFirstOwner,
    isExchange,
    isLeasing
  })
  return Response.json(posts)
}
