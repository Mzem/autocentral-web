'use client'

import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { regionsSelect } from '../../utils'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { reactSelectFilterStyle } from '../customStyles'

const SearchBar = ({
  isFixed,
  showFilters,
  setShowFilters,
  showMoreFilters,
  setShowMoreFilters,
  fixedSearchBarRef,
  showFixedSearchBar,
  showFixedFilters,
  setShowFixedFilters,
  searchText,
  isShop,
  setIsShop,
  isFirstOwner,
  setIsFirstOwner,
  isExchange,
  setIsExchange,
  isLeasing,
  setIsLeasing,
  isAuto,
  setIsAuto,
  regions,
  setRegions,
  handleSearchTextChange,
  handleSearch,
  resetFilters
}: {
  isFixed: boolean
  showFilters: any
  setShowFilters: any
  showMoreFilters: any
  setShowMoreFilters: any
  fixedSearchBarRef: any
  showFixedSearchBar: any
  showFixedFilters: any
  setShowFixedFilters: any
  searchText: any
  isShop: any
  setIsShop: any
  isFirstOwner: any
  setIsFirstOwner: any
  isExchange: any
  setIsExchange: any
  isLeasing: any
  setIsLeasing: any
  isAuto: any
  setIsAuto: any
  regions: any[]
  setRegions: any
  handleSearchTextChange: any
  handleSearch: any
  resetFilters: any
}) =>
  (!isFixed || showFixedSearchBar) && (
    <div
      ref={isFixed ? fixedSearchBarRef : undefined}
      className={`bg-blackopac ${
        isFixed
          ? 'fixed z-10 top-[2.96874988rem] lg:top-[4rem] w-full lg:w-4/6 left-0 lg:left-[16.7%] lg:rounded-b lg:p-1 border-b-2 lg:border-b-4 border-whiteopac2 lg:border-whiteopac text-center flex flex-col'
          : 'w-full mt-8 lg:mt-16 p-[2px] rounded-lg text-center flex flex-col'
      }`}
    >
      <div className='flex flex-row items-center justify-between'>
        <input
          type='text'
          value={searchText}
          onClick={() => {
            if (isFixed) setShowFixedFilters(true)
            else setShowFilters(true)
          }}
          onChange={handleSearchTextChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='Rechercher un véhicule...'
          className='ml-1 py-1 my-1 bg-whiteopac2 placeholder-white rounded-lg border-none text-base lg:text-xl outline-none w-[75%] lg:w-5/6'
        />
        <div>
          <button
            className='w-8 lg:w-10 p-2 mr-1 bg-pureblack rounded hover:bg-whiteopac transition duration-300 ease-in-out'
            onClick={handleSearch}
          >
            <img
              src='/search.svg'
              alt='Lancer la recherche'
              className='h-4 lg:h-5 mx-auto'
            />
          </button>
          <button
            className='w-8 lg:w-10 p-2 mr-1 lg:mr-2 bg-pureblack rounded hover:bg-whiteopac transition duration-300 ease-in-out'
            onClick={resetFilters}
          >
            <img
              src='/refresh.svg'
              alt='Réinitialiser les filtres'
              className='h-4 lg:h-5 mx-auto'
            />
          </button>
        </div>
      </div>
      {((!isFixed && showFilters) || (isFixed && showFixedFilters)) && (
        <div
          className={`${
            isFixed ? 'flex flex-col mt-2 mb-2' : 'flex flex-col my-1 lg:my-2'
          }`}
        >
          <Select
            isMulti
            options={regionsSelect}
            onChange={(selected) =>
              setRegions(selected as Array<{ value: string; label: string }>)
            }
            unstyled
            styles={reactSelectFilterStyle}
            className='w-1/3 lg:w-1/6 ml-[11px] mb-1 bg-whiteopac2 rounded'
            classNamePrefix='react-select'
          />
          <label className='flex items-center ml-3 cursor-pointer'>
            <input
              type='checkbox'
              checked={isShop}
              onChange={() => setIsShop(!isShop)}
              className='mr-2 h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer checked:bg-vividred'
            />
            <span className='text-xs lg:text-sm'>Vendeurs PRO</span>
            <img src='/badge.svg' className='ml-1 h-3' />
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
              checked={isAuto}
              onChange={() => setIsAuto(!isAuto)}
              className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
            />
            <span className='text-xs lg:text-sm'>Boîte automatique</span>
          </label>
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className='text-xs lg:text-sm mb-1 mt-3 hover:underline'
          >
            {`Voir ${showMoreFilters ? 'moins' : 'plus'} de filtres ${
              showMoreFilters ? '-' : '+'
            }`}
          </button>
          {showMoreFilters && (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  )

const API_PAGE_SIZE = 20

type CarPostsSearchBarsProps = {
  page: number
  setPage: any
  loadingPosts: boolean
  setLoadingPosts: any
  hasMore: boolean
  setHasMore: any
  actualPosts: CarPostListItem[]
  setPosts: any
  withFixed: boolean
  lastPostRef: React.MutableRefObject<HTMLDivElement | null>
  searchDivRef: React.MutableRefObject<HTMLDivElement | null>
}

function CarPostsSearchBars({
  page,
  setPage,
  loadingPosts,
  setLoadingPosts,
  hasMore,
  setHasMore,
  actualPosts,
  setPosts,
  withFixed,
  lastPostRef,
  searchDivRef
}: CarPostsSearchBarsProps) {
  // Relative search bar
  const [showFilters, setShowFilters] = useState(false)
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  // Fixed search bar
  const fixedSearchBarRef = useRef(null)
  const [showFixedSearchBar, setShowFixedSearchBar] = useState(false)
  const [showFixedFilters, setShowFixedFilters] = useState(false)

  // Filters
  const [searchText, setSearchText] = useState<string>('')
  const [isShop, setIsShop] = useState(true)
  const [isFirstOwner, setIsFirstOwner] = useState(false)
  const [isExchange, setIsExchange] = useState(false)
  const [isLeasing, setIsLeasing] = useState(false)
  const [isAuto, setIsAuto] = useState(false)
  const [regions, setRegions] = useState<{ value: string; label: string }[]>([])

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 30) {
      setSearchText(input)
    }
  }

  // Fetch posts logic

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
          else setPosts([...actualPosts, ...newPosts])
          setHasMore(newPosts.length === API_PAGE_SIZE)
          setLoadingPosts(false)
        })
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
    fetchPosts()
  }, [page])

  // Fetch posts when scolling to bottom
  const observer = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    if (loadingPosts || !hasMore) return

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage: number) => prevPage + 1)
      }
    }

    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(handleObserver)
    if (lastPostRef.current) observer.current.observe(lastPostRef.current)

    return () => observer.current?.disconnect()
  }, [hasMore])

  // Fixed search bar & filters display control logic
  const lastScrollY = useRef(0)

  useEffect(() => {
    // Detect scrolling direction to show/hide the search bar
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
            setShowFixedFilters(false)
          }
        } else {
          // Scrolling up: show the search bar
          if (lastScrollY.current - window.scrollY > 170) {
            setShowFixedFilters(false)
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
      setShowFixedFilters(false)
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
      <SearchBar
        isFixed={false}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        showMoreFilters={showMoreFilters}
        setShowMoreFilters={setShowMoreFilters}
        fixedSearchBarRef={fixedSearchBarRef}
        showFixedSearchBar={showFixedSearchBar}
        showFixedFilters={showFixedFilters}
        setShowFixedFilters={setShowFixedFilters}
        searchText={searchText}
        isShop={isShop}
        setIsShop={setIsShop}
        isFirstOwner={isFirstOwner}
        setIsFirstOwner={setIsFirstOwner}
        isExchange={isExchange}
        setIsExchange={setIsExchange}
        isLeasing={isLeasing}
        setIsLeasing={setIsLeasing}
        isAuto={isAuto}
        setIsAuto={setIsAuto}
        regions={regions}
        setRegions={setRegions}
        handleSearchTextChange={handleSearchTextChange}
        handleSearch={handleSearch}
        resetFilters={resetFilters}
      />
      {withFixed && (
        <SearchBar
          isFixed={true}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          showMoreFilters={showMoreFilters}
          setShowMoreFilters={setShowMoreFilters}
          fixedSearchBarRef={fixedSearchBarRef}
          showFixedSearchBar={showFixedSearchBar}
          showFixedFilters={showFixedFilters}
          setShowFixedFilters={setShowFixedFilters}
          searchText={searchText}
          isShop={isShop}
          setIsShop={setIsShop}
          isFirstOwner={isFirstOwner}
          setIsFirstOwner={setIsFirstOwner}
          isExchange={isExchange}
          setIsExchange={setIsExchange}
          isLeasing={isLeasing}
          setIsLeasing={setIsLeasing}
          isAuto={isAuto}
          setIsAuto={setIsAuto}
          regions={regions}
          setRegions={setRegions}
          handleSearchTextChange={handleSearchTextChange}
          handleSearch={handleSearch}
          resetFilters={resetFilters}
        />
      )}
    </>
  )
}

export default CarPostsSearchBars
