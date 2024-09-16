import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Flex } from '@chakra-ui/react';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import PropertySearchPage from './fillter';
import NotFound from './notfound';
import { useRouter } from 'next/router';

const POSTS_API_URL = 'https://immoceanrepo.vercel.app/api/posts';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('ALL TYPE');
    const [selectedPropertyType, setSelectedPropertyType] = useState('View All');
    const router = useRouter();
    const itemsPerPage = 6;

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(POSTS_API_URL);
                const data = await response.json();
                setProperties(data);
                setFilteredProperties(data); // Initialize with all properties
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, []);

    useEffect(() => {
        // Filter properties based on the selected tab, property type, and status
        let filtered = properties;

        if (activeTab === 'FOR Location') {
            filtered = filtered.filter(property => property.categoryId === 2);
        } else if (activeTab === 'FOR Vente') {
            filtered = filtered.filter(property => property.categoryId === 1);
        }
        if (selectedPropertyType !== 'View All') {
            filtered = filtered.filter(property => property.type.type === selectedPropertyType);
        }
        // Filter by status: available or taken
        filtered = filtered.filter(property => property.status === 'available' || (property.status === 'taken' && property.categoryId === 2));

        setFilteredProperties(filtered);
    }, [activeTab, selectedPropertyType, properties]);

    useEffect(() => {
        const { query } = router;
        if (query.modal === 'yes' && query.id) {
            const propertyId = parseInt(query.id, 10);
            const property = filteredProperties.find(item => item.id === propertyId);
            if (property) {
                setSelectedProperty(property);
            } else {
                setSelectedProperty(null);
            }
        } else {
            setSelectedProperty(null);
        }
    }, [router.query, filteredProperties, router]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset page to 1 when tab changes
    };

    const handlePropertyTypeChange = (type) => {
        setSelectedPropertyType(type);
        setCurrentPage(1); // Reset page to 1 when property type changes
    };

    const currentItems = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Box style={{ overflow: 'visible' }}>
            <PropertySearchPage
                onTabChange={handleTabChange}
                onPropertyTypeChange={handlePropertyTypeChange}
                properties={properties} // Pass your list of properties here
            />
            <Box p={4} display="flex" justifyContent="center">
                {currentItems.length > 0 ? (
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
                ) : (
                    <NotFound /> // Display NotFound component if no properties are found
                )}
            </Box>

            {selectedProperty && (
                <PropertyDetailModal
                    isOpen={!!selectedProperty}
                    onClose={() => router.push('/properties')}
                    property={selectedProperty}
                />
            )}
        </Box>
    );
};

export default PropertyList;
