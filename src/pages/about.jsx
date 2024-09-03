import { ChakraBaseProvider } from '@chakra-ui/react'
import { Box, Stack, VStack } from '@chakra-ui/react'
import About from '../components/About'
import Layout from '../components/Layout'
import Hero from '../components/Hero'
import theme from '../types/CmsSingleTypes/theme'
import Container from '../components/Container'
import '../styles/globals.css';  
import Footer from '../components/Footer'
import Stat from '../components/stat'
import FilterMapSection from '../components/ero'
import CityInputSelect from '../components/city'





const about = ({ siteInfo}) => {
    return (
        <>
            <ChakraBaseProvider theme={theme}>
                <Layout siteInfo={siteInfo}>
                <About />
                <Stat/>
                <FilterMapSection/>
                <CityInputSelect/>
                <Footer/>
                </Layout>
                
            </ChakraBaseProvider>
        </>
    )
}
export default about