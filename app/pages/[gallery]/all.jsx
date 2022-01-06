import Head from 'next/head'
import { useRef } from 'react'

import { get as getAlbum } from '../../src/lib/album'
import { get as getAlbums } from '../../src/lib/albums'
import { get as getGalleries } from '../../src/lib/galleries'

import Link from '../../src/components/Link'
import useSearch from '../../src/hooks/useSearch'
import SplitViewer from '../../src/components/SplitViewer'

async function buildStaticPaths() {
  const { galleries } = await getGalleries()
  const groups = await Promise.all(galleries.map(async (gallery) => {
    const { albums } = await getAlbums(gallery)
    return albums.map(({ name: album }) => ({ params: { gallery, album } }))
  }))
  return groups.flat()
}

export async function getStaticProps({ params: { gallery } }) {
  const { albums } = await getAlbums(gallery)

  const prepareItems = ({ albumName, items }) => items.map((item) => ({
    ...item,
    gallery,
    album: albumName,
    content: [item.description, item.caption, item.location, item.city, item.search].join(' '),
  }))
  // reverse order for albums in ascending order (oldest on top)
  const allItems = await albums.reverse().reduce(async (previousPromise, album) => {
    const prev = await previousPromise
    const { album: { items } } = await getAlbum(gallery, album.name)
    return prev.concat(prepareItems({ albumName: album.name, items }))
  }, Promise.resolve([]))

  return {
    props: { items: allItems },
  }
}

export async function getStaticPaths() {
  // Define these albums as allowed, otherwise 404
  return {
    paths: await buildStaticPaths(),
    fallback: false,
  }
}

function AllPage({ items = [] }) {
  const {
    filtered,
    keyword,
    searchBox,
  } = useSearch(items)
  const refImageGallery = useRef(null)
  const showThumbnail = (kw = '') => kw.length > 2

  function selectThumb(index) {
    refImageGallery.current.slideToIndex(index)
  }

  return (
    <div>
      <Head>
        <title>History App - All</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {searchBox}
      <SplitViewer items={filtered} refImageGallery={refImageGallery} />
      <ul>
        {filtered.map((item, index) => (
          <li key={item.filename}>
            <b>{item.album}</b>
            {item.content}
            {showThumbnail(keyword) ? <img src={item.thumbPath} alt={item.caption} /> : item.caption}
            <Link href={`/${item.gallery}/${item.album}#select${item.id}`}><a>{item.caption}</a></Link>
            <button type="button" onClick={() => selectThumb(index)}><a>Slide to</a></button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AllPage