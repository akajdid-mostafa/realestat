import { Box, Button, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { GetStaticProps, GetStaticPaths } from 'next'
// import getData, { getSiteInfo } from '../../utils/data'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import { FaBath, FaBed, FaFilePdf, FaMapMarkerAlt, FaRuler } from 'react-icons/fa'
// import Carousel from '../../components/Carousel'
// import CmsRichText from '../../components/CmsRichText'
// import SEO from '../../components/SEO'
// import { metaDescriptionFromHtml } from '../../utils/pipes'
import Link from 'next/link'
import { ArrowBackIcon } from '@chakra-ui/icons'

const HouseDetails = ({ house, siteInfo }) => {
	let bathrooms = `${house.fullBathrooms} Full`

	if (house.halfBathrooms) {
		bathrooms += `, ${house.halfBathrooms} Half Bathroom${house.halfBathrooms === 1 ? '' : 's'}`
	} else {
		bathrooms += ` Bathroom${house.fullBathrooms === 1 ? '' : 's'}`
	}

	const iconSpacing = '0.75rem'
	const fontSize = '1.25rem'

	// include house thumbnail as 1st photo in carousel
	const photos = house.photos?.data ? [house.thumbnail.data, ...house.photos.data] : [house.thumbnail.data]

	return (
		<>
			{/* <SEO
				seo={{
					title: house.title,
					description: metaDescriptionFromHtml(house.description ?? house.title),
					shareImage: house.thumbnail,
				}}
				siteInfo={siteInfo}
			/> */}
			<Layout siteInfo={siteInfo}>
				<Container thin>
					<Link href={'/gallery'} passHref legacyBehavior>
						<Button
							as={'a'}
							variant='link'
							leftIcon={<ArrowBackIcon />}
							color={'brand'}
							my={'1rem'}
						>
							Back
						</Button>
					</Link>

					<Heading as={'h3'} size={'lg'}>
						{house.title}
					</Heading>

				

					<Stack
						direction={['column', 'row']}
						spacing={'1.5rem'}
						mb={'1.5rem'}
						align={'flex-start'}
						justify={'space-between'}
					>
						<VStack
							fontSize={fontSize}
							fontWeight={'bold'}
							alignItems={'flex-start'}
							lineHeight={'1.15'}
							spacing={'0.75rem'}
						>
							<HStack spacing={iconSpacing}>
								<FaBed />
								<Text>
									{house.bedrooms} Bedroom{house.bedrooms === 1 ? '' : 's'}
								</Text>
							</HStack>
							<HStack spacing={iconSpacing}>
								<FaBath />
								<Text>{bathrooms}</Text>
							</HStack>
							<HStack spacing={iconSpacing}>
								<FaRuler />
								<Text>
									{house.squareFeet.toLocaleString()} Square Feet
								</Text>
							</HStack>
						</VStack>

						{(house.floorPlan?.data || house.virtualTourLink) && (
							<VStack
								lineHeight={'1.15'}
								spacing={'0.75rem'}
								alignItems={'flex-start'}
							>
								{house.floorPlan?.data && (
									<Link href={house.floorPlan.data.attributes.url} passHref legacyBehavior>
										<Button
											as={'a'}
											target={'_blank'}
											variant='link'
											leftIcon={<FaFilePdf />}
											color={'brand'}
											fontSize={fontSize}
										>
											Floor Plan
										</Button>
									</Link>
								)}

								{house.virtualTourLink && (
									<Link href={house.virtualTourLink} passHref legacyBehavior>
										<Button
											as={'a'}
											target={'_blank'}
											variant='link'
											leftIcon={<FaMapMarkerAlt />}
											color={'brand'}
											fontSize={fontSize}
										>
											Virtual Tour
										</Button>
									</Link>
								)}
							</VStack>
						)}

					</Stack>

					
				</Container>
			</Layout>
		</>
	)
}

export const getStaticPaths = async () => {
	const houses = await getData('houses')

	return {
		paths: houses.map((house) => ({
			params: {
				id: house.id.toString(),
			},
		})),
		fallback: false,
	}
}

export const getStaticProps = async ({ params }) => {
	if (!params) {
		return {
			notFound: true,
		}
	}

	const [house, siteInfo] = await Promise.all([
		getData(`houses/${params.id}?populate=*`),
		getSiteInfo(),
	])

	return {
		props: { house, siteInfo },
	}
}

export default HouseDetails
