import { Box, Stack, VStack } from '@chakra-ui/react'
import Hero from '../components/Hero'
import Container from '../components/Container'
import Layout from '../components/Layout'
import theme from '../types/CmsSingleTypes/theme'
import { ChakraBaseProvider } from '@chakra-ui/react'
import Footer from '../components/Footer'
import '../styles/globals.css';  
// import getData, { getSiteInfo } from '../utils/data'
// import CmsRichText from '../components/CmsRichText'
// import ContactForm from '../components/ContactForm'
// import Phone from '../components/Phone'
// import SEO from '../components/SEO'
// Ensure the path is correct
import ContactForm from '../components/ContactForm'
import Cta3 from '../components/cta'
import Popular from '../components/popular-post'
import Aboutt from '../components/aboutt'
import HomeFinancingSteps from '../components/home'
import FilterMapSection from '../components/ero'




const HomePage = ({ homePage, galleryPage, houses, siteInfo }) => {
    return (
        <>
        <ChakraBaseProvider theme={theme}>
        
                <Layout siteInfo={siteInfo}>
                <Hero  />
                <Popular/>
                <HomeFinancingSteps/>
                <Aboutt/>
                <Cta3/>
                <ContactForm  />
            </Layout> 
            <Footer/>
            </ChakraBaseProvider>
        </>
    )
}

// export const getStaticProps = async () => {
//     const [homePage, galleryPage, houses, siteInfo] = await Promise.all([
//         getData('home-page?populate=*'),
//         getData('our-homes-page'),
//         getData('houses?populate=thumbnail'),
//         getSiteInfo(),
//     ])

//     return {
//         props: {
//             homePage,
//             galleryPage,
//             houses,
//             siteInfo,
//         },
//     }
// }

export default HomePage