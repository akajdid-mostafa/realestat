import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import PropertySearchPage from './fillter';
import NotFound from './notfound';
import Pagination from './pagination';
import { useRouter } from 'next/router';
import { Block } from '@mui/icons-material';

const POSTS_API_URL = 'https://immoceanrepo.vercel.app/api/posts';
const DETAILS_API_URL = 'https://immoceanrepo.vercel.app/api/details';

const PropertyList = () => {
    const showSearch = true; // or false based on your logic
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('ALL TYPE');
    const [selectedPropertyType, setSelectedPropertyType] = useState('View All');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRoomCount, setSelectedRoomCount] = useState('Tous chambre');
    const [selectedBathroomsCount, setSelectedBathroomsCount] = useState('Tous Salle de bain');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const router = useRouter();
    const itemsPerPage = 3;


    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, detailsResponse] = await Promise.all([
                    fetch(POSTS_API_URL),
                    fetch(DETAILS_API_URL),
                ]);
                const postsData = await postsResponse.json();
                const detailsData = await detailsResponse.json();

                const propertiesWithDetails = postsData.map(post => {
                    const detail = detailsData.find(d => d.postId === post.id);
                    return { ...post, detail };
                });

                setProperties(propertiesWithDetails);
                setFilteredProperties(propertiesWithDetails);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = properties;

        

        if (activeTab === 'FOR Location') {
            filtered = filtered.filter(property => property.categoryId === 2);
        } else if (activeTab === 'FOR Vente') {
            filtered = filtered.filter(property => property.categoryId === 1);
        }

        if (selectedPropertyType !== 'View All') {
            filtered = filtered.filter(property => property.type.type === selectedPropertyType);
        }

        if (selectedCity && selectedCity !== 'All Ville') {
            filtered = filtered.filter(property => property.ville.toLowerCase().includes(selectedCity.toLowerCase()));
        }

        if (selectedRoomCount !== 'Tous chambre') {
            filtered = filtered.filter(property => {
                const rooms = parseInt(property.detail?.rooms, 10);
                if (isNaN(rooms)) return false;
                if (selectedRoomCount.startsWith('Plus')) {
                    return rooms >= 5;
                }
                return rooms === parseInt(selectedRoomCount, 10);
            });
        }

        if (selectedBathroomsCount !== 'Tous Salle de bain') {
            filtered = filtered.filter(property => {
                const bathrooms = parseInt(property.detail?.bathrooms, 10);
                if (isNaN(bathrooms)) return false;
                if (selectedBathroomsCount.startsWith('Plus')) {
                    return bathrooms >= 5;
                }
                return bathrooms === parseInt(selectedBathroomsCount, 10);
            });
        }

        if (searchQuery) {
            filtered = filtered.filter(property =>
                property.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.adress.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filtered = filtered.filter(property => property.status === 'available' || (property.status === 'taken' && property.categoryId === 2));

        setFilteredProperties(filtered);
        setCurrentPage(1);

    }, [activeTab, selectedPropertyType, selectedCity, selectedRoomCount, selectedBathroomsCount, properties, searchQuery]);

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
            // handlePropertyTypeChange(PropertyType || 'View All'); // Set default if not provided
            // handleTabChange(activeTab || 'ALL TYPE'); // Set default if not provided
        }
        
    }, [router.isReady, router.query]);

    // useEffect(() => {
    //     const { } = router.query; // Extract propertyType and tab from router.query
    //     if (router.isReady) {
    //         handlePropertyTypeChange(PropertyType || 'View All'); // Set default if not provided
    //         handleTabChange(ActiveTab || 'ALL TYPE'); // Set default if not provided
    //     }
    // }, [router.isReady, router.query]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        
        const currentQuery = {
            ...router.query,
            page: pageNumber,
            tab: activeTab, // Keep the active tab
            propertyType: selectedPropertyType, // Keep the selected property type
            city: selectedCity, // Keep the selected city
            roomCount: selectedRoomCount, // Keep the selected room count
            bathroomsCount: selectedBathroomsCount, // Keep the selected bathroom count
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
        setSelectedRoomCount(count);
    };

    const handleBathroomsCountChange = (count) => {
        setSelectedBathroomsCount(count);
    };

    const currentItems = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (query) => {
        setSearchQuery(query);
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
                onSearchChange={handleSearchChange} // Pass search change handler
                searchDisplay={showSearch ? 'block' : 'none'} // Set display value based on condition
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