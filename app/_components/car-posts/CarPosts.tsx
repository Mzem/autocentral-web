'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import {
  CarPostListItem,
  generateCarPostsQueryParams,
  GetCarPostsFilters
} from '../../../api/services/car-posts.service'
import { dotNumber, fromNameToId } from '../../helpers'
import {
  carModels,
  Fuel,
  InteriorType,
  makesWithLogos,
  regionsSelect
} from '../../types'
import FeedAd from '../ads/FeedAd'
import ColorSelector from '../ColorSelector'
import { reactSelectFilterStyle } from '../customStyles'
import MinMaxSelector from '../MinMaxSelector'
import MultiSelectList from '../MultiSelector'
import CarPostModal from './CarPostModal'
import FeedAd2 from '../ads/FeedAd2'
import FeaturedCarPosts from './FeaturedCarPosts'
import CarImage, { SoldBadge } from './CarImage'

//const API_PAGE_SIZE = 20

export default function CarPostsFeed({
  initialPosts,
  featuredPosts,
  initialFilters
}: {
  initialPosts: CarPostListItem[]
  featuredPosts?: CarPostListItem[]
  initialFilters?: GetCarPostsFilters
}) {
  const pathname = usePathname() // Get path, e.g., "/annonces/123"
  const pathnameSplit = pathname.split('/')
  const id =
    pathnameSplit[1] === 'annonces' && pathnameSplit[2]
      ? pathnameSplit[2]
      : undefined // Assuming "/annonces/[id]" structure

  const [merchantId, setMerchantId] = useState(initialFilters?.merchantId)
  const groupByMake = Boolean(merchantId)

  // Posts display & pagination
  const [posts, setPosts] = useState<CarPostListItem[]>(initialPosts)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialPosts.length !== 0 && !merchantId
  )
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  // Filters
  const [page, setPage] = useState(initialFilters?.page || 1)

  const [make, setMake] = useState<
    { value: string; label: string } | undefined
  >(
    initialFilters?.make
      ? { value: initialFilters.make, label: initialFilters.make }
      : undefined
  )
  const [model, setModel] = useState<
    { value: string; label: string } | undefined
  >(
    initialFilters?.model
      ? { value: initialFilters.model, label: initialFilters.model }
      : undefined
  )
  const [regions, setRegions] = useState<{ value: string; label: string }[]>(
    initialFilters?.regionIds?.map((regionId) => ({
      value: regionId,
      label:
        regionsSelect.find((region) => region.value === regionId)?.label ||
        regionId
    })) || []
  )
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
  const [fcr, setFCR] = useState(initialFilters?.fcr || false)
  const [searchText, setSearchText] = useState<string>(initialFilters?.q || '')

  // Relative search bar
  const [showFilters, setShowFilters] = useState(merchantId ? false : true)
  const [showMoreFilters, setShowMoreFilters] = useState(
    fuel.length > 0 ||
      isShop ||
      firstOwner ||
      isAuto ||
      alarm ||
      keyless ||
      camera ||
      leasing ||
      fcr ||
      exchange ||
      colors.length > 0 ||
      interiorTypes.length > 0
  )

  const searchDivRef = useRef<HTMLDivElement | null>(null)

  function stateToFilters(page: number): GetCarPostsFilters {
    return {
      page,
      merchantId,
      regionIds: regions.map((region) => region.value),
      fuel,
      color: colors,
      interiorType: interiorTypes,
      maxPrice,
      minPrice,
      maxKm,
      minKm,
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
      fcr,
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

    fetch(url, { next: { revalidate: 60 } })
      .then((res) => res.json())
      .then((newPosts) => {
        if (page === 1) setPosts(newPosts)
        else setPosts([...posts, ...newPosts])
        setHasMore(newPosts.length !== 0)
        setLoadingPosts(false)
      })
  }

  function handleNewSearch() {
    const actualPage = merchantId ? '/' + merchantId : '/'
    window.location.href =
      actualPage + generateCarPostsQueryParams(stateToFilters(1))
  }

  const scrollToSearch = () => {
    setShowFilters(true)
    if (searchDivRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Open modal if URL includes an 'id'
  useEffect(() => {
    if (id) {
      setSelectedPostId(id)
    }
  }, [id, initialPosts])

  const PostCard = ({
    post,
    featured
  }: {
    post: CarPostListItem
    featured?: boolean
  }) => {
    return (
      <div
        key={post.id}
        className={`group justify-between w-full flex items-center mt-3 overflow-hidden rounded-xl text-xs lg:text-base xs:text-[0.7rem] text-ink-800 h-[8rem] lg:h-[10rem] bg-white ring-1 ring-ink-100 shadow-card transition-all duration-300 hover:shadow-card-hover hover:ring-ink-200 ${
          featured ? 'ring-gold-300 hover:ring-gold-400' : ''
        }`}
      >
        <button
          onClick={() => {
            setSelectedPostId(post.id)
            window.history.pushState(null, '', `/annonces/${post.id}`)
          }}
          className='flex flex-row w-4/5 space-x-2 lg:space-x-4 items-center'
        >
          <div className='relative overflow-hidden flex-shrink-0 w-28 lg:w-40 h-[8rem] lg:h-[10rem] bg-ink-100'>
            <CarImage
              src={post.image}
              alt={post.title}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
            {post.isExpired && <SoldBadge className='absolute top-2 left-2' />}
          </div>
          <div className='flex flex-col justify-between items-start h-[8rem] lg:h-[10rem] w-full py-2'>
            {post.title && (
              <span className='font-bold text-left xs:w-[8rem] w-[9rem] sm:w-[12rem] truncate text-[0.8rem] lg:w-[20rem] lg:text-base xs:text-[0.7rem]'>
                {post.title}
              </span>
            )}
            <span className='text-left xs:w-[8rem] w-[9rem] sm:w-[12rem] lg:w-[20rem] truncate'>
              {post.year ? post.year + ' ' : ''}
              {post.make && post.make !== 'Autres'
                ? post.make + ' ' + (post.model ?? '')
                : ''}
            </span>
            {post.km !== undefined && post.km !== null && (
              <span className='font-bold'>{dotNumber(post.km)} km</span>
            )}
            <span>
              {post.cv ? post.cv + 'cv ' : ''}
              {post.fuel}
            </span>
            {post.gearbox && <span>{post.gearbox}</span>}
            <div className='mt-auto flex space-x-1 lg:space-x-2 lg:flex-row text-left items-center'>
              <span
                className={`font-bold text-[0.8rem] lg:text-base xs:text-[0.7rem] ${
                  post.price && post.estimatedPrice
                    ? post.estimatedPrice.color === 'GREEN'
                      ? 'text-success mt-1'
                      : post.estimatedPrice.color === 'RED'
                      ? 'text-gold-600 mt-0'
                      : 'mt-1'
                    : 'mt-1'
                }`}
              >
                {post.price ? dotNumber(post.price) + ' DT' : 'Prix N.C.'}
              </span>
              {post.price && post.estimatedPrice && (
                <img
                  className={` ${
                    featured
                      ? 'h-3 w-3 lg:h-4 lg:w-4 mt-[3px] lg:mt-[5px]'
                      : 'h-5 lg:h-6 w-5 lg:w-6'
                  }`}
                  alt='estimation'
                  src={
                    featured
                      ? '/badge.svg'
                      : post.estimatedPrice.color === 'GREEN'
                      ? '/estim_down.svg'
                      : post.estimatedPrice.color === 'RED'
                      ? '/estim_up.svg'
                      : '/estim_ok.svg'
                  }
                />
              )}
              {!post.price && post.estimatedPrice && (
                <div className='flex items-center space-x-1 mt-2'>
                  <span
                    className={`font-normal italic text-[0.6rem] xs:text-[0.5rem] lg:text-xs ${
                      post.estimatedPrice.color === 'GREEN'
                        ? 'text-success'
                        : post.estimatedPrice.color === 'RED'
                        ? 'text-gold-600'
                        : 'text-ink-500'
                    }`}
                  >
                    {post.estimatedPrice.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        </button>

        <div className='flex flex-col items-center mr-2 text-center h-full justify-center space-y-2 text-xs xs:text-[0.6rem] xs:max-w-[4rem] max-w-[5rem] sm:max-w-[5.5rem] md:max-w-[6.5rem] h-[8rem] lg:h-[10rem]'>
          {post.publishedAtText && (
            <span className='w-full truncate'>{post.publishedAtText}</span>
          )}

          {post.phone && (
            <a href={`tel:${post.phone}`} className='w-full'>
              <button className='w-full font-semibold text-white bg-ink-950 p-1 md:p-2 md:px-4 px-3 rounded-lg hover:bg-brand-600 transition-colors duration-300 ease-in-out'>
                Appeler
              </button>
            </a>
          )}
          <div className='flex flex-row items-center'>
            {post.merchant.isShop && (
              <img src='/badge.svg' alt='Professionnel' className='h-3 w-3' />
            )}
            <span className='xs:max-w-[4rem] max-w-[5rem] md:w-full truncate'>
              {post.merchant.name}
            </span>
          </div>
          <div className='flex flex-row items-center'>
            <img
              src='/location.svg'
              alt='Adresse'
              className='h-3 lg:h-4 w-3 lg:w-4'
            />
            <span className='w-full truncate'>{post.region.name}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={searchDivRef}
        className='bg-ink-950 shadow-card text-white w-full mx-0 p-2 lg:p-3 text-center flex flex-col rounded-2xl ring-1 ring-white/10'
      >
        <div className='flex flex-row items-center gap-2'>
          <div className='relative flex-1'>
            <img
              src='/search.svg'
              alt=''
              aria-hidden='true'
              className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50'
            />
            <input
              readOnly={!showFilters}
              type='text'
              value={searchText}
              aria-label='Recherche par mot-clé'
              onClick={(e) => {
                // @ts-expect-error
                if (!showFilters) e.target.blur()
                setShowFilters(true)
              }}
              onChange={handleSearchTextChange}
              onKeyDown={(e) => e.key === 'Enter' && handleNewSearch()}
              placeholder={'Rechercher une voiture...'}
              className='w-full rounded-xl border-none bg-white/10 py-2.5 pl-10 pr-3 text-base lg:text-lg text-white placeholder-white/50 outline-none transition-colors focus:bg-white/15'
            />
          </div>

          <button
            aria-label='Lancer la recherche'
            className='shrink-0 rounded-xl bg-brand-600 p-2.5 px-4 font-semibold transition-colors duration-200 hover:bg-brand-500'
            onClick={() => {
              if (!showFilters) setShowFilters(true)
              else handleNewSearch()
            }}
          >
            <img
              src='/search.svg'
              alt=''
              aria-hidden='true'
              className='h-5 w-5 mx-auto'
            />
          </button>
          <button
            aria-label='Réinitialiser les filtres'
            className='shrink-0 rounded-xl bg-white/10 p-2.5 px-3.5 transition-colors duration-200 hover:bg-white/20'
            onClick={() => {
              window.location.href = merchantId ? `/${merchantId}` : '/'
            }}
          >
            <img
              src='/refresh.svg'
              alt=''
              aria-hidden='true'
              className='h-5 w-5 mx-auto'
            />
          </button>
        </div>
        {showFilters && (
          <div className='flex flex-col my-1 lg:my-2 text-sm lg:text-base'>
            <div className='lg:flex lg:flex-col'>
              <div className='flex mb-2'>
                <Select
                  placeholder={'Marque'}
                  noOptionsMessage={() => '...'}
                  options={carModels.map((car) => ({
                    value: car.make,
                    label: car.make
                  }))}
                  value={make}
                  isSearchable={false}
                  onChange={(selected) => {
                    if (selected?.value) setSearchText(selected.value)
                    setMake(selected ?? undefined)
                  }}
                  unstyled
                  styles={reactSelectFilterStyle}
                  className={`w-[95%] ml-[4px] bg-white/10 rounded`}
                  classNamePrefix='react-select'
                />
                {make && (
                  <Select
                    placeholder={'Modèle'}
                    noOptionsMessage={() => '...'}
                    options={carModels
                      .find((models) => models.make === make.value)
                      ?.models.map((model) => ({
                        value: model,
                        label: model
                      }))}
                    isSearchable={false}
                    value={model}
                    onChange={(selected) => {
                      if (selected?.value) {
                        let searchedModel = selected.value
                        if (searchedModel.length <= 2) {
                          searchedModel = `${make.value} ${searchedModel}`
                        }
                        setSearchText(searchedModel)
                      }
                      setModel(selected ?? undefined)
                    }}
                    unstyled
                    styles={reactSelectFilterStyle}
                    className='w-[95%] ml-[4px] bg-white/10 rounded mr-[2px]'
                    classNamePrefix='react-select'
                  />
                )}
              </div>
              <div className='w-full mt-[2px] md:flex'>
                <div className='hidden md:flex md:flex-col space-y-1'>
                  <MultiSelectList
                    items={Object.values(Fuel)}
                    selectedItems={fuel}
                    setSelectedItems={setFuel}
                  />
                  {!merchantId && (
                    <label className='flex items-center ml-3 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={isShop}
                        onChange={() => setIsShop(!isShop)}
                        className='mr-2 mt-[1.5px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer checked:bg-brand-600 border-white/30'
                      />
                      <span className=''>Vendeurs PRO</span>
                      <img
                        src='/badge.svg'
                        alt='Professionnel'
                        className='ml-1 h-3'
                      />
                    </label>
                  )}
                  <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={firstOwner}
                      onChange={() => setFirstOwner(!firstOwner)}
                      className='mt-[1.5px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                    />
                    <span className=''>Première main</span>
                  </label>
                  <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={isAuto}
                      onChange={() => setIsAuto(!isAuto)}
                      className='mt-[1.5px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                    />
                    <span className=''>Boîte automatique</span>
                  </label>
                </div>
                <div className='md:flex md:flex-col w-full md:space-y-2 md:ml-6 xl:ml-12 md:justify-center'>
                  <MinMaxSelector
                    min={minYear}
                    max={maxYear}
                    setMin={setMinYear}
                    setMax={setMaxYear}
                    label={'Année'}
                    maxLimit={2050}
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
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowMoreFilters(true)}
              className={`bg-white/20 w-[55%] mx-auto rounded-xl mt-2 font-semibold text-white text-opacity-85 ${
                showMoreFilters ? 'hidden' : ''
              }`}
            >
              Voir plus de filtres +
            </button>
            {showMoreFilters && (
              <div className='lg:flex lg:flex-col'>
                {!merchantId && (
                  <Select
                    isMulti
                    placeholder={'Gouvernorat...'}
                    noOptionsMessage={() => '...'}
                    options={regionsSelect}
                    value={regions}
                    isSearchable={false}
                    onChange={(selected) =>
                      setRegions(
                        selected as Array<{ value: string; label: string }>
                      )
                    }
                    unstyled
                    styles={reactSelectFilterStyle}
                    className='w-[95%] ml-[7px] mb-2 bg-white/10 rounded mt-3'
                    classNamePrefix='react-select'
                  />
                )}
                <div className='md:flex md:flex-row'>
                  <div className='flex flex-col space-y-[1px]'>
                    <div className='md:hidden'>
                      <MultiSelectList
                        items={Object.values(Fuel)}
                        selectedItems={fuel}
                        setSelectedItems={setFuel}
                      />
                      {!merchantId && (
                        <label className='flex items-center ml-3 cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={isShop}
                            onChange={() => setIsShop(!isShop)}
                            className='mr-2 mt-[1.5px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer checked:bg-brand-600 border-white/30'
                          />
                          <span className=''>Vendeurs PRO</span>
                          <img
                            src='/badge.svg'
                            alt='Professionnel'
                            className='ml-1 h-3'
                          />
                        </label>
                      )}
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={firstOwner}
                          onChange={() => setFirstOwner(!firstOwner)}
                          className='mt-[1.5px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>Première main</span>
                      </label>
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={isAuto}
                          onChange={() => setIsAuto(!isAuto)}
                          className='mt-[1.5px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>Boîte automatique</span>
                      </label>
                    </div>
                    <div className='md:flex md:flex-col md:space-y-1'>
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={alarm}
                          onChange={() => setAlarm(!alarm)}
                          className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>Alarme anti-vol</span>
                      </label>
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={keyless}
                          onChange={() => setKeyless(!keyless)}
                          className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>Démarrage sans clé</span>
                      </label>
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={camera}
                          onChange={() => setCamera(!camera)}
                          className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>Caméra de stationnement</span>
                      </label>
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={exchange}
                          onChange={() => setExchange(!exchange)}
                          className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>Echange possible</span>
                      </label>
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={leasing}
                          onChange={() => setLeasing(!leasing)}
                          className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>Leasing</span>
                      </label>
                      <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={fcr}
                          onChange={() => setFCR(!fcr)}
                          className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer border-white/30'
                        />
                        <span className=''>FCR</span>
                      </label>
                    </div>
                  </div>
                  <div className='flex flex-col space-y-[5px] md:ml-8 xl:ml-32 md:mt-4'>
                    <MinMaxSelector
                      min={minCV}
                      max={maxCV}
                      setMin={setMinCV}
                      setMax={setMaxCV}
                      label={'CV'}
                      maxLimit={99}
                    />
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
                  </div>
                </div>
                <button
                  onClick={() => handleNewSearch()}
                  className='bg-brand-600 text-white w-[55%] mx-auto rounded-xl mt-4 p-1 lg:p-2 lg:mt-4 font-semibold'
                >
                  Rechercher
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='flex my-1 lg:my-4 items-center'>
        <img src='/estim_down.svg' alt='estimation haute' className='h-6 w-6' />
        <img src='/estim_ok.svg' alt='estimation haute' className='h-6 w-6' />
        <img src='/estim_up.svg' alt='estimation haute' className='h-6 w-6' />
        <span className='text-black text-opacity-80 italic lg:text-base text-xs'>
          Prix par rapport à la moyenne du marché
        </span>
      </div>
      <div ref={searchDivRef} className='w-full mx-auto text-black'>
        {featuredPosts && featuredPosts.length > 0 && (
          <>
            <FeaturedCarPosts
              posts={featuredPosts}
              onSelect={(postId) => {
                setSelectedPostId(postId)
                window.history.pushState(null, '', `/annonces/${postId}`)
              }}
            />
            <div className='rounded w-full mt-2 mx-auto'>
              <FeedAd />
            </div>
          </>
        )}
        {!groupByMake &&
          posts.map((post, index) => (
            <>
              <PostCard post={post} />
              {index === 5 && (
                <div className='rounded w-full mt-2 mx-auto'>
                  <FeedAd2 />
                </div>
              )}
            </>
          ))}

        {groupByMake && (
          <>
            <div className='rounded w-full mt-2 mx-auto'>
              <FeedAd />
            </div>
            {posts
              .reduce(
                (
                  acc: Array<{ make: string; posts: CarPostListItem[] }>,
                  post: CarPostListItem
                ) => {
                  const existingMake = acc.find(
                    (group) => group.make === post.make
                  )

                  if (existingMake) {
                    existingMake.posts.push(post)
                  } else {
                    acc.push({
                      make: post.make,
                      posts: [post]
                    })
                  }

                  return acc
                },
                []
              )
              .map((postsByMake) => (
                <div key={postsByMake.make}>
                  <div className='mt-6 flex space-x-1 lg:space-x-2 items-center'>
                    {makesWithLogos.includes(
                      fromNameToId(postsByMake.make)
                    ) && (
                      <img
                        src={`/car-makes/${fromNameToId(postsByMake.make)}.svg`}
                        alt={postsByMake.make}
                        className='h-8'
                      />
                    )}
                    <h2>{postsByMake.make ?? ''}</h2>
                  </div>

                  {postsByMake.posts.map((post) => (
                    <PostCard post={post} />
                  ))}
                </div>
              ))}
          </>
        )}

        {loadingPosts && (
          <button className='text-white bg-ink-950/70 font-medium shadow-lg p-1 rounded-xl w-full text-center mt-10 text-lg lg:text-xl'>
            Chargement des annonces...
          </button>
        )}
        {!hasMore && !loadingPosts && (
          <>
            <p className='text-center mt-12 text-lg lg:text-xl'>
              {posts.length > 0 ? 'Fin des résultats.' : 'Aucun résultat.'}
            </p>
            {posts.length === 0 && (
              <div className='rounded w-full mt-2 mx-auto'>
                <FeedAd2 />
              </div>
            )}
          </>
        )}
        {hasMore && !loadingPosts && (
          <button
            className='text-white bg-brand-600 font-medium shadow-lg p-1 rounded-xl w-full text-center mt-10 text-lg lg:text-xl'
            onClick={() => fetchPosts(page + 1)}
          >
            Charger plus d'annonces +
          </button>
        )}

        <button
          onClick={scrollToSearch}
          className='fixed bottom-[3%] right-[3%] lg:bottom-[80%] lg:right-[15%] p-3 bg-brand-600 text-white rounded-full shadow-lg hover:bg-ink-950/70 transition'
        >
          <img
            src='/search.svg'
            alt='Rechercher'
            className='h-7 lg:h-8 w-7 lg:w-8 mx-auto'
          />
        </button>

        {selectedPostId && (
          <CarPostModal
            postId={selectedPostId}
            isMerchant={groupByMake}
            onClose={() => {
              setSelectedPostId(null)
              if (merchantId)
                window.history.replaceState(null, '', `/${merchantId}`)
              else {
                const queryString = generateCarPostsQueryParams(
                  stateToFilters(page)
                ).replace(/page=\d+&?/g, 'page=1')
                const oldPathWithParams = `/${
                  queryString && queryString !== '?' ? `${queryString}` : ''
                }`
                window.history.replaceState(null, '', oldPathWithParams)
              }
            }}
          />
        )}
      </div>
    </>
  )
}
