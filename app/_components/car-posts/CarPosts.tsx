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
import { Fuel, InteriorType, makesWithLogos, regionsSelect } from '../../types'
import ColorSelector from '../ColorSelector'
import { reactSelectFilterStyle } from '../customStyles'
import MinMaxSelector from '../MinMaxSelector'
import MultiSelectList from '../MultiSelector'
import CarPostModal from './CarPostModal'

const API_PAGE_SIZE = 20

export default function CarPostsFeed({
  initialPosts,
  initialFilters
}: {
  initialPosts: CarPostListItem[]
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
    initialPosts.length === API_PAGE_SIZE && !merchantId
  )
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  // Filters
  const [page, setPage] = useState(initialFilters?.page || 1)

  const [make, setMake] = useState(initialFilters?.make)
  const [model, setModel] = useState(initialFilters?.model)
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

  function stateToFilters(page: number): GetCarPostsFilters {
    return {
      page,
      merchantId,
      make,
      model,
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
        setHasMore(newPosts.length === API_PAGE_SIZE)
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

  const PostCard = ({ post }: { post: CarPostListItem }) => {
    return (
      <div
        key={post.id}
        className='justify-between w-full flex items-center mt-2 shadow-md rounded bg-whiteopac hover:bg-whiteBGDarker text-xs lg:text-base xs:text-[0.7rem] text-blacklight h-[8rem] lg:h-[10rem]'
      >
        <button
          onClick={() => {
            setSelectedPostId(post.id)
            window.history.pushState(null, '', `/annonces/${post.id}`)
          }}
          className='flex flex-row w-4/5 space-x-1 lg:space-x-4 items-center'
        >
          <img
            src={post.image}
            alt={post.title}
            className='w-28 lg:w-40 object-cover rounded flex-shrink-0 h-[8rem] lg:h-[10rem]'
          />
          <div className='flex flex-col justify-between items-start h-[8rem] lg:h-[10rem] w-full'>
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
                className={`font-bold mt-1 text-[0.8rem] lg:text-base xs:text-[0.7rem] ${
                  post.price && post.estimatedPrice
                    ? post.estimatedPrice.color === 'GREEN'
                      ? 'text-green'
                      : post.estimatedPrice.color === 'RED'
                      ? 'text-rolexgold'
                      : ''
                    : ''
                }`}
              >
                {post.price ? dotNumber(post.price) + ' DT' : 'Prix N.C.'}
              </span>
              {post.price && post.estimatedPrice && (
                <img
                  className='h-5 lg:h-6'
                  alt='estimation'
                  src={
                    post.estimatedPrice.color === 'GREEN'
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
                        ? 'text-green'
                        : post.estimatedPrice.color === 'RED'
                        ? 'text-rolexgold'
                        : 'text-blackopac2'
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
              <button className='text-white bg-blackopac border border-whiteopac p-1 md:p-2 md:px-4 px-3 rounded-xl hover:bg-titan transition duration-300 ease-in-out'>
                Appeler
              </button>
            </a>
          )}
          <div className='flex flex-row items-center w-full truncate xs:w-[3rem] w-[4rem] sm:w-[5rem] lg:w-[6rem]'>
            {post.merchant.isShop && <img src='/badge.svg' className='h-3' />}
            <span className='w-full truncate'>{post.merchant.name}</span>
          </div>
          <div className='flex flex-row items-center'>
            <img src='/location.svg' className='h-3 lg:h-4' />
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
        className='bg-black bg-opacity-85 w-full p-[2px] rounded-lg text-center flex flex-col'
      >
        <div className='flex flex-row items-center justify-between'>
          <input
            readOnly={!showFilters}
            type='text'
            value={searchText}
            onClick={(e) => {
              // @ts-expect-error
              if (!showFilters) e.target.blur()
              setShowFilters(true)
            }}
            onChange={handleSearchTextChange}
            onKeyDown={(e) => e.key === 'Enter' && handleNewSearch()}
            placeholder={
              showFilters ? 'Taper un mot clé...' : 'Rechercher un véhicule...'
            }
            className={`ml-1 py-1 xs:px-1 my-1 placeholder-white rounded-lg border-none text-base lg:text-xl outline-none w-[65%] lg:w-[75%] ${
              showFilters ? 'bg-whiteopac' : 'bg-whiteopac2'
            }`}
          />

          <div>
            <button
              className='xs:w-12 w-14 sm:w-16 p-2 mr-[2px] lg:mr-2 bg-vividred rounded hover:bg-titan transition duration-300 ease-in-out'
              onClick={() => {
                if (!showFilters) setShowFilters(true)
                else handleNewSearch()
              }}
            >
              <img
                src='/search.svg'
                alt='Lancer la recherche'
                className='xs:h-4 h-5 mx-auto'
              />
            </button>
            <button
              className='xs:w-10 w-12 sm:w-14 p-2 mr-[1px] lg:mr-2 bg-pureblack rounded hover:bg-titan transition duration-300 ease-in-out'
              onClick={() => {
                window.location.href = merchantId ? `/${merchantId}` : '/'
              }}
            >
              <img
                src='/refresh.svg'
                alt='Réinitialiser les filtres'
                className='xs:h-4 h-5 mx-auto'
              />
            </button>
          </div>
        </div>
        {showFilters && (
          <div className='flex flex-col my-1 lg:my-2 text-sm lg:text-base'>
            <div className='lg:flex lg:space-x-8'>
              <div>
                {!merchantId && (
                  <label className='flex items-center ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={isShop}
                      onChange={() => setIsShop(!isShop)}
                      className='mr-2 mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer checked:bg-vividred'
                    />
                    <span className=''>Vendeurs PRO</span>
                    <img src='/badge.svg' className='ml-1 h-3' />
                  </label>
                )}
                <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={firstOwner}
                    onChange={() => setFirstOwner(!firstOwner)}
                    className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer'
                  />
                  <span className=''>Première main</span>
                </label>
                <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={isAuto}
                    onChange={() => setIsAuto(!isAuto)}
                    className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer'
                  />
                  <span className=''>Boîte automatique</span>
                </label>
                <MultiSelectList
                  items={Object.values(Fuel)}
                  selectedItems={fuel}
                  setSelectedItems={setFuel}
                />
              </div>
              <div className='w-full'>
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
                {!merchantId && (
                  <Select
                    isMulti
                    placeholder={'Gouvernorat...'}
                    noOptionsMessage={() => '...'}
                    options={regionsSelect}
                    value={regions}
                    onChange={(selected) =>
                      setRegions(
                        selected as Array<{ value: string; label: string }>
                      )
                    }
                    unstyled
                    styles={reactSelectFilterStyle}
                    className='w-[95%] ml-[11px] mb-1 bg-whiteopac2 rounded mt-2'
                    classNamePrefix='react-select'
                  />
                )}
              </div>
            </div>
            <button
              onClick={() => setShowMoreFilters(true)}
              className={`bg-whiteopac w-[50%] mx-auto rounded-xl mb-1 mt-3 hover:underline ${
                showMoreFilters ? 'underline cursor-default' : ''
              }`}
            >
              {`${
                showMoreFilters ? 'Plus de filtres' : 'Voir plus de filtres +'
              }`}
            </button>
            {showMoreFilters && (
              <div className='lg:flex lg:space-x-8'>
                <div>
                  <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={alarm}
                      onChange={() => setAlarm(!alarm)}
                      className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer'
                    />
                    <span className=''>Alarme anti-vol</span>
                  </label>
                  <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={keyless}
                      onChange={() => setKeyless(!keyless)}
                      className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer'
                    />
                    <span className=''>Démarrage sans clé</span>
                  </label>
                  <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={camera}
                      onChange={() => setCamera(!camera)}
                      className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer'
                    />
                    <span className=''>Caméra de stationnement</span>
                  </label>
                  <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={exchange}
                      onChange={() => setExchange(!exchange)}
                      className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer'
                    />
                    <span className=''>Echange possible</span>
                  </label>
                  <label className='flex items-center space-x-2 ml-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={leasing}
                      onChange={() => setLeasing(!leasing)}
                      className='mt-[2px] h-5 w-5 lg:h-6 lg:w-6 rounded cursor-pointer'
                    />
                    <span className=''>Leasing</span>
                  </label>
                </div>
                <div>
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
            )}
          </div>
        )}
      </div>

      <div className='flex my-1 lg:my-4 items-center'>
        <img src='estim_down.svg' alt='estimation haute' className='h-6' />
        <img src='estim_ok.svg' alt='estimation haute' className='h-6' />
        <img src='estim_up.svg' alt='estimation haute' className='h-6' />
        <span className='text-black text-opacity-50 italic lg:text-base text-xs'>
          Prix du véhicule par rapport à la moyenne
        </span>
      </div>
      <div ref={searchDivRef} className='w-full mx-auto text-black'>
        {!groupByMake && posts.map((post) => <PostCard post={post} />)}
        {groupByMake &&
          posts
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
                  {makesWithLogos.includes(fromNameToId(postsByMake.make)) && (
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

        {loadingPosts && (
          <button className='text-white bg-blackopac2 font-medium shadow-lg p-1 rounded-lg w-full text-center mt-10 lg:text-lg'>
            Chargement des annonces...
          </button>
        )}
        {!hasMore && !loadingPosts && (
          <p className='text-center mt-12 text-lg lg:text-xl'>
            {posts.length > 0 ? 'Fin des résultats.' : 'Aucun résultat.'}
          </p>
        )}
        {hasMore && !loadingPosts && (
          <button
            className='text-white bg-vividred font-medium shadow-lg p-1 rounded-lg w-full text-center mt-10 text-lg lg:text-xl'
            onClick={() => fetchPosts(page + 1)}
          >
            Charger plus d'annonces +
          </button>
        )}

        <button
          onClick={scrollToSearch}
          className='fixed bottom-[3%] right-[3%] lg:bottom-[80%] lg:right-[15%] p-3 bg-vividred text-white rounded-full shadow-lg hover:bg-blackopac2 transition'
        >
          <img
            src='/search.svg'
            alt='Rechercher'
            className='h-7 lg:h-8 mx-auto'
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
              else window.history.replaceState(null, '', '/')
            }}
          />
        )}
      </div>
    </>
  )
}
