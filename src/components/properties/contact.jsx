import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    Input,
    Textarea,
    Button
} from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

const ContactForm = ({ message, setMessage, defaultMessage }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: defaultMessage || ''  // Correctly use defaultMessage or fallback to empty string
    });
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        phone: ''
    });
console.log("dsd")
    useEffect(() => {
        setFormData(formData => ({ ...formData, message: defaultMessage }));
    }, [defaultMessage]);  // Update formData.message when defaultMessage changes

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        // Remove any non-digit characters
        const cleanedPhone = phone.replace(/\D/g, '');

        // Validate: 7 to 15 digits long, may start with '0' or '+'
        const re = /^(?:0|\+?\d)\d{6,14}$/;
        return re.test(cleanedPhone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errors = { ...validationErrors };

        if (name === 'email' && !validateEmail(value)) {
            errors.email = 'Invalid email format';
        } else if (name === 'email') {
            errors.email = '';
        }

        if (name === 'phone' && !validatePhone(value)) {
            errors.phone = 'Invalid phone format';
        } else if (name === 'phone') {
            errors.phone = '';
        }

        setValidationErrors(errors);

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validationErrors.email || validationErrors.phone) {
            alert('Please fix the errors before submitting.');
            return;
        }

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
                    message: defaultMessage || ''  // Use defaultMessage or fallback to empty string
                });
            } else {
                alert('Failed to send message.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <Box flex={{ base: "1", lg: "0.3" }} p={4} position="sticky" top={0} mr="10" height="100%" width="100%" overflowY="auto" bg="white" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                Besoin d&apos;être contacté ?
            </Text>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel>Name</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <FaUser />
                        </InputLeftElement>
                        <Input
                            name="name"
                            id="name"
                            type="text"
                            placeholder="Votre mail"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </FormControl>

                <FormControl mb={4} isInvalid={!!validationErrors.email}>
                    <FormLabel>Email</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <FaEnvelope />
                        </InputLeftElement>
                        <Input
                            name="email"
                            id="email"
                            type="email"
                            placeholder="Votre Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    {validationErrors.email && <Text color="red.500">{validationErrors.email}</Text>}
                </FormControl>

                <FormControl mb={4} isInvalid={!!validationErrors.phone}>
                    <FormLabel>Your Phone Number</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <FaPhone />
                        </InputLeftElement>
                        <Input
                            name="phone"
                            id="phone"
                            type="tel"
                            placeholder="Votre numéro de téléphone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    {validationErrors.phone && <Text color="red.500">{validationErrors.phone}</Text>}
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Votre Message"
                        style={{
                            fontWeight: "semibold",
                            borderColor: 'blue.600',
                            boxShadow: '0 0 5px rgba(0, 128, 128, 0.5)',
                            height: '150px'
                        }}
                        required
                    />
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    bg="blue.600"
                    _hover={{ transform: 'scale(1.05)' }}
                    transition="transform 0.2s"
                >
                    Send Message
                </Button>
            </form>

            <Text
                textAlign="center"
                fontSize="sm"
                color="gray.600"
                mt={2}
            >
                En continuant, vous acceptez de recevoir des textes à l&apos;adresse électronique que vous avez fournie. Nous nous engageons à ne pas vous spammer.
            </Text>
        </Box>
    );
};

export default ContactForm;
