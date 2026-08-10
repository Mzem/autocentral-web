'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faSpinner,
  faRotateLeft,
  faCalendarDays,
  faGaugeHigh,
  faGasPump,
  faGears,
  faBolt,
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
import { dotNumber, fromNameToId, noPriceText } from '../../helpers'
import { carModels, Fuel, fuelLabel, makesWithLogos } from '../../types'
import { reactSelectFilterStyle } from '../customStyles'
import MultiSelectList from '../MultiSelector'
import RangeSlider from '../RangeSlider'
import FeedAd from '../ads/FeedAd'
import FeedAd2 from '../ads/FeedAd2'
import FeaturedCarPosts from './FeaturedCarPosts'
import CarImage, { SoldBadge } from './CarImage'
import EstimateModal from './EstimateModal'

// Realistic slider bounds per criterion; a value at the bound = "no filter".
const YEAR_MIN = 1960
const YEAR_MAX = 2026
const KM_MAX = 400000
const PRICE_MAX = 500000
const CV_MIN = 2
const CV_MAX = 60

// Same centred container as the rest of the site (MainShell) so the white
// content lines up with the other pages; the black criteria band stays
// full-width (black spilling to the edges) with its content aligned.
const CONTAINER = 'mx-auto w-[94%] sm:w-[92%] lg:w-[88%] xl:max-w-6xl'

type SellerType = 'all' | 'pro' | 'private'
type GearboxChoice = 'all' | 'Automatique' | 'Manuelle'

/** Small segmented pill selector. */
function Segmented<T extends string>({
  value,
  onChange,
  options
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className='inline-flex rounded-lg bg-white/10 p-0.5'>
      {options.map((o) => (
        <button
          key={o.value}
          type='button'
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
            value === o.value
              ? 'bg-brand-600 text-white'
              : 'text-white/70 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function CarPostsFeed({
  initialPosts,
  featuredPosts,
  initialFilters
}: {
  initialPosts: CarPostListItem[]
  featuredPosts?: CarPostListItem[]
  initialFilters?: GetCarPostsFilters
}) {
  const pathname = usePathname()
  const pathnameSplit = pathname.split('/')
  const id =
    pathnameSplit[1] === 'annonces' && pathnameSplit[2]
      ? pathnameSplit[2]
      : undefined

  const [merchantId] = useState(initialFilters?.merchantId)
  const groupByMake = Boolean(merchantId)
  // On a merchant page the content fills its (already-centred) layout with no
  // extra padding and dark background → light text; the /annonces search uses
  // the centred CONTAINER on a white page → dark text.
  const contentWrap = merchantId ? 'mx-auto w-full' : CONTAINER
  const contentText = merchantId ? 'text-white' : 'text-ink-900'

  const [posts, setPosts] = useState<CarPostListItem[]>(initialPosts)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialPosts.length !== 0 && !merchantId
  )
  const [, setSelectedPostId] = useState<string | null>(null)

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
  const [fuel, setFuel] = useState(initialFilters?.fuel || [])
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice)
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice)
  const [maxKm, setMaxKm] = useState(initialFilters?.maxKm)
  const [minKm, setMinKm] = useState(initialFilters?.minKm)
  const [maxYear, setMaxYear] = useState(initialFilters?.maxYear)
  const [minYear, setMinYear] = useState(initialFilters?.minYear)
  const [maxCV, setMaxCV] = useState(initialFilters?.maxCV)
  const [minCV, setMinCV] = useState(initialFilters?.minCV)
  const [sellerType, setSellerType] = useState<SellerType>(
    initialFilters?.isShop === true
      ? 'pro'
      : initialFilters?.isShop === false
      ? 'private'
      : 'all'
  )
  const [gearbox, setGearbox] = useState<GearboxChoice>(
    (initialFilters?.gearbox as GearboxChoice) || 'all'
  )
  const [firstOwner, setFirstOwner] = useState(
    initialFilters?.firstOwner || false
  )
  const [searchText, setSearchText] = useState<string>(initialFilters?.q || '')

  const [showFilters, setShowFilters] = useState(merchantId ? false : true)
  // A relevance search (make/model/text) surfaces only the last 4 months by
  // default; "broaden" lifts that freshness window. `freshnessLimited` reflects
  // the query that produced the CURRENT results (so the note/button match them).
  const [broaden, setBroaden] = useState(false)
  const [freshnessLimited, setFreshnessLimited] = useState(false)

  const searchDivRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  function stateToFilters(page: number): GetCarPostsFilters {
    return {
      page,
      merchantId,
      fuel,
      maxPrice,
      minPrice,
      maxKm,
      minKm,
      maxCV,
      minCV,
      maxYear,
      minYear,
      isShop:
        sellerType === 'pro'
          ? true
          : sellerType === 'private'
          ? false
          : undefined,
      gearbox: gearbox === 'all' ? undefined : gearbox,
      firstOwner,
      q: searchText
    }
  }

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 30) setSearchText(input)
  }

  // `broadenArg` defaults to the current state so infinite-scroll keeps whatever
  // window the last search used; explicit calls (new search / "broaden") pass it.
  function fetchPosts(page: number, broadenArg: boolean = broaden) {
    setPage(page)
    setLoadingPosts(true)
    const filters = { ...stateToFilters(page), broaden: broadenArg }
    const relevance = !!filters.q && filters.q.trim().length > 0
    const url = '/api/car-posts/' + generateCarPostsQueryParams(filters)
    fetch(url, { cache: 'no-store' })
      .then((res) => res.json())
      .then((newPosts) => {
        if (page === 1) setPosts(newPosts)
        else setPosts([...posts, ...newPosts])
        setHasMore(newPosts.length !== 0)
        setFreshnessLimited(relevance && !broadenArg)
        setLoadingPosts(false)
      })
      .catch(() => setLoadingPosts(false))
  }

  function handleNewSearch() {
    // A brand-new search resets the freshness window back to "last 4 months".
    setBroaden(false)
    const qp = generateCarPostsQueryParams(stateToFilters(1))
    if (merchantId) {
      // Merchant page keeps the server round-trip (30-day filter is server-side).
      window.location.href = '/' + merchantId + qp
      return
    }
    // /annonces: search in place — update the URL, scroll to results, show the
    // loader and disable the button while it fetches (no full reload).
    window.history.replaceState(null, '', '/annonces' + qp)
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )
    fetchPosts(1, false)
  }

  // "Élargir" — re-run the same search without the 4-month freshness window.
  function broadenSearch() {
    setBroaden(true)
    fetchPosts(1, true)
  }

  const scrollToSearch = () => {
    setShowFilters(true)
    if (searchDivRef.current) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (id) setSelectedPostId(id)
  }, [id, initialPosts])

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

  // Card matching the home showroom (square, 4:3 photo, black details panel).
  // No "Appeler" and no region here - these are external (non-Tunisian Cars)
  // listings. The market-price symbol sits bottom-right of the photo.
  const PostCard = ({ post }: { post: CarPostListItem }) => {
    const spec = (icon: typeof faGaugeHigh, value: React.ReactNode) =>
      value ? (
        <span className='inline-flex items-center gap-0.5'>
          <FontAwesomeIcon icon={icon} className='h-3 w-3 text-white' />
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
        : 'text-ink-200'

    return (
      <li className='w-full list-none'>
        <Link
          href={`/annonces/${post.id}`}
          scroll={false}
          className='group block overflow-hidden shadow-card-light transition-shadow hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
        >
          <div className='relative flex w-full flex-col overflow-hidden bg-black'>
            <div className='relative aspect-[4/3] w-full overflow-hidden bg-ink-900'>
              <CarImage
                src={post.image}
                alt={post.title}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
              {post.isExpired && (
                <SoldBadge className='absolute left-2.5 top-2.5' />
              )}

              {/* Price pill + market-price symbol, together at bottom-left. */}
              <div className='absolute bottom-2.5 left-2.5 flex items-center'>
                <span
                  className={`mr-4 inline-flex h-7 items-center rounded-md px-2.5 text-xs font-extrabold shadow ${
                    post.price
                      ? 'bg-brand/50 text-white'
                      : 'bg-black/55 text-white backdrop-blur-sm'
                  }`}
                >
                  {post.price
                    ? `${dotNumber(post.price)} DT`
                    : estim
                    ? `${dotNumber(estim.value)} DT estimé`
                    : noPriceText(post.merchant?.id)}
                </span>

                {/* Only for a real price — comparing an estimate to itself is
                    meaningless. Square, same height as the price pill. */}
                {post.price && estim && (
                  <span
                    title={estim.text}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/55 text-sm backdrop-blur-sm ${estimColor}`}
                  >
                    <FontAwesomeIcon icon={estimIcon} className='h-3.5 w-3.5' />
                  </span>
                )}
              </div>
            </div>

            {/* Fixed-height panel so every card matches, even with empty spec
                lines; "Publié" is pushed to the very bottom (mt-auto). */}
            <div className='flex h-[6.5rem] flex-col overflow-hidden bg-blackopac3 px-3 py-2 text-white'>
              <h3 className='truncate text-sm font-bold leading-tight lg:text-base'>
                {post.title || `${post.make ?? ''} ${post.model ?? ''}`.trim()}
              </h3>
              <div className='mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.68rem] text-white/85 lg:text-xs'>
                {spec(faCalendarDays, post.year)}
                {spec(
                  faGaugeHigh,
                  post.km != null ? `${dotNumber(post.km)} km` : null
                )}
              </div>
              <div className='mt-0.5 flex flex-wrap items-center gap-x-1 text-[0.68rem] text-white/85 lg:text-xs'>
                {spec(faGasPump, fuelLabel(post.fuel))}
                {spec(faBolt, post.cv ? `${post.cv} cv` : null)}
                {spec(faGears, post.gearbox)}
              </div>
              {post.publishedAtText && (
                <div className='mt-auto flex items-center gap-1 pt-1 text-[0.6rem] text-white/55'>
                  <FontAwesomeIcon icon={faClock} className='h-2.5 w-2.5' />
                  Publié {post.publishedAtText}
                </div>
              )}
            </div>
          </div>
        </Link>
      </li>
    )
  }

  return (
    <>
      {!merchantId && (
        <div
          className={`${CONTAINER} mb-6 lg:mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center`}
        >
          <p className='text-md font-bold text-ink-900 lg:text-xl'>
            <span className='text-brand-600'>+100 000</span> annonces
            disponibles
          </p>
          <EstimateModal />
        </div>
      )}
      <div
        ref={searchDivRef}
        className='w-full bg-black py-3 text-left text-white lg:py-4'
      >
        <div className={`${contentWrap} flex flex-col`}>
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
                  // @ts-expect-error blur to avoid keyboard when only opening filters
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
              disabled={loadingPosts}
              className='inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-semibold shadow-lg shadow-brand-600/25 transition-colors duration-200 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60'
              onClick={() => {
                if (!showFilters) setShowFilters(true)
                else handleNewSearch()
              }}
            >
              <FontAwesomeIcon
                icon={loadingPosts ? faSpinner : faMagnifyingGlass}
                aria-hidden='true'
                className={`h-5 w-5 ${loadingPosts ? 'animate-spin' : ''}`}
              />
              <span className='hidden md:inline'>Rechercher</span>
            </button>
            <button
              aria-label='Réinitialiser les filtres'
              className='inline-flex shrink-0 items-center justify-center rounded-xl bg-white/10 p-2.5 px-3.5 transition-colors duration-200 hover:bg-white/20'
              onClick={() => {
                window.location.href = merchantId
                  ? `/${merchantId}`
                  : '/annonces'
              }}
            >
              <FontAwesomeIcon
                icon={faRotateLeft}
                aria-hidden='true'
                className='h-5 w-5'
              />
            </button>
          </div>

          {showFilters && (
            <div className='mt-3 space-y-4 text-sm'>
              {/* Marque / Modèle */}
              <div className='flex gap-2'>
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
                    setModel(undefined)
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
                      ?.models.map((model) => ({ value: model, label: model }))}
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

              {/* Carburant */}
              <div>
                <p className='mb-1 ml-3 text-xs font-semibold uppercase tracking-wide text-white/50'>
                  Carburant
                </p>
                <MultiSelectList
                  items={Object.values(Fuel)}
                  selectedItems={fuel}
                  setSelectedItems={setFuel}
                />
              </div>

              {/* Boîte / Vendeur / Première main */}
              <div className='ml-3 flex flex-wrap items-end gap-x-6 gap-y-3'>
                <div>
                  <p className='mb-1 text-xs font-semibold uppercase tracking-wide text-white/50'>
                    Boîte
                  </p>
                  <Segmented
                    value={gearbox}
                    onChange={setGearbox}
                    options={[
                      { value: 'all', label: 'Toutes' },
                      { value: 'Automatique', label: 'Auto' },
                      { value: 'Manuelle', label: 'Manuelle' }
                    ]}
                  />
                </div>
                {!merchantId && (
                  <div>
                    <p className='mb-1 text-xs font-semibold uppercase tracking-wide text-white/50'>
                      Vendeur
                    </p>
                    <Segmented
                      value={sellerType}
                      onChange={setSellerType}
                      options={[
                        { value: 'all', label: 'Tous' },
                        { value: 'pro', label: 'Pro' },
                        { value: 'private', label: 'Particulier' }
                      ]}
                    />
                  </div>
                )}
                <label className='flex cursor-pointer items-center gap-2 pb-1'>
                  <input
                    type='checkbox'
                    checked={firstOwner}
                    onChange={() => setFirstOwner(!firstOwner)}
                    className='h-5 w-5 cursor-pointer rounded border-white/30'
                  />
                  <span>Première main</span>
                </label>
              </div>

              {/* Sliders réalistes — 1 par ligne en mobile */}
              <div className='grid grid-cols-1 gap-x-8 gap-y-4 px-3 md:grid-cols-2'>
                <RangeSlider
                  label='Année'
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  step={1}
                  valueMin={minYear ?? YEAR_MIN}
                  valueMax={maxYear ?? YEAR_MAX}
                  onChange={(lo, hi) => {
                    setMinYear(lo <= YEAR_MIN ? undefined : lo)
                    setMaxYear(hi >= YEAR_MAX ? undefined : hi)
                  }}
                />
                <RangeSlider
                  label='Kilométrage'
                  unit='km'
                  min={0}
                  max={KM_MAX}
                  step={5000}
                  valueMin={minKm ?? 0}
                  valueMax={maxKm ?? KM_MAX}
                  format={(n) => dotNumber(n) ?? `${n}`}
                  onChange={(lo, hi) => {
                    setMinKm(lo <= 0 ? undefined : lo)
                    setMaxKm(hi >= KM_MAX ? undefined : hi)
                  }}
                />
                <RangeSlider
                  label='Prix'
                  unit='DT'
                  min={0}
                  max={PRICE_MAX}
                  step={5000}
                  valueMin={minPrice ?? 0}
                  valueMax={maxPrice ?? PRICE_MAX}
                  format={(n) => dotNumber(n) ?? `${n}`}
                  onChange={(lo, hi) => {
                    setMinPrice(lo <= 0 ? undefined : lo)
                    setMaxPrice(hi >= PRICE_MAX ? undefined : hi)
                  }}
                />
                <RangeSlider
                  label='Puissance'
                  unit='cv'
                  min={CV_MIN}
                  max={CV_MAX}
                  step={1}
                  valueMin={minCV ?? CV_MIN}
                  valueMax={maxCV ?? CV_MAX}
                  onChange={(lo, hi) => {
                    setMinCV(lo <= CV_MIN ? undefined : lo)
                    setMaxCV(hi >= CV_MAX ? undefined : hi)
                  }}
                />
              </div>

              <button
                onClick={() => handleNewSearch()}
                disabled={loadingPosts}
                className='mx-auto mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 p-2 font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loadingPosts && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className='h-4 w-4 animate-spin'
                  />
                )}
                Rechercher
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`${contentWrap} my-1 flex items-center gap-2 lg:my-4`}>
        <FontAwesomeIcon
          icon={faArrowTrendDown}
          className='h-4 w-4 text-success'
        />
        <FontAwesomeIcon icon={faEquals} className='h-4 w-4 text-ink-400' />
        <FontAwesomeIcon
          icon={faArrowTrendUp}
          className='h-4 w-4 text-danger'
        />
        <span
          className={`text-xs italic lg:text-base ${
            merchantId ? 'text-white/70' : 'text-ink-600'
          }`}
        >
          Prix par rapport à la moyenne du marché
        </span>
      </div>

      {!merchantId && freshnessLimited && (
        <div
          className={`${contentWrap} mb-3 flex flex-col gap-2 rounded-xl bg-brand-500/5 p-3 ring-1 ring-brand-500/15 sm:flex-row sm:items-center sm:justify-between`}
        >
          <p className='flex items-center gap-2 text-xs text-ink-600 lg:text-sm'>
            <FontAwesomeIcon
              icon={faClock}
              className='h-4 w-4 shrink-0 text-brand-500'
            />
            Résultats des 4 derniers mois pour cette recherche.
          </p>
          <button
            type='button'
            onClick={broadenSearch}
            disabled={loadingPosts}
            className='inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 lg:text-sm'
          >
            {loadingPosts && (
              <FontAwesomeIcon
                icon={faSpinner}
                className='h-3.5 w-3.5 animate-spin'
              />
            )}
            Élargir à toutes les annonces
          </button>
        </div>
      )}

      <div ref={resultsRef} className={`${contentWrap} ${contentText}`}>
        {featuredPosts && featuredPosts.length > 0 && (
          <>
            <FeaturedCarPosts
              posts={featuredPosts}
              onSelect={(postId) => {
                setSelectedPostId(postId)
                window.history.pushState(null, '', `/annonces/${postId}`)
              }}
            />
            <div className='mx-auto mt-2 w-full rounded'>
              <FeedAd />
            </div>
          </>
        )}

        {!groupByMake && (
          <ul className='mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
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
            <div className='mx-auto mt-2 w-full rounded'>
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
                  if (existingMake) existingMake.posts.push(post)
                  else acc.push({ make: post.make, posts: [post] })
                  return acc
                },
                []
              )
              // Marques triées par ordre alphabétique.
              .sort((a, b) => (a.make ?? '').localeCompare(b.make ?? ''))
              .map((postsByMake) => (
                <div key={postsByMake.make}>
                  <div className='mt-6 flex items-center space-x-1 lg:space-x-2'>
                    {makesWithLogos.includes(
                      fromNameToId(postsByMake.make)
                    ) && (
                      <img
                        src={`/car-makes/${fromNameToId(postsByMake.make)}.svg`}
                        alt={postsByMake.make}
                        // The BMW roundel becomes an unreadable white blob when
                        // silhouetted (brightness-0 invert), so keep its real
                        // colours on a small white chip.
                        className={`h-8 object-contain ${
                          fromNameToId(postsByMake.make) === 'bmw'
                            ? 'rounded-full bg-white p-0.5'
                            : 'opacity-80 brightness-0 invert'
                        }`}
                      />
                    )}
                    <h2>{postsByMake.make ?? ''}</h2>
                  </div>
                  <ul className='mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
                    {postsByMake.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </ul>
                </div>
              ))}
          </>
        )}

        {loadingPosts && (
          <button className='mt-10 w-full bg-black p-1 text-center text-lg text-white shadow-lg lg:text-xl'>
            Chargement des annonces...
          </button>
        )}
        {!hasMore && !loadingPosts && (
          <>
            <p className='mt-12 text-center text-lg lg:text-xl'>
              {posts.length > 0 ? 'Fin des résultats.' : 'Aucun résultat.'}
            </p>
            {posts.length === 0 && (
              <div className='mx-auto mt-2 w-full rounded'>
                <FeedAd2 />
              </div>
            )}
          </>
        )}

        <div ref={loadMoreRef} className='h-1 w-full' />
        {hasMore && !loadingPosts && (
          <button
            className='mt-10 w-full rounded-xl bg-brand-600 p-1 text-center text-lg font-medium text-white shadow-lg lg:text-xl'
            onClick={() => fetchPosts(page + 1)}
          >
            Charger plus d&apos;annonces +
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
