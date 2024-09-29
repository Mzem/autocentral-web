'use client'

import React, { useEffect, useRef, useState } from 'react'
import { CarPostListItem } from '../../api/services/car-posts.service'
import CarPostModal from './CarPostModal'

const PAGE_SIZE = 20

const CarPostsFeed: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [posts, setPosts] = useState<CarPostListItem[]>([])
  const [page, setPage] = useState(1)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isShop, setIsShop] = useState(false)
  const [isFirstOwner, setIsFirstOwner] = useState(false)
  const [isExchange, setIsExchange] = useState(false)
  const [isLeasing, setIsLeasing] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useRef<HTMLDivElement | null>(null)

  const [showSearchBar, setShowSearchBar] = useState(true) // Track the visibility of the search bar
  const lastScrollY = useRef(0)

  function fetchPosts() {
    setLoadingPosts(true)
    if (page === 0) {
      setPage(1)
    } else {
      let url = `/api/car-posts?page=${page}`
      if (searchText) url += `&searchText=${searchText}`
      if (isShop) url += '&isShop=true'
      if (isFirstOwner) url += '&isFirstOwner=true'
      if (isExchange) url += '&isExchange=true'
      if (isLeasing) url += '&isLeasing=true'

      fetch(url)
        .then((res) => res.json())
        .then((newPosts) => {
          if (page === 1) setPosts(newPosts)
          else setPosts([...posts, ...newPosts])
          setHasMore(newPosts.length === PAGE_SIZE)
          setLoadingPosts(false)
        })
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 30) {
      setSearchText(input)
    }
  }
  const handleSearch = () => {
    setShowFilters(false)
    if (page === 1) {
      fetchPosts()
    } else {
      setPosts([])
      setPage(1)
    }
  }
  const resetFilters = () => {
    setSearchText('')
    setIsShop(false)
    setIsFirstOwner(false)
    setIsExchange(false)
    setIsLeasing(false)
    setPosts([])
    setPage(0)
  }

  useEffect(() => {
    if (loadingPosts || !hasMore) return

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1)
      }
    }

    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(handleObserver)
    if (lastPostRef.current) observer.current.observe(lastPostRef.current)

    return () => observer.current?.disconnect()
  }, [hasMore])

  // Detect scrolling direction to show/hide the search bar
  useEffect(() => {
    const handleScroll = () => {
      if (lastScrollY.current > 9 && window.scrollY > lastScrollY.current) {
        // User is scrolling down, hide the search bar
        setShowFilters(false)
        setShowSearchBar(false)
      } else {
        // User is scrolling up, show the search bar
        setShowSearchBar(true)
      }
      lastScrollY.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='w-full mx-auto'>
      {showSearchBar && (
        <>
          <div className='fixed z-0 top-16 w-full bg-black min-h-5'></div>
          <div className='fixed z-10 top-[4.5rem] lg:top-20 w-[95%] lg:w-3/5 bg-black p-1 border-2 border-red rounded-lg text-center flex flex-col'>
            <div className='flex flex-row items-center justify-between'>
              <input
                type='text'
                value={searchText}
                onChange={handleSearchTextChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Rechercher une voiture...'
                className='bg-black placeholder-white border-none text-base lg:text-xl outline-none text-white w-[65%] lg:w-5/6'
              />
              <div className=''>
                <button
                  className='w-8 lg:w-10 p-2 mr-1 bg-red rounded hover:bg-black hover:border hover:border-white'
                  onClick={handleSearch}
                >
                  <img src='/search_white.svg' className='h-4 lg:h-5 mx-auto' />
                </button>
                <button
                  className='w-8 lg:w-10 p-2 mr-1 bg-red rounded hover:bg-black hover:border hover:border-white'
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <img src='/filter.svg' className='h-4 lg:h-5 mx-auto' />
                </button>
                <button
                  className='w-8 lg:w-10 p-2 lg:mr-2 bg-red rounded hover:bg-black hover:border hover:border-white'
                  onClick={resetFilters}
                >
                  <img src='/filter_reset.svg' className='h-4 lg:h-5 mx-auto' />
                </button>
              </div>
            </div>
            {showFilters && (
              <div className='flex flex-col mt-2 mb-2'>
                <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={isShop}
                    onChange={() => setIsShop(!isShop)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Vendeurs PRO</span>
                </label>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={isFirstOwner}
                    onChange={() => setIsFirstOwner(!isFirstOwner)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Première main</span>
                </label>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={isExchange}
                    onChange={() => setIsExchange(!isExchange)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Echange possible</span>
                </label>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={isLeasing}
                    onChange={() => setIsLeasing(!isLeasing)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Leasing</span>
                </label>
              </div>
            )}
          </div>
        </>
      )}

      <p className='text-center text-lg lg:text-xl my-4 mt-12 lg:mt-14'>
        {loadingPosts
          ? 'Chargement des annonces...'
          : '12523 annonces disponibles...'}
      </p>

      {posts.map((post) => (
        <div
          key={post.id}
          className='justify-between w-full flex items-center mt-1 p-1 bg-whiteopac2 hover:bg-black border-b-2 border-red text-xs lg:text-sm'
        >
          <button
            onClick={() => setSelectedPostId(post.id)}
            className='flex flex-row w-4/5 space-x-1 lg:space-x-4'
          >
            <img
              src={post.image}
              alt={post.title}
              className='w-28 lg:w-40 h-36 object-cover rounded'
            />
            <div className='flex flex-col justify-between items-start h-36'>
              {post.title && (
                <span className='text-xs lg:text-base font-bold truncate max-w-[8.5rem] lg:max-w-full'>
                  {post.title}
                </span>
              )}
              <span className='truncate max-w-[7.5rem] lg:max-w-full'>
                {post.year ? post.year + ' ' : ''}
                {post.make} {post.model}
              </span>
              {post.km && <span className='font-bold'>{post.km} km</span>}
              <span>
                {post.cv ? post.cv + 'cv ' : ''}
                {post.fuel}
              </span>
              {post.gearbox && <span>{post.gearbox}</span>}
              <span className='font-bold mt-auto'>
                {post.price ? post.price + ' TND' : 'Prix inconnu'}
              </span>
            </div>
          </button>

          <div className='flex flex-col items-center mr-1'>
            {post.publishedAtText && (
              <span className='text-xs mb-2 truncate max-w-[6rem]'>
                {post.publishedAtText}
              </span>
            )}

            {post.phone && (
              <a href={`tel:${post.phone}`} className='w-full'>
                <button className='bg-red text-white p-2 px-6 rounded-lg hover:bg-vividred transition duration-300 ease-in-out mb-3'>
                  Appeler
                </button>
              </a>
            )}
            <div className='flex flex-row items-center mb-1'>
              {post.merchant.isShop && <img src='/badge.svg' className='h-3' />}
              <span className='text-xs text-white truncate max-w-[5.7rem] lg:max-w-[7rem]'>
                {post.merchant.name}
              </span>
            </div>
            <div className='flex flex-row items-center'>
              <img src='/location.svg' className='h-3 lg:h-4' />
              <span>{post.region.name}</span>
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <p className='text-center text-lg lg:text-xl mt-6'>
          Charger plus d'annonces...
        </p>
      )}

      <div ref={lastPostRef} />

      {selectedPostId && (
        <CarPostModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  )
}

export default CarPostsFeed
