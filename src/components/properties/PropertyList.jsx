import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Flex } from '@chakra-ui/react';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import Filter from '../Index/Filter ';
import PropertySearchPage from './fillter'
import { useRouter } from 'next/router';

const POSTS_API_URL = 'https://immoceanrepo.vercel.app/api/posts';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const itemsPerPage = 6;

    // Calculate total pages
    const totalPages = Math.ceil(properties.length / itemsPerPage);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(POSTS_API_URL);
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, []);

    useEffect(() => {
        const { query } = router;
        if (query.modal === 'yes' && query.id) {
            const propertyId = parseInt(query.id, 10);
            const property = properties.find(item => item.id === propertyId);
            if (property) {
                setSelectedProperty(property);
            } else {
                setSelectedProperty(null);
            }
        } else {
            setSelectedProperty(null);
        }
    }, [router.query, properties]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const currentItems = properties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Box style={{ overflow: 'visible' }}>
            <PropertySearchPage/>
            <Box p={4} display="flex" justifyContent="center" >

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
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            if (page === 1 || page === 2 || page === totalPages || page === totalPages - 1 || page === currentPage) {
                                return (
                                    <Button
                                        key={index}
                                        onClick={() => handlePageChange(page)}
                                        variant={currentPage === page ? 'solid' : 'outline'}
                                        mx={1}
                                        textColor={currentPage === page ? 'white' : 'black'}
                                        colorScheme={currentPage === page ? 'blue' : 'white'}
                                        borderColor="white"
                                        _hover={{
                                            bg: currentPage === page ? 'blue.400' : 'blue.600',
                                            color: 'white'
                                        }}
                                    >
                                        {page}
                                    </Button>
                                );
                            }
                            if ((page === 3 && currentPage > 4) || (page === totalPages - 2 && currentPage < totalPages - 3)) {
                                return <span key={`ellipsis-${index}`} style={{ margin: '0 8px' }}>...</span>;
                            }
                            return null;
                        })}
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
        </Box>
    );
};

export default PropertyList;
