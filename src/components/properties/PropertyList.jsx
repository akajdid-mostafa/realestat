import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Flex } from '@chakra-ui/react';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal'; // Ensure this is your detailed modal component
import { useRouter } from 'next/router';
import { cardData } from '../data'; // Import your data

const PropertyList = ({ properties = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const router = useRouter();
    const itemsPerPage = 6;
    const totalPages = Math.ceil(properties.length / itemsPerPage);

    useEffect(() => {
        const { query } = router;
        if (query.modal === 'yes' && query.id) {
            const propertyId = parseInt(query.id, 10);
            const property = cardData.find(item => item.id === propertyId);
            if (property) {
                setSelectedProperty(property);
            } else {
                setSelectedProperty(null);
            }
        } else {
            setSelectedProperty(null);
        }
    }, [router.query]);

    // Handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate the items to display on the current page
    const currentItems = properties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Box p={4} display="flex" justifyContent="center">
            <Box maxW="7xl" w="full">
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                    gap={6}
                    mx="auto"
                >
                    {currentItems.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onClick={(selected) => {
                                setSelectedProperty(selected);
                                router.push({
                                    pathname: '/properties',
                                    query: { modal: 'yes', id: selected.id },
                                });
                            }}
                        />
                    ))}
                </Grid>

                <Flex mt={8} justify="center" align="center">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        variant="outline"
                        mr={2}
                        textColor="white"
                        bg="blue.600"
                        borderColor="white"
                        _hover={{
                            bg: 'blue.400',
                            color: 'white'
                        }}
                    >
                        Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            variant={currentPage === index + 1 ? 'solid' : 'outline'}
                            mx={1}
                            textColor={currentPage === index + 1 ? 'white' : 'black'}
                            colorScheme={currentPage === index + 1 ? 'blue' : 'white'}
                            borderColor="white"
                            _hover={{
                                bg: currentPage === index + 1 ? 'blue.400' : 'blue.600',
                                color: 'white'
                            }}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage === totalPages}
                        variant="outline"
                        ml={2}
                        textColor="white"
                        bg="blue.600"
                        borderColor="white"
                        _hover={{
                            bg: 'blue.400',
                            color: 'white'
                        }}
                    >
                        Next
                    </Button>
                </Flex>
            </Box>

            {/* Property Detail Modal */}
            <PropertyDetailModal
                isOpen={!!selectedProperty}
                onClose={() => {
                    setSelectedProperty(null);
                    router.push('/properties'); // Clear URL parameters
                }}
                property={selectedProperty}
            />
        </Box>
    );
};

export default PropertyList;
