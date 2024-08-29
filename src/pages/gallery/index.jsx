import { Box, SimpleGrid, useMediaQuery } from '@chakra-ui/react'
// import getData, { getSiteInfo } from '../../utils/data'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import HouseCard from '../../components/HouseCard'
import House from '../../types/CmsCollectionTypes/house'
// import CmsRichText from '../../components/CmsRichText'
// import SEO from '../../components/SEO'
// import { metaDescriptionFromHtml } from '../../utils/pipes'
import theme from '../../types/CmsSingleTypes/theme'
import { ChakraBaseProvider } from '@chakra-ui/react'
const Gallery = () => {
	const [shouldHave2Columns] = useMediaQuery('(min-width: 45rem)')

	return (
		<>
			<ChakraBaseProvider theme={theme}>
			<Layout>
				<Container>
					<Box mb={'2rem'}>
						{/* <CmsRichText text={galleryPage.pageBody}  /> */}
					</Box>
					<SimpleGrid
						w={'full'}
						columns={[shouldHave2Columns ? 2 : 1, 2, 3]}
						spacing={'2rem'}
						overflow={'visible'}
						mb={'3rem'}
					>
						{House.map((house, index) => (
							<HouseCard key={index} house={house} />
						))}
					</SimpleGrid>
				</Container>
			</Layout>
            </ChakraBaseProvider>
		</>
	)
}

// export const getStaticProps = async () => {
// 	const [galleryPage, houses, siteInfo] = await Promise.all([
// 		getData('our-homes-page'),
// 		getData('houses?populate=thumbnail'),
// 		getSiteInfo(),
// 	])

// 	return {
// 		props: { galleryPage, houses, siteInfo },
// 	}
// }

export default Gallery
