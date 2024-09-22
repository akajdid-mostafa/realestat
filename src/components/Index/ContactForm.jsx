import React, { useState } from 'react';
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
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		message: ''
	});
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('https://sendmailimmocean.onrender.com/Email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				alert('Message sent successfully!');
				setFormData({
					name: '',
					email: '',
					phone: '',
					message: ''
				});
			} else {
				alert('Failed to send message.');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('An error occurred. Please try again later.');
		}
	};


	const [state] = useForm('YOUR_FORM_ID'); // Replace with your Formspree form ID

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
				w="full"
				maxW={{ base: 'full', md: '50%' }} // Adjusted max width
				mr={{ base: 0, md: 6 }}
				mb={{ base: 6, md: 0 }}
				display={{ base: 'none', md: 'block' }} // Hide on mobile, show on medium screens and up
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
						src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Garage%20Nr:,%20791%20EL%20GOUIRA,%20Agadir%2080000+(OCEAN%20SALON)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
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
							name="name"
                            id="name"
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
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
							
                            name="email"
                            id="email"
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
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
							name="phone"
							id="phone"
							type="tel"  // Ensure input type is "tel" for better phone number handling
							placeholder="Your Phone Number"
							value={formData.phone}
							onChange={handleChange}
							onBlur={(e) => {  // Add onBlur event handler
								if (!e.target.value.match(/^\+\d{4}\s\d{8}$/)) {  // Regex for "+2126 23568941" format
									alert('Please enter a correct phone number.');  // Alert if pattern does not match
								}
							}}
							required
						/>

						<Textarea
							name="message"
							id="message"
							value={formData.message}
							onChange={handleChange}
							placeholder="Your Message"
							style={{
								fontWeight: "semibold",
								borderColor: 'blue.600',
								boxShadow: '0 0 5px rgba(0, 128, 128, 0.5)',
								height: '150px'
							}}
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
