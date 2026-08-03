'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faRotateLeft,
  faLocationDot,
  faGaugeHigh,
  faGasPump,
  faGears,
  faBolt,
  faCircleCheck,
  faArrowTrendDown,
  faArrowTrendUp,
  faEquals,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import {
  CarPostListItem,
  generateCarPostsQueryParams,
  GetCarPostsFilters
} from '../../../api/services/car-posts.service'
import { dotNumber, fromNameToId } from '../../helpers'
import {
  carModels,
  Fuel,
  fuelLabel,
  InteriorType,
  makesWithLogos,
  regionsSelect
} from '../../types'
import FeedAd from '../ads/FeedAd'
import ColorSelector from '../ColorSelector'
import { reactSelectFilterStyle } from '../customStyles'
import MinMaxSelector from '../MinMaxSelector'
import MultiSelectList from '../MultiSelector'
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
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

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
    const actualPage = merchantId ? '/' + merchantId : '/annonces'
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

  // Infinite scroll: auto-load the next page when the sentinel nears the viewport.
  useEffect(() => {
    if (!hasMore || loadingPosts) return
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchPosts(page + 1)
      },
      { rootMargin: '600px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadingPosts, page, posts])

  const PostCard = ({
    post,
    featured
  }: {
    post: CarPostListItem
    featured?: boolean
  }) => {
    const spec = (icon: typeof faGaugeHigh, value: React.ReactNode) =>
      value ? (
        <span className='inline-flex items-center gap-1.5 text-ink-300'>
          <FontAwesomeIcon icon={icon} className='h-3.5 w-3.5 text-ink-500' />
          {value}
        </span>
      ) : null

    const estim = post.estimatedPrice
    const estimIcon =
      estim?.color === 'GREEN'
        ? faArrowTrendDown
        : estim?.color === 'RED'
        ? faArrowTrendUp
        : faEquals
    const estimColor =
      estim?.color === 'GREEN'
        ? 'text-success'
        : estim?.color === 'RED'
        ? 'text-danger'
        : 'text-ink-400'

    return (
      <li className='list-none'>
        <Link
          href={`/annonces/${post.id}`}
          scroll={false}
          className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover hover:ring-white/20 ${
            featured ? 'ring-brand-500/40' : ''
          }`}
        >
          <div className='relative aspect-[4/3] w-full overflow-hidden bg-surface-raised'>
            <CarImage
              src={post.image}
              alt={post.title}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
            {post.isExpired && <SoldBadge className='absolute left-3 top-3' />}
            <span className='absolute bottom-3 left-3 rounded-lg bg-black/75 px-2.5 py-1 text-sm font-extrabold text-white backdrop-blur-sm'>
              {post.price ? dotNumber(post.price) + ' DT' : 'Prix sur demande'}
            </span>
            {post.price && estim && (
              <span
                className={`absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-xs font-semibold backdrop-blur-sm ${estimColor}`}
                title={estim.text}
              >
                <FontAwesomeIcon icon={estimIcon} className='h-3 w-3' />
              </span>
            )}
          </div>

          <div className='flex flex-1 flex-col p-4 text-white'>
            <h3 className='truncate font-bold'>
              {post.title || `${post.make ?? ''} ${post.model ?? ''}`.trim()}
            </h3>
            <p className='mt-0.5 truncate text-sm text-ink-400'>
              {[
                post.year,
                post.make && post.make !== 'Autres' ? post.make : null,
                post.model
              ]
                .filter(Boolean)
                .join(' ')}
            </p>

            <div className='mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm'>
              {spec(faGaugeHigh, post.km != null && `${dotNumber(post.km)} km`)}
              {spec(faGasPump, fuelLabel(post.fuel))}
              {spec(faGears, post.gearbox)}
              {spec(faBolt, post.cv && `${post.cv} cv`)}
            </div>

            {!post.price && estim && (
              <span className={`mt-2 text-xs italic ${estimColor}`}>
                {estim.text}
              </span>
            )}

            {post.publishedAtText && (
              <span className='mt-2 inline-flex items-center gap-1.5 text-xs text-ink-500'>
                <FontAwesomeIcon icon={faClock} className='h-3 w-3' />
                {post.publishedAtText}
              </span>
            )}

            <div className='mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs text-ink-400'>
              <span className='inline-flex min-w-0 items-center gap-1.5'>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className='h-3 w-3 shrink-0'
                />
                <span className='truncate'>{post.region.name}</span>
              </span>
              <span className='inline-flex min-w-0 items-center gap-1.5'>
                {post.merchant.isShop && (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className='h-3 w-3 shrink-0 text-brand-400'
                  />
                )}
                <span className='truncate'>{post.merchant.name}</span>
              </span>
            </div>
          </div>
        </Link>
      </li>
    )
  }

  return (
    <>
      <div
        ref={searchDivRef}
        className='flex w-full flex-col rounded-2xl bg-gradient-to-b from-surface to-ink-950 p-3 text-left text-white shadow-card ring-1 ring-white/10 lg:p-4'
      >
        <div className='flex flex-row items-center gap-2'>
          <div className='relative flex-1'>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              aria-hidden='true'
              className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50'
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
            className='inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-semibold shadow-lg shadow-brand-600/25 transition-colors duration-200 hover:bg-brand-500'
            onClick={() => {
              if (!showFilters) setShowFilters(true)
              else handleNewSearch()
            }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              aria-hidden='true'
              className='h-5 w-5'
            />
            <span className='hidden sm:inline'>Rechercher</span>
          </button>
          <button
            aria-label='Réinitialiser les filtres'
            className='shrink-0 rounded-xl bg-white/10 p-2.5 px-3.5 transition-colors duration-200 hover:bg-white/20'
            onClick={() => {
              window.location.href = merchantId ? `/${merchantId}` : '/annonces'
            }}
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              aria-hidden='true'
              className='mx-auto h-5 w-5'
            />
          </button>
        </div>
        {showFilters && (
          <div className='flex flex-col my-1 lg:my-2 text-sm lg:text-base'>
            <div className='lg:flex lg:flex-col'>
              <div className='mb-2 flex gap-2'>
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
                  className='flex-1 rounded-lg bg-white/10'
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
                    className='flex-1 rounded-lg bg-white/10'
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
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className='ml-1 h-3.5 w-3.5 text-brand-400'
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
              className={`mx-auto mt-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white/85 ring-1 ring-white/15 transition-colors hover:bg-white/20 ${
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
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className='ml-1 h-3.5 w-3.5 text-brand-400'
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

      <div className='my-1 flex items-center gap-2 lg:my-4'>
        <FontAwesomeIcon
          icon={faArrowTrendDown}
          className='h-4 w-4 text-success'
        />
        <FontAwesomeIcon icon={faEquals} className='h-4 w-4 text-ink-400' />
        <FontAwesomeIcon
          icon={faArrowTrendUp}
          className='h-4 w-4 text-danger'
        />
        <span className='text-xs italic text-white/80 lg:text-base'>
          Prix par rapport à la moyenne du marché
        </span>
      </div>
      <div ref={searchDivRef} className='w-full mx-auto text-white'>
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
        {!groupByMake && (
          <ul className='mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <PostCard post={post} />
                {index === 5 && (
                  <li className='col-span-full list-none'>
                    <FeedAd2 />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}

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
                        className='h-8 object-contain brightness-0 invert opacity-80'
                      />
                    )}
                    <h2>{postsByMake.make ?? ''}</h2>
                  </div>

                  <ul className='mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                    {postsByMake.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </ul>
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
        {/* Infinite-scroll sentinel: auto-loads the next page when in view. */}
        <div ref={loadMoreRef} className='h-1 w-full' />
        {hasMore && !loadingPosts && (
          <button
            className='text-white bg-brand-600 font-medium shadow-lg p-1 rounded-xl w-full text-center mt-10 text-lg lg:text-xl'
            onClick={() => fetchPosts(page + 1)}
          >
            Charger plus d'annonces +
          </button>
        )}

        {/* Mobile only: round FAB fixed at the bottom, back to the search bar. */}
        <button
          onClick={scrollToSearch}
          aria-label='Revenir à la recherche'
          className='fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 ring-4 ring-brand-600/20 transition hover:bg-brand-500 md:hidden'
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className='h-6 w-6' />
        </button>
      </div>
    </>
  )
}
