import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import PropertySearchPage from './fillter';
import NotFound from './notfound';
import Pagination from './pagination';
import { useRouter } from 'next/router';

const POSTS_API_URL = 'https://immoceanrepo.vercel.app/api/posts';

const PropertyList = () => {
    const showSearch = true; // or false based on your logic
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]); // Ensure it's initialized as an array
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('ALL TYPE');
    const [selectedPropertyType, setSelectedPropertyType] = useState('View All');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRoomCount, setSelectedRoomCount] = useState('Tous chambre');
    const [selectedBathroomsCount, setSelectedBathroomsCount] = useState('Tous Salle de bain');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [itemsPerPage, setItemsPerPage] = useState(12); // State for items per page
    const router = useRouter();

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams();

            if (activeTab === 'FOR Location') {
                queryParams.append('categoryId', '2');
            } else if (activeTab === 'FOR Vente') {
                queryParams.append('categoryId', '1');
            }

            if (selectedPropertyType !== 'View All') {
                queryParams.append('type', selectedPropertyType);
            }

            if (selectedCity && selectedCity !== 'All Ville') {
                queryParams.append('search', selectedCity);
            }

            if (selectedRoomCount !== 'Tous chambre') {
                queryParams.append('rooms', selectedRoomCount);
            }

            if (selectedBathroomsCount !== 'Tous Salle de bain') {
                queryParams.append('bathrooms', selectedBathroomsCount);
            }

            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }

            const response = await fetch(`${POSTS_API_URL}?${queryParams.toString()}`);
            const data = await response.json();

            console.log('Fetched data:', data); // Debugging line
            setProperties(data);
            setFilteredProperties(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, selectedPropertyType, selectedCity, selectedRoomCount, selectedBathroomsCount, searchQuery]);

    useEffect(() => {
        const { page } = router.query;
        if (page) {
            setCurrentPage(parseInt(page, 10));
        } else {
            setCurrentPage(1);
        }
    }, [router.query]);

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

    useEffect(() => {
        const { city, roomCount, bathroomsCount } = router.query;
        
        if (router.isReady) {
            handleCityChange(city || '');
            handleRoomCountChange(roomCount || 'Tous chambre');
            handleBathroomsCountChange(bathroomsCount || 'Tous Salle de bain');
        }
        
    }, [router.isReady, router.query]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        
        const currentQuery = {
            ...router.query,
            page: pageNumber,
            tab: activeTab,
            propertyType: selectedPropertyType,
            city: selectedCity,
            roomCount: selectedRoomCount,
            bathroomsCount: selectedBathroomsCount,
        };
    
        router.replace({
            pathname: router.pathname,
            query: currentQuery,
        }, undefined, { shallow: true });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    const handlePropertyTypeChange = (type) => {
        setSelectedPropertyType(type);
    };
    const handleCityChange = (city) => {
        setSelectedCity(city);
    };
    const handleRoomCountChange = (count) => {
        console.log('Room count changed to:', count);
        setSelectedRoomCount(count);
    };
    const handleBathroomsCountChange = (count) => {
        console.log('Bathrooms count changed to:', count);
        setSelectedBathroomsCount(count);
    };

    const currentItems = Array.isArray(filteredProperties) ? filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : []; // Check if filteredProperties is an array

    console.log('Current items:', currentItems); // Debugging line

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    return (
        <Box style={{ overflow: 'visible' }}>
            <PropertySearchPage
                onTabChange={handleTabChange}
                onPropertyTypeChange={handlePropertyTypeChange}
                properties={properties}
                onCityChange={handleCityChange}
                onRoomCountChange={handleRoomCountChange}
                onBathroomsCountChange={handleBathroomsCountChange}
                onSearchChange={handleSearchChange}
                searchDisplay={showSearch ? 'block' : 'none'}
                num={4}
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
                                    onClick={() => {
                                        setSelectedProperty(property);
                                        router.push({
                                            pathname: '/properties',
                                            query: { modal: 'yes', id: property.id },
                                        });
                                    }}
                                />
                            ))}
                        </Grid>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            rowsPerPage={itemsPerPage}
                            totalRows={filteredProperties.length}
                            onRowsPerPageChange={handleItemsPerPageChange}
                        />
                    </Box>
                ) : (
                    <NotFound />
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
