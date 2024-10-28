'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  CarPostListItem,
  generateCarPostsQueryParams,
  GetCarPostsFilters
} from '../../../api/services/car-posts.service'
import { Fuel, InteriorType } from '../../types'
import ColorSelector from '../ColorSelector'
import MultiSelectList from '../MultiSelector'
import CarPostModal from './CarPostModal'
import MinMaxSelector from '../MinMaxSelector'

const API_PAGE_SIZE = 20

export default function CarPostsFeed({
  initialPosts,
  initialFilters
}: {
  initialPosts: CarPostListItem[]
  initialFilters?: GetCarPostsFilters
}) {
  // Posts display & pagination
  const [posts, setPosts] = useState<CarPostListItem[]>(initialPosts)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length === API_PAGE_SIZE)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  // Filters
  const [page, setPage] = useState(initialFilters?.page || 1)
  const [make, setMake] = useState(initialFilters?.make)
  const [model, setModel] = useState(initialFilters?.model)
  const [regions, setRegions] = useState<{ value: string; label: string }[]>([])
  const [fuel, setFuel] = useState(initialFilters?.fuel || [])
  const [colors, setColors] = useState(initialFilters?.color || [])
  const [interiorTypes, setInteriorTypes] = useState(
    initialFilters?.interiorType || []
  )
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice)
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice)
  const [maxKm, setMaxKm] = useState(initialFilters?.maxKm)
  const [minKm, setMinKm] = useState(initialFilters?.minKm)
  const [maxYear, setMaxYear] = useState(initialFilters?.maxYear)
  const [minYear, setMinYear] = useState(initialFilters?.minYear)
  const [maxCV, setMaxCV] = useState(initialFilters?.maxCV)
  const [minCV, setMinCV] = useState(initialFilters?.minCV)
  const [alarm, setAlarm] = useState(initialFilters?.alarm || false)
  const [keyless, setKeyless] = useState(initialFilters?.keyless || false)
  const [camera, setCamera] = useState(initialFilters?.camera || false)
  const [isShop, setIsShop] = useState(initialFilters?.isShop || false)
  const [isAuto, setIsAuto] = useState(initialFilters?.isAuto || false)
  const [firstOwner, setFirstOwner] = useState(
    initialFilters?.firstOwner || false
  )
  const [exchange, setExchange] = useState(initialFilters?.exchange || false)
  const [leasing, setLeasing] = useState(initialFilters?.leasing || false)
  const [searchText, setSearchText] = useState<string>(initialFilters?.q || '')

  // Relative search bar
  const [showFilters, setShowFilters] = useState(false)
  const [showMoreFilters, setShowMoreFilters] = useState(
    alarm ||
      keyless ||
      camera ||
      leasing ||
      exchange ||
      colors.length > 0 ||
      interiorTypes.length > 0
  )

  const searchDivRef = useRef<HTMLDivElement | null>(null)
  const [showSearchButton, setShowSearchButton] = useState(false)

  function stateToFilters(page: number): GetCarPostsFilters {
    return {
      page,
      make,
      model,
      regionIds: regions.map((region) => region.value),
      fuel,
      color: colors,
      interiorType: interiorTypes,
      maxPrice,
      minPrice,
      maxCV,
      minCV,
      maxYear,
      minYear,
      alarm,
      keyless,
      camera,
      isShop,
      isAuto,
      firstOwner,
      exchange,
      leasing,
      q: searchText
    }
  }

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 30) {
      setSearchText(input)
    }
  }

  function fetchPosts(page: number) {
    setPage(page)
    setLoadingPosts(true)

    const url =
      '/api/car-posts/' + generateCarPostsQueryParams(stateToFilters(page))

    fetch(url)
      .then((res) => res.json())
      .then((newPosts) => {
        if (page === 1) setPosts(newPosts)
        else setPosts([...posts, ...newPosts])
        setHasMore(newPosts.length === API_PAGE_SIZE)
        setLoadingPosts(false)
      })
  }

  function handleNewSearch() {
    window.location.href = '/' + generateCarPostsQueryParams(stateToFilters(1))
  }

  useEffect(() => {
    const handleScroll = () => {
      if (searchDivRef.current) {
        const rect = searchDivRef.current.getBoundingClientRect()
        setShowSearchButton(rect.top < -window.innerHeight / 2)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSearch = () => {
    setShowFilters(true)
    if (searchDivRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div
        ref={searchDivRef}
        className='bg-blackopac w-full p-[2px] rounded-lg text-center flex flex-col'
      >
        <div className='flex flex-row items-center justify-between'>
          <input
            type='text'
            value={searchText}
            onClick={() => {
              setShowFilters(true)
            }}
            onChange={handleSearchTextChange}
            onKeyDown={(e) => e.key === 'Enter' && handleNewSearch()}
            placeholder='Rechercher un véhicule...'
            className='ml-1 py-1 my-1 bg-whiteopac2 placeholder-white rounded-lg border-none text-base lg:text-xl outline-none w-[75%] lg:w-5/6'
          />

          <div>
            <button
              className='w-10 lg:w-14 p-2 mr-[2px] lg:mr-2 bg-vividred rounded hover:bg-titan transition duration-300 ease-in-out'
              onClick={handleNewSearch}
            >
              <img
                src='/search.svg'
                alt='Lancer la recherche'
                className='h-4 lg:h-5 mx-auto'
              />
            </button>
            <button
              className='w-8 lg:w-10 p-2 mr-[1px] lg:mr-2 bg-pureblack rounded hover:bg-titan transition duration-300 ease-in-out'
              onClick={() => {
                window.location.href = '/'
              }}
            >
              <img
                src='/refresh.svg'
                alt='Réinitialiser les filtres'
                className='h-4 lg:h-5 mx-auto'
              />
            </button>
          </div>
        </div>
        {showFilters && (
          <div className={'flex flex-col my-1 lg:my-2'}>
            {/* <Select
              isMulti
              options={regionsSelect}
              onChange={(selected) =>
                setRegions(selected as Array<{ value: string; label: string }>)
              }
              unstyled
              styles={reactSelectFilterStyle}
              className='w-1/3 lg:w-1/6 ml-[11px] mb-1 bg-whiteopac2 rounded'
              classNamePrefix='react-select'
            /> */}

            <label className='flex items-center ml-3 cursor-pointer text-base'>
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
                checked={firstOwner}
                onChange={() => setFirstOwner(!firstOwner)}
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
            <MultiSelectList
              items={Object.values(Fuel)}
              selectedItems={fuel}
              setSelectedItems={setFuel}
            />
            <MinMaxSelector
              min={minPrice}
              max={maxPrice}
              setMin={setMinPrice}
              setMax={setMaxPrice}
              label={'Prix'}
            />
            <MinMaxSelector
              min={minKm}
              max={maxKm}
              setMin={setMinKm}
              setMax={setMaxKm}
              label={'Km'}
            />
            <button
              onClick={() => setShowMoreFilters(true)}
              className='text-xs lg:text-sm mb-1 mt-3 hover:underline'
            >
              {`${
                showMoreFilters ? 'Plus de filtres' : 'Voir plus de filtres +'
              }`}
            </button>
            {showMoreFilters && (
              <>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={alarm}
                    onChange={() => setAlarm(!alarm)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Alarme anti-vol</span>
                </label>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={keyless}
                    onChange={() => setKeyless(!keyless)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Démarrage sans clé</span>
                </label>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={camera}
                    onChange={() => setCamera(!camera)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>
                    Caméra de stationnement
                  </span>
                </label>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={exchange}
                    onChange={() => setExchange(!exchange)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Echange possible</span>
                </label>
                <label className='flex items-center space-x-2 ml-3 mt-1 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={leasing}
                    onChange={() => setLeasing(!leasing)}
                    className='h-4 w-4 lg:h-5 lg:w-5 rounded cursor-pointer'
                  />
                  <span className='text-xs lg:text-sm'>Leasing</span>
                </label>
                <MultiSelectList
                  label='Intérieur'
                  items={Object.values(InteriorType)}
                  selectedItems={interiorTypes}
                  setSelectedItems={setInteriorTypes}
                />
                <ColorSelector
                  selectedColors={colors}
                  setSelectedColors={setColors}
                />
              </>
            )}
          </div>
        )}
      </div>

      <div
        ref={searchDivRef}
        className='w-full mx-auto mt-1 lg:mt-6 text-black'
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className='justify-between w-full flex items-center mt-2 shadow-md rounded bg-whiteopac hover:bg-whiteBGDarker text-xs lg:text-sm text-blacklight'
          >
            <button
              onClick={() => setSelectedPostId(post.id)}
              className='flex flex-row w-4/5 space-x-1 lg:space-x-4 items-center'
            >
              <img
                src={post.image}
                alt={post.title}
                className='w-28 lg:w-40 h-[7.5rem] lg:h-[8.5rem] object-cover rounded flex-shrink-0'
              />
              <div className='flex flex-col justify-between items-start h-[7.5rem] lg:h-[8.5rem]'>
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
                <span className='font-bold mt-auto text-pureblack mb-[1px]'>
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
                  <button className='text-white bg-blackopac border border-whiteopac p-2 px-6 rounded-lg hover:bg-titan transition duration-300 ease-in-out mb-3'>
                    Appeler
                  </button>
                </a>
              )}
              <div className='flex flex-row items-center mb-1'>
                {post.merchant.isShop && (
                  <img src='/badge.svg' className='h-3' />
                )}
                <span className='text-xs text-black truncate max-w-[5.7rem] lg:max-w-[6rem]'>
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

        {loadingPosts && (
          <p className='text-center mt-12 text-lg lg:text-xl'>
            Chargement des annonces...
          </p>
        )}
        {!hasMore && !loadingPosts && (
          <p className='text-center mt-12 text-lg lg:text-xl'>
            Fin des résultats.
          </p>
        )}
        {hasMore && !loadingPosts && (
          <button
            className='text-whiteBG bg-blackopac shadow-lg p-1 rounded-lg hover:bg-titan hover:text-white transition duration-300 ease-in-out w-full text-center mt-10 lg:text-lg'
            onClick={() => fetchPosts(page + 1)}
          >
            Charger plus d'annonces +
          </button>
        )}

        {/* Fixed Scroll Button */}
        {showSearchButton && (
          <button
            onClick={scrollToSearch}
            className='fixed bottom-[1%] right-[3%] lg:bottom-[85%] lg:right-[15%] p-3 bg-vividred text-white rounded-full shadow-lg hover:bg-blackopac2 transition'
          >
            <img
              src='/search.svg'
              alt='Lancer la recherche'
              className='h-5 lg:h-6 mx-auto'
            />
          </button>
        )}

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
