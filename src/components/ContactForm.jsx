import {Heading,Box,Button,	VStack,	Text,Input,	Textarea,Flex,} from '@chakra-ui/react';
  import { useForm, ValidationError } from '@formspree/react';
  
  const ContactForm = ({ siteInfo, formHeading, shouldHaveNegativeTopMargin }) => {
	const [state, handleSubmit] = useForm('YOUR_FORM_ID'); // Replace with your Formspree form ID
  
	const emailRegex =
	  '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:a-z0-9?\\.)+a-z0-9?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])';
  
	const errorTextColor = '#dd0000';
  
	// Function to wrap content in a styled box
	const formBox = (children) => (
	  <Box
		w="full"
		bg="white"
		boxShadow="2xl"
		rounded="md"
		mt={shouldHaveNegativeTopMargin ? ['-3rem', '-6rem'] : undefined}
	  >
		<Box p={['2rem', '3rem']}>{children}</Box>
	  </Box>
	);
  
	if (state.succeeded) {
	  return formBox(
		<VStack spacing="1rem" py="11.25rem">
		  <Heading fontSize="1.5rem" textAlign="center" fontWeight="bold">
			Thank you for your message!
		  </Heading>
		  <Text>We will get back to you soon.</Text>
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
        maxW={{ base: 'full', md: '60%' }}
        mr={{ base: 0, md: 4 }}
        mb={{ base: 4, md: 0 }}
        position="relative"
      >
        <Box  rounded="lg"  p={4}>
          <iframe
		   rounded="lg"
            width="100%"
            height="300"
            frameBorder="0"
            title="map"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embedhttps://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Garage%20Nr:,%20791%20EL%20GOUIRA,%20Agadir%2080000+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}
          ></iframe>
          <Box bg="white"   p={4} >
            <Text fontWeight="bold">ADDRESS</Text>
            <Text>Garage Nr:, 791 EL GOUIRA, Agadir 80000</Text>
            <Text fontWeight="bold" mt={4}>EMAIL</Text>
            <Text as="a" color="blue.500" href="mailto:maroc.immocean@gmail.com">maroc.immocean@gmail.com</Text>
            <Text fontWeight="bold" mt={4}>PHONE</Text>
            <Text>(+212) 808 649 090</Text>
          </Box>
        </Box>
      </Box>
  
		<Box
		  flex={{ base: 'none', md: '1' }}
		  w="full"
		  ml={{ base: 0, md: 4 }}
		  mb={{ base: 4, md: 0 }}
		>
		  <form onSubmit={handleSubmit}>
			<VStack spacing="1rem">
			  <Heading fontSize="1.5rem" textAlign="center" fontWeight="bold">
				{formHeading || 'Demandez une consultation gratuite'}
			  </Heading>
  
			  <Input
				type="text"
				name="name"
				placeholder="Name"
				aria-label="Name"
				disabled={state.submitting}
				required
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
			  />
  
			  <Textarea
				name="message"
				placeholder="Message"
				aria-label="Message"
				minHeight="10rem"
				disabled={state.submitting}
				required
			  />
			  <ValidationError
				field="message"
				errors={state.errors}
				style={{ color: errorTextColor }}
			  />
  
			  <Button
				type="submit"
				w="full"
				mt={8}
				bg="#338aff"
				color="white"
				rounded="md"
				_hover={{ bg: '#1e5dff' }} // Darker shade on hover
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
  