'use client'

import React, { useRef, useState } from 'react'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import CarPostModal from './CarPostModal'
import CarPostsSearchBars from './CarPostsSearchBars'

const CarPostsFeed: React.FC = () => {
  const [posts, setPosts] = useState<CarPostListItem[]>([])
  const [page, setPage] = useState(1)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  const lastPostRef = useRef<HTMLDivElement | null>(null)
  const searchDivRef = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div className='text-center text-base lg:text-2xl mt-8 lg:mt-16 text-black'>
        <p className='mx-2'>
          Découvrez le premier moteur de recherche de véhicules d'occasion en{' '}
          <span className='font-semibold text-red'>Tunisie</span>
        </p>
        <p>
          <span className='mt-3 font-semibold text-red'>+100 </span>
          nouvelles annonces par jour
        </p>
      </div>

      <CarPostsSearchBars
        page={page}
        setPage={setPage}
        loadingPosts={loadingPosts}
        setLoadingPosts={setLoadingPosts}
        hasMore={hasMore}
        setHasMore={setHasMore}
        actualPosts={posts}
        setPosts={setPosts}
        withFixed={true}
        lastPostRef={lastPostRef}
        searchDivRef={searchDivRef}
      />

      <div
        ref={searchDivRef}
        className='w-full mx-auto mt-1 lg:mt-6 text-black'
      >
        {loadingPosts && (
          <p className='text-center text-lg lg:text-xl'>
            Chargement des annonces...
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className='justify-between w-full flex items-center mt-1 p-1 bg-whiteBGDarker border-b border-blackopac2 rounded hover:bg-whiteBG text-xs lg:text-sm text-blacklight'
          >
            <button
              onClick={() => setSelectedPostId(post.id)}
              className='flex flex-row w-4/5 space-x-1 lg:space-x-4'
            >
              <img
                src={post.image}
                alt={post.title}
                className='w-28 lg:w-40 h-[7.5rem] lg:h-[8.5rem] object-cover rounded'
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
                <span className='font-bold mt-auto text-pureblack'>
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

        <div ref={lastPostRef} />
        {!hasMore && !loadingPosts && (
          <p className='text-center mt-6 text-lg lg:text-xl'>
            Fin des résultats.
          </p>
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

export default CarPostsFeed
