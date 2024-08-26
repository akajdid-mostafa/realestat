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
<<<<<<< HEAD
=======
import Cta3 from '../components/cta'



>>>>>>> d5119b5335278bdd9ba8d4e579baa775b9f73c44
const HomePage = ({ homePage, galleryPage, houses, siteInfo }) => {
    return (
        <>
        <ChakraBaseProvider theme={theme}>
            <Layout siteInfo={siteInfo}>
                <Hero {...homePage} />
                <Container>
                    <Stack direction={['column-reverse', 'row']}>
<<<<<<< HEAD
                        <Box width={['full', '55%']} mt={'3rem'} mr={[0, '4rem']}>
                          
                        </Box>
                        <Box width={['full', '45%']}>
=======
                        <Box >
>>>>>>> d5119b5335278bdd9ba8d4e579baa775b9f73c44
                            <ContactForm
                                siteInfo={siteInfo}
                                shouldHaveNegativeTopMargin
                            />
                        </Box>
                    </Stack>
                    
                    {/* Add Gallery section */}
                    {/* <Box mt={'4rem'}>
                        <Gallery galleryPage={galleryPage} houses={houses} siteInfo={siteInfo} />
                    </Box> */}
                    {/* Uncomment to include testimonials */}
                    {/* <Heading mt={'2rem'}>{homePage.featuredTestimonialsHeading}</Heading> */}
                    {/* <VStack spacing={'3rem'} my={'3rem'}>
                        {homePage.featuredTestimonials.data.map(
                            (testimonialData, index) => (
                                <TestimonialCard
                                    key={index}
                                    testimonial={testimonialData.attributes}
                                    index={index}
                                />
                            )
                        )}
                    </VStack> */}
                </Container>
                <Cta3/>
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