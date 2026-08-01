import React, { useState, forwardRef } from 'react';
import {
  Heading,
  Box,
  Button,
  VStack,
  Text,
  Input,
  Textarea,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { MdPerson, MdEmail, MdPhone } from 'react-icons/md';
import { CONTACT_API_URL } from '@/config/api';

const ContactForm = forwardRef(({ siteInfo, formHeading, shouldHaveNegativeTopMargin ,displayProp }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') {
      return;
    }
    if (!CONTACT_API_URL) {
      setStatus('error');
      setErrorMessage('Le service de contact n\'est pas configuré.');
      return;
    }
    setStatus('submitting');
    setErrorMessage('');
    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setStatus('error');
        setErrorMessage('Échec de l\'envoi du message.');
      }
    } catch (error) {
      console.error('Erreur de soumission du formulaire :', error);
      setStatus('error');
      setErrorMessage('Une erreur réseau s\'est produite. Veuillez réessayer plus tard.');
    }
  };

  const formBox = (children) => (
    <Box
      ref={ref} // Attach the ref here
      w="full"
      bg="white"
      boxShadow="lg"
      rounded="lg"
      mt={shouldHaveNegativeTopMargin ? ['-3rem', '-6rem'] : undefined}
      border="1px"
      borderColor="gray.200"
      transition="all 0.3s ease"
      _hover={{ boxShadow: 'xl', transform: 'scale(1.02)' }}
    >
      <Box p={['2rem', '3rem']}>{children}</Box>
    </Box>
  );

  if (status === 'success') {
    return formBox(
      <VStack spacing="1.5rem" py="8rem">
        <Heading fontSize="2xl" textAlign="center" fontWeight="bold" color="blue.600">
        Merci pour votre message !
        </Heading>
        <Text fontSize="lg" textAlign="center">Nous vous répondrons bientôt.</Text>
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
        maxW={{ base: 'full', md: '50%' }}
        mr={{ base: 0, md: 6 }}
        mb={{ base: 6, md: 0 }}
        display={{ base: displayProp, md: 'block' }}
      >
        <Box
          rounded="lg"
          p={4}
          boxShadow="md"
          border="1px"
          borderColor="gray.200"
          overflow="hidden"
          transition="all 0.3s ease"
          _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
        >
          <iframe
            width="100%"
            height="300"
            frameBorder="0"
            scrolling="no"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Garage%20Nr:,%20791%20EL%20GOUIRA,%20Agadir%2080000+(ocean)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          ></iframe>
          <Box bg="white" p={4} borderRadius="lg" mt={4}>
            <Text fontWeight="bold" fontSize="lg">ADRESSE</Text>
            <Text mt={1}>Garage Nr:, 791 EL GOUIRA, Agadir 80000</Text>
            <Text fontWeight="bold" fontSize="lg" mt={4}>EMAIL</Text>
            <Text mt={1} as="a" color="blue.500" href="mailto:maroc.immocean@gmail.com">maroc.immocean@gmail.com</Text>
            <Text fontWeight="bold" fontSize="lg" mt={4}>TÉLÉPHONE</Text>
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
              {formHeading || 'Demande de consultation gratuite'}
            </Heading>

            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={MdPerson} color="gray.500" />}
              />
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                required
                borderColor="gray.300"
                _placeholder={{ color: 'gray.500' }}
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={MdEmail} color="gray.500" />}
              />
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="Votre courriel"
                value={formData.email}
                onChange={handleChange}
                required
                borderColor="gray.300"
                _placeholder={{ color: 'gray.500' }}
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={MdPhone} color="gray.500" />}
              />
              <Input
                name="phone"
                id="phone"
                type="tel"
                placeholder="Votre numéro de téléphone"
                value={formData.phone}
                onChange={handleChange}
                required
                borderColor="gray.300"
                _placeholder={{ color: 'gray.500' }}
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              />
            </InputGroup>

            <Textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message"
              style={{
                fontWeight: "semibold",
                borderColor: 'blue.600',
                boxShadow: '0 0 5px rgba(0, 128, 128, 0.5)',
                height: '150px'
              }}
              required
            />

            {status === 'error' && errorMessage && (
              <Alert status="error" borderRadius="md" w="full">
                <AlertIcon />
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              w="full"
              mt={6}
              bg="blue.500"
              color="white"
              rounded="md"
              isDisabled={status === 'submitting'}
              _hover={{ bg: 'blue.600', transform: 'translateY(-2px)' }}
              _active={{ bg: 'blue.700', transform: 'translateY(0)' }}
              transition="transform 0.2s ease"
            >
              {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
});

export default ContactForm;