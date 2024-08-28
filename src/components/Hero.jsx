import {
	Stack,
	Flex,
	Button,
	Heading,
	VStack,
	Box,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react';
import Link from 'next/link'
import Container from './Container'

// Importing the values instead of using them as props
import homePageData from '../types/CmsSingleTypes/homePage'

const Hero = () => {
	// Destructure the imported data for easier access
	const { heroImage, heroText, primaryCallToActionButtonLink, secondaryCallToActionButtonLink, secondaryCallToActionButtonText } = homePageData;

	return (
		<Flex
      w={'full'}
	  h={'70vh'}
	  minHeight={'31rem'}
	  maxHeight={'50rem'}
	  backgroundImage={encodeURI(heroImage.data.attributes.url)}
      backgroundSize={'cover'}
      backgroundPosition={'center'}>
      <VStack
        w={'full'}
        justify={'center'}
		px={[4, 8]}
		pb={[6, 0]}
        backgroundColor='blackAlpha.700'
		>
			<Container>
        <Stack maxWidth={'4xl'}
						align={['center', 'flex-start']}
						spacing={['2.5rem', '3rem']}  >
		<Heading
							color={'white'}
							fontWeight={700}
							lineHeight={1.2}
							fontSize={useBreakpointValue({ base: '4xl', md: '6xl' })}
						>
							{/* {heroText} */}
							Trouver un logement adapté à votre style de vie
						</Heading>
          <Stack direction={['column', 'row']} spacing={['0.5rem', '1rem']}>
		  <Button style={{backgroundColor:"#0165fc" ,color:"white"}} size="md" borderRadius="md">
		  Explorer l'immobilier local
</Button>
<Button as={'a'} size="md"
										bg={'transparent'}
										color={'whiteAlpha.800'}
										_hover={{ bg: 'whiteAlpha.400' }} >
À propos 
</Button>
          </Stack>
        </Stack>
		</Container>
      </VStack>
    </Flex>
		
	)
}

export default Hero
