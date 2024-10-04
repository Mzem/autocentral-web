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
  const [showFiltersScroll, setShowFiltersScoll] = useState(false)
  const [isShop, setIsShop] = useState(false)
  const [isFirstOwner, setIsFirstOwner] = useState(false)
  const [isExchange, setIsExchange] = useState(false)
  const [isLeasing, setIsLeasing] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useRef<HTMLDivElement | null>(null)

  const [showFixedSearchBar, setShowFixedSearchBar] = useState(false) // Track the visibility of the search bar
  const lastScrollY = useRef(0)
  const searchDivRef = useRef<HTMLDivElement | null>(null)
  const fixedSearchBarRef = useRef(null)

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
    setShowFilters(false)
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
      const targetDivPosition =
        searchDivRef.current?.getBoundingClientRect().top ?? 0

      // Ensure this logic is only triggered by scrolling, not by hover
      if (window.scrollY > 9 && window.scrollY > targetDivPosition + 200) {
        // setShowFilters(false)
        if (window.scrollY > lastScrollY.current) {
          // Hide the search bar only if scrolled down more than 25px
          if (window.scrollY - lastScrollY.current > 60) {
            setShowFixedSearchBar(false)
            setShowFiltersScoll(false)
          }
        } else {
          // Scrolling up: show the search bar
          if (
            // !isSearchInputClicked &&
            lastScrollY.current - window.scrollY >
            160
          ) {
            setShowFiltersScoll(false)
          }
          setShowFixedSearchBar(true)
        }
      } else {
        // Above the target div: ensure search bar is not fixed
        setShowFixedSearchBar(false)
      }

      lastScrollY.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // @ts-ignore
  const handleClickOutside = (event) => {
    if (
      fixedSearchBarRef.current &&
      // @ts-ignore
      !fixedSearchBarRef.current.contains(event.target)
    ) {
      setShowFiltersScoll(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className='text-center text-base lg:text-2xl mt-8 lg:mt-16'>
        <p className='mx-2'>
          Découvrez le premier moteur de recherche de véhicules d'occasion en{' '}
          <span className='font-semibold text-cream'>Tunisie</span>
        </p>
        <p className='mt-3 font-semibold text-cream'>
          +1000 nouvelles annonces par jour
        </p>
      </div>
      {/* Relative search bar */}
      <div className='w-full mt-8 lg:mt-16 bg-black p-1 border border-whiteopac lg:border-2 rounded-lg text-center flex flex-col'>
        <div className='flex flex-row items-center justify-between'>
          <input
            type='text'
            value={searchText}
            onClick={() => setShowFilters(true)}
            onChange={handleSearchTextChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='Rechercher un véhicule..'
            className='bg-black placeholder-white border-none text-base lg:text-xl outline-none text-white w-[65%] lg:w-5/6'
          />
          <div>
            <button
              className='w-8 lg:w-10 p-2 mr-1 bg-cream rounded hover:bg-vividred transition duration-300 ease-in-out'
              onClick={handleSearch}
            >
              <img
                src='/search_red.svg'
                alt='Lancer la recherche'
                className='h-4 lg:h-5 mx-auto'
              />
            </button>
            <button
              className='w-8 lg:w-10 p-2 lg:mr-2 bg-cream rounded hover:bg-vividred transition duration-300 ease-in-out'
              onClick={resetFilters}
            >
              <img
                src='/filter_reset.svg'
                alt='Réinitialiser les filtres'
                className='h-4 lg:h-5 mx-auto'
              />
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
      {showFixedSearchBar && (
        <>
          <div
            ref={fixedSearchBarRef}
            className='fixed z-10 top-[3rem] lg:top-[4rem] w-full lg:w-3/5 left-0 lg:left-auto bg-red pr-1 lg:p-1 border-b-2 lg:border lg:border-t-red border-whiteopac2 lg:border-whiteopac lg:rounded text-center flex flex-col'
          >
            <div className='flex flex-row items-center justify-between'>
              <input
                type='text'
                value={searchText}
                onClick={() => setShowFiltersScoll(true)}
                onChange={handleSearchTextChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Rechercher un véhicule..'
                className='bg-red placeholder-white border-none text-base lg:text-xl outline-none text-white w-[65%] lg:w-5/6'
              />
              <div>
                <button
                  className='w-8 lg:w-10 p-2 mr-1 bg-cream rounded hover:bg-vividred transition duration-300 ease-in-out'
                  onClick={handleSearch}
                >
                  <img
                    src='/search_red.svg'
                    alt='Lancer la recherche'
                    className='h-4 lg:h-5 mx-auto'
                  />
                </button>
                <button
                  className='w-8 lg:w-10 p-2 lg:mr-2 bg-cream rounded hover:bg-vividred transition duration-300 ease-in-out'
                  onClick={resetFilters}
                >
                  <img
                    src='/filter_reset.svg'
                    alt='Réinitialiser les filtres'
                    className='h-4 lg:h-5 mx-auto'
                  />
                </button>
              </div>
            </div>
            {showFiltersScroll && (
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
      <div ref={searchDivRef} className='w-full mx-auto mt-1 lg:mt-6'>
        {loadingPosts && (
          <p className='text-center text-lg lg:text-xl'>
            Chargement des annonces...
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className='justify-between w-full flex items-center mt-1 p-1 bg-whiteopac3 hover:bg-black border-b-2 border-red text-xs lg:text-sm'
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
                  <button className='bg-cream text-red p-2 px-6 rounded-lg hover:bg-vividred hover:text-white transition duration-300 ease-in-out mb-3'>
                    Appeler
                  </button>
                </a>
              )}
              <div className='flex flex-row items-center mb-1'>
                {post.merchant.isShop && (
                  <img src='/badge.svg' className='h-3' />
                )}
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

        <div ref={lastPostRef} />

        {selectedPostId && (
          <CarPostModal
            postId={selectedPostId}
            onClose={() => setSelectedPostId(null)}
          />
        )}
      </div>
    </>
  )
}

export default CarPostsFeed
