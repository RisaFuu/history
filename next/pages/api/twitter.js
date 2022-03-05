import twitterSample from '../../public/twitter.json'

export default function twitter(req, res) {
  // res.open('GET', twitterSample)
  res.send(twitterSample)

  // res.onreadystatechange = (e) => {
  //   console.log(res.responseText)
}
// }
