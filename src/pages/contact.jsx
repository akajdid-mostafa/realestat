import { Box, Stack } from '@chakra-ui/react'
// import getData, { getSiteInfo } from '../utils/data'
import Container from '../components/Container'
import Layout from '../components/Layout'
import theme from '@/types/CmsSingleTypes/theme'
import { ChakraBaseProvider } from '@chakra-ui/react'
import ContactForm from '../components/ContactForm'
// import SimplePage from '../types/CmsSingleTypes/simplePage'
// import Phone from '../components/Phone'
// import SEO from '../components/SEO'
// import { metaDescriptionFromHtml } from '../utils/pipes'


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
						<Box width={['full', '50%']} mr={[0, '4rem']}>
							{/* <CmsRichText text={contactPage.pageBody} siteInfo={siteInfo} />
							<Phone siteInfo={siteInfo} /> */}
						</Box>
						<Box width={['full', '60%']}>
							<ContactForm/>
						</Box>
					</Stack>
				</Container>
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
