import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'


const Hello = styled.div`
  background: palevioletred;
  border-radius: 3px;
  border: none;
  color: white;
`

const Image = styled.div`
:hover {
  border: solid 10px orange;
  width: 36%;
}
 `

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function Nearby() {
  const [albums, setAlbums] = useState([])
  const [hasError, setError] = useState(false)
  const router = useRouter()
  const {location} = router.query
  console.log("location", location)

  const showPosition = async (position) =>  {
    if( !location  )
      return

    console.log(position.coords);


    try {
      const response = await fetch (`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=30634ffa09a0b4718b774ba1aaa57f00&tags=${location}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&nojsoncallback=1`)
      if(!response.ok) {
        setError(true);
        return;
      }
      const result = await response.json()

      console.log("orginal count", result.photos.photo.length);

      const photos = result.photos.photo.map(row => {
        row.thumbnail = `https://live.staticflickr.com/${row.server}/${row.id}_${row.secret}_s.jpg`;
        row.url = `https://live.staticflickr.com/${row.server}/${row.id}_${row.secret}.jpg`;
        row.selected = false;

        return row;

      });


      const photo = result.photos.photo;
      console.log("filtered count", photo.length);
      console.log("photo", photo)
      console.log("photos", photos)
      console.log("photos", photos.row)
      setAlbums(photo);
      setError(false);
    } catch(err) {
      setError(true)
    }
  }

  useEffect(async () => {
    try {
      // const response = await fetch('/api/flickr')


      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } catch (e) {
      console.log('Error fetch Flickr data', e.message)
      setError(true)
    }
  }, [location])

  const onClickImage = (album) => {
    console.log('album', album);
    const new_albums = [...albums];
    const photo = new_albums.map(row => {
      row.selected = row.id == album.id;
      return row;
    });

    setAlbums(photo);
  }

  return (
    <>
      <Head>
        <title>History App - Nearby</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hello>Hello World</Hello>
      {hasError && 'Sorry there is a problem getting the information, please try again'}
      <ul>
        {albums.map((album, index) => (
          <Image><li key={index}><img src={album.selected ? album.url : album.thumbnail} alt={album.title} onClick={() => onClickImage(album)} />
            {album.title}
          </li></Image>
        ))}
      </ul>

    </>
  )
}

export default Nearby
