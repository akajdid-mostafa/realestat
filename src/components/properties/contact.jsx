import React from 'react';
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

const ContactForm = ({ message, setMessage }) => {
    return (
        <Box flex={{ base: "1", lg: "0.3" }} p={4} position="sticky" top={0} mr="10" height="100%" width="100%" overflowY="auto" bg="white" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                Besoin d&apos;être contacté ?
            </Text>
            <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <FaUser />
                    </InputLeftElement>
                    <Input placeholder="Your Name" />
                </InputGroup>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <FaEnvelope />
                    </InputLeftElement>
                    <Input type="email" placeholder="Your Email" />
                </InputGroup>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Your Number Phone</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <FaPhone />
                    </InputLeftElement>
                    <Input type="tel" placeholder="Your Phone Number" />
                </InputGroup>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Message</FormLabel>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    style={{
                        fontWeight: "semibold",
                        borderColor: 'blue.600',
                        boxShadow: '0 0 5px rgba(0, 128, 128, 0.5)',
                        height: '150px'
                    }}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="full"
                bg="blue.600"
                _hover={{ transform: 'scale(1.05)' }}
                transition="transform 0.2s"
            >
                Send Message
            </Button>
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