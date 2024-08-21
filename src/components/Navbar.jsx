import {
	Box,
	Flex,
	IconButton,
	Stack,
	Collapse,
	useColorModeValue,
	useDisclosure,
	HStack,
	Text,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import Container from './Container'
import Link from 'next/link'
import Image from 'next/image'

// Importing the data instead of passing it as props
import siteInfo from '../types/CmsSingleTypes/siteInformation'

const Navbar = () => {
	const { isOpen, onToggle } = useDisclosure()

	return (
		<Box style={{ backgroundColor: 'white' }}>
			<Container>
				<Flex w={'100%'} h='5rem' alignItems='center'>
					{/* Logo & Navigation Links */}
					<Flex
						h='100%'
						flex={1}
						justifyContent='start'
						alignItems='center'
					>
						<Link href='/' passHref legacyBehavior>
							<Flex
								as={'a'}
								h='100%'
								alignItems='center'
								px='1rem'
								style={{
									cursor: 'pointer',
									textDecoration: 'none',
									backgroundColor: 'white', // For default state
								}}
							>
								<Flex alignItems='center'>
									<Image
										src={siteInfo.logo.data.attributes.url}
										alt={siteInfo.logo.data.attributes.alternativeText}
										height={50}
										width={50} // Adjust width as needed
									/>
									<Text
										style={{
											marginLeft: '0.5rem', // Space between image and text
											fontWeight: '600',
										}}
									>
										{siteInfo.siteName}
									</Text>
								</Flex>
							</Flex>
						</Link>

						<Flex
							display={['none', 'flex']}
							ml='auto'
							h='100%'
						>
							<DesktopNav navbarItems={siteInfo.navbarItems} />
						</Flex>
					</Flex>

					{/* Hamburger Menu */}
					<Flex display={['flex', 'none']}>
						<IconButton
							onClick={onToggle}
							icon={
								isOpen ? (
									<CloseIcon w={3} h={3} />
								) : (
									<HamburgerIcon w={5} h={5} />
								)
							}
							variant='ghost'
							aria-label='Toggle Navigation'
						/>
					</Flex>
				</Flex>

				<Collapse in={isOpen} animateOpacity>
					<MobileNav navbarItems={siteInfo.navbarItems} />
				</Collapse>
			</Container>
		</Box>
	)
}

const DesktopNav = ({ navbarItems }) => {
	return (
		<HStack spacing={0}>
			{navbarItems
				.filter((navbarItem) => navbarItem.visible)
				.map((navbarItem) => (
					<Link key={navbarItem.label} href={navbarItem.url} passHref legacyBehavior>
						<Flex
							as={'a'}
							h='100%'
							alignItems='center'
							px='1rem'
							style={{
								cursor: 'pointer',
								textDecoration: 'none',
								backgroundColor: 'white',
							}}
							_hover={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
							}}
						>
							<Text style={{ fontWeight: '600' }}>{navbarItem.label}</Text>
						</Flex>
					</Link>
				))}
		</HStack>
	)
}

const MobileNav = ({ navbarItems }) => {
	return (
		<Stack
			bg={useColorModeValue('white', 'blackAlpha.800')}
			p={4}
			display={{ md: 'none' }}
		>
			{navbarItems
				.filter((navbarItem) => navbarItem.visible)
				.map((navbarItem) => (
					<MobileNavbarItem key={navbarItem.label} {...navbarItem} />
				))}
		</Stack>
	)
}

const MobileNavbarItem = ({ label, url }) => {
	return (
		<Stack spacing={4}>
			<Link key={label} href={url} passHref legacyBehavior>
				<Flex
					as={'a'}
					py={2}
					justify='space-between'
					align='center'
					style={{
						cursor: 'pointer',
						textDecoration: 'none',
					}}
				>
					<Text style={{ fontWeight: 600 }}>{label}</Text>
				</Flex>
			</Link>
		</Stack>
	)
}

export default Navbar
