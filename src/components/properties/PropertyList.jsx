import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import PropertySearchPage from './fillter'; // Fix import path if needed
import NotFound from './notfound';
import Pagination from './pagination';
import { useRouter } from 'next/router';

const POSTS_API_URL = 'https://immoceanrepo.vercel.app/api/posts';
const DETAILS_API_URL = 'https://immoceanrepo.vercel.app/api/details';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('ALL TYPE');
    const [selectedPropertyType, setSelectedPropertyType] = useState('View All');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRoomCount, setSelectedRoomCount] = useState('Tous chambre');
    const [selectedBathroomsCount, setSelectedBathroomsCount] = useState('Tous Salle de bain');
    const router = useRouter();
    const itemsPerPage = 12;

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

        // Tab filtering
        if (activeTab === 'FOR Location') {
            filtered = filtered.filter(property => property.categoryId === 2);
        } else if (activeTab === 'FOR Vente') {
            filtered = filtered.filter(property => property.categoryId === 1);
        }

        // Property type filtering
        if (selectedPropertyType !== 'View All') {
            filtered = filtered.filter(property => property.type.type === selectedPropertyType);
        }

        // City filtering
        if (selectedCity && selectedCity !== 'All Ville') {
            filtered = filtered.filter(property => property.ville === selectedCity);
        }

        // Room count filtering
if (selectedRoomCount !== 'Tous chambre') {
    filtered = filtered.filter(property => {
        const rooms = parseInt(property.detail?.rooms, 10); // Use optional chaining and parseInt
        if (isNaN(rooms)) return false; // Exclude properties with invalid or missing room values
        
        if (selectedRoomCount.startsWith('Plus')) {
            return rooms >= 5; // 'Plus 5 chambre' shows properties with 5 or more rooms
        }
        return rooms === parseInt(selectedRoomCount, 10); // Exact number filtering
    });
}

// Bathrooms count filtering
if (selectedBathroomsCount !== 'Tous Salle de bain') {
    filtered = filtered.filter(property => {
        const bathrooms = parseInt(property.detail?.bathrooms, 10); // Use optional chaining and parseInt
        if (isNaN(bathrooms)) return false; // Exclude properties with invalid or missing bathroom values
        
        if (selectedBathroomsCount.startsWith('Plus')) {
            return bathrooms >= 5; // 'Plus 5 Salle de bain' shows properties with 5 or more bathrooms
        }
        return bathrooms === parseInt(selectedBathroomsCount, 10); // Exact number filtering
    });
}
        // Availability filtering
        filtered = filtered.filter(property => property.status === 'available' || (property.status === 'taken' && property.categoryId === 2));

        setFilteredProperties(filtered);
    }, [activeTab, selectedPropertyType, selectedCity, selectedRoomCount, selectedBathroomsCount, properties]);

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
        setCurrentPage(1);
    };

    const handlePropertyTypeChange = (type) => {
        setSelectedPropertyType(type);
        setCurrentPage(1);
    };

    const handleCityChange = (city) => {
        setSelectedCity(city);
        setCurrentPage(1);
    };

    const handleRoomCountChange = (count) => {
        setSelectedRoomCount(count);
        setCurrentPage(1);
    };

    const handleBathroomsCountChange = (count) => {
        setSelectedBathroomsCount(count);
        setCurrentPage(1);
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
                properties={properties}
                onCityChange={handleCityChange}
                onRoomCountChange={handleRoomCountChange}
                onBathroomsCountChange={handleBathroomsCountChange}
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
