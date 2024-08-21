import { Box } from '@chakra-ui/react'
import React from 'react'

const Container = ({ thin, children }) => {
	return (
		<Box
			w={'full'}
			maxWidth={thin ? '700px' : '1280px'}
			mx={'auto'}
			px={'1.5rem'}
		>
			{children}
		</Box>
	)
}

export default Container
