import '../styles/globals.css'
import SiteHeader from '../components/SiteHeader'
import SiteBrand from '../components/SiteBrand'

export default function App({ Component, pageProps }) {
  return (
    <>
      <SiteHeader />
      <SiteBrand />
      <Component {...pageProps} />
    </>
  )
}
