import { Box, Stack, Image, HStack } from '@chakra-ui/react'
import Container from './Container'
// import CmsRichText from './CmsRichText'
import Link from 'next/link'
import siteInfo from '../types/CmsSingleTypes/siteInformation'
import React from 'react'

const footerImage = (image) => (
	<Image
		src={image.data.attributes.formats.small?.url ?? image.data.attributes.url}
		alt={image.data.attributes.alternativeText}
		display={'block'}
		height={'100%'}
		width={'auto'}
		margin={'auto'}
		borderRadius={'0.5rem'}
	/>
)

const Footer = () => {
	return (
		<Box backgroundColor='gray.700' color='white' py={'3rem'}>
			<Container>
				<Stack
					direction={['column', 'row']}
					justifyContent='space-between'
					spacing='1rem'
				>
					<Box textAlign={['center', 'unset']}>
						<CmsRichText text={siteInfo.footerLeft} siteInfo={siteInfo} />
					</Box>
					<Stack
						direction={['column', 'row']}
						spacing='2rem'
						textAlign={['center', 'unset']}
					>
						<HStack justify={['center', 'unset']} spacing={'2rem'}>
							{siteInfo.headshot.data ? (
								<Box h={'8rem'}>
									{siteInfo.realEstateWebsite ? (
										<Link href={siteInfo.realEstateWebsite} passHref target={'_blank'}>
											{footerImage(siteInfo.headshot)}
										</Link>
									) : (
										footerImage(siteInfo.headshot)
									)}
								</Box>
							) : null}
							{siteInfo.realEstateLogo.data ? (
								<Box h={'8rem'}>
									{siteInfo.realEstateWebsite ? (
										<Link href={siteInfo.realEstateWebsite} passHref target={'_blank'}>
											{footerImage(siteInfo.realEstateLogo)}
										</Link>
									) : (
										footerImage(siteInfo.realEstateLogo)
									)}
								</Box>
							) : null}
						</HStack>
					</Stack>
				</Stack>
			</Container>
		</Box>
	)
}

export default Footer
