import {
	Heading,
	Box,
	Button,
	VStack,
	Text,
	Input,
	Textarea,
	Flex,
	useBreakpointValue,
  } from '@chakra-ui/react';
  import { useForm, ValidationError } from '@formspree/react';
  
  const ContactForm = ({ siteInfo, formHeading, shouldHaveNegativeTopMargin }) => {
	const [state, handleSubmit] = useForm('YOUR_FORM_ID'); // Replace with your Formspree form ID
  
	const emailRegex =
	  '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:a-z0-9?\\.)+a-z0-9?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])';
  
	const errorTextColor = '#e53e3e'; // Updated color for error text
  
	// Function to wrap content in a styled box
	const formBox = (children) => (
	  <Box
		w="full"
		bg="white"
		boxShadow="lg"
		rounded="lg"
		mt={shouldHaveNegativeTopMargin ? ['-3rem', '-6rem'] : undefined}
		border="1px"
		borderColor="gray.200"
		transition="all 0.3s ease" // Animation for hover effect
		_hover={{ boxShadow: 'xl', transform: 'scale(1.02)' }} // Scale up on hover
	  >
		<Box p={['2rem', '3rem']}>{children}</Box>
	  </Box>
	);
  
	if (state.succeeded) {
	  return formBox(
		<VStack spacing="1.5rem" py="8rem">
		  <Heading fontSize="2xl" textAlign="center" fontWeight="bold" color="blue.600">
			Thank you for your message!
		  </Heading>
		  <Text fontSize="lg" textAlign="center">We will get back to you soon.</Text>
		</VStack>
	  );
	}
  
	return formBox(
	  <Flex
		direction={{ base: 'column', md: 'row' }}
		align="flex-start"
		justify="center"
		w="full"
	  >
		<Box
		  flex={{ base: 'none', md: '3' }}
		  w="full"
		  maxW={{ base: 'full', md: '50%' }} // Adjusted max width
		  mr={{ base: 0, md: 6 }}
		  mb={{ base: 6, md: 0 }}
		>
		  <Box
			rounded="lg"
			p={4}
			boxShadow="md"
			border="1px"
			borderColor="gray.200"
			overflow="hidden" // Ensures rounded corners on iframe
			transition="all 0.3s ease"
			_hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }} // Hover effect
		  >
			<iframe
			  width="100%"
			  height="300"
			  frameBorder="0"
			  title="map"
			  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=+(OCEAN%20SALON)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
			  style={{
				borderRadius: '8px',
				transition: 'filter 0.3s ease', // Smooth transition for filter
			  }}
			></iframe>
			<Box bg="white" p={4} borderRadius="lg" mt={4}>
			  <Text fontWeight="bold" fontSize="lg">ADDRESS</Text>
			  <Text mt={1}>Garage Nr:, 791 EL GOUIRA, Agadir 80000</Text>
			  <Text fontWeight="bold" fontSize="lg" mt={4}>EMAIL</Text>
			  <Text mt={1} as="a" color="blue.500" href="mailto:maroc.immocean@gmail.com">maroc.immocean@gmail.com</Text>
			  <Text fontWeight="bold" fontSize="lg" mt={4}>PHONE</Text>
			  <Text mt={1}>(+212) 808 649 090</Text>
			</Box>
		  </Box>
		</Box>
  
		<Box
		  flex={{ base: 'none', md: '1' }}
		  w="full"
		  ml={{ base: 0, md: 6 }}
		  mb={{ base: 6, md: 0 }}
		>
		  <form onSubmit={handleSubmit}>
			<VStack spacing="1.5rem">
			  <Heading fontSize="2xl" textAlign="center" fontWeight="bold" color="blue.600">
				{formHeading || 'Request a Free Consultation'}
			  </Heading>
  
			  <Input
				type="text"
				name="name"
				placeholder="Name"
				aria-label="Name"
				disabled={state.submitting}
				required
				borderColor="gray.300"
				_placeholder={{ color: 'gray.500' }}
				_focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
			  />
			  <ValidationError
				field="name"
				errors={state.errors}
				style={{ color: errorTextColor }}
			  />
  
			  <Input
				type="email"
				name="email"
				placeholder="Email"
				aria-label="Email"
				pattern={emailRegex}
				disabled={state.submitting}
				required
				borderColor="gray.300"
				_placeholder={{ color: 'gray.500' }}
				_focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
			  />
			  <ValidationError
				field="email"
				errors={state.errors}
				style={{ color: errorTextColor }}
			  />
  
			  <Input
				type="tel"
				name="number"
				placeholder="Phone Number"
				aria-label="Phone Number"
				disabled={state.submitting}
				required
				borderColor="gray.300"
				_placeholder={{ color: 'gray.500' }}
				_focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
			  />
  
			  <Textarea
				name="message"
				placeholder="Message"
				aria-label="Message"
				minHeight="12rem"
				disabled={state.submitting}
				required
				borderColor="gray.300"
				_placeholder={{ color: 'gray.500' }}
				_focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
			  />
			  <ValidationError
				field="message"
				errors={state.errors}
				style={{ color: errorTextColor }}
			  />
  
			  <Button
				type="submit"
				w="full"
				mt={6}
				bg="blue.500"
				color="white"
				rounded="md"
				_hover={{ bg: 'blue.600', transform: 'translateY(-2px)' }} // Lift effect on hover
				_active={{ bg: 'blue.700', transform: 'translateY(0)' }} // Reset on click
				transition="transform 0.2s ease" // Smooth transition for button
			  >
				{state.submitting ? 'Sending...' : 'Send'}
			  </Button>
			</VStack>
		  </form>
		</Box>
	  </Flex>
	);
  };
  
  export default ContactForm;
  