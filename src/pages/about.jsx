import { ChakraBaseProvider } from '@chakra-ui/react'
import About from '../components/Index/About'
import Layout from '../components/Index/Layout'
import theme from '../types/CmsSingleTypes/theme'
import '../styles/globals.css';  
import Footer from '../components/Index/Footer'






const about = ({ siteInfo}) => {
    return (
        <>
            <ChakraBaseProvider theme={theme}>
                <Layout siteInfo={siteInfo}>

                <About />
               
                <Footer/>
                </Layout>
                
            </ChakraBaseProvider>
        </>
    )
}
export default about