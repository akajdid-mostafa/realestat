import { Box, Stack } from '@chakra-ui/react'
import Container from '../components/Container'
import Layout from '../components/Layout'
import { ChakraBaseProvider } from '@chakra-ui/react'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

import theme from '../types/CmsSingleTypes/theme'
const ContactUsPage = () => {
	return (
		<>
        <ChakraBaseProvider theme={theme}>
			{/* <SEO
				seo={{
					title: contactPage.title,
					description: metaDescriptionFromHtml(contactPage.pageBody),
				}}
				siteInfo={siteInfo}
			/> */}
			<Layout >
				<Container>
					<Stack direction={['column', 'row']} mt={[0, '2rem']} mb={'3rem'}>
							<ContactForm/>
							
					</Stack>
				</Container>
				<Footer/>
			</Layout>
            </ChakraBaseProvider>
		</>
	)
}

// export const getStaticProps: GetStaticProps = async () => {
// 	const [contactPage, siteInfo] = await Promise.all([
// 		getData('contact-page'),
// 		getSiteInfo(),
// 	])

// 	return {
// 		props: { contactPage, siteInfo },
// 	}
// }

export default ContactUsPage
