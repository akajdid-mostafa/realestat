import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Input,
    List,
    ListItem,
    FormControl,
    FormLabel,
    IconButton,
    InputGroup,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'; // Import an icon for the button

const citiesInMorocco = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fes",
    "Tangier",
    "Agadir",
    "Oujda",
    "Kenitra",
    "Meknes",
    "Tétouan",
    "Safi",
    "El Jadida",
    "Beni Mellal",
    "Khouribga",
    "Settat",
    "Nador",
    "Laayoune",
    "Dakhla",
    "Tiznit",
    "Taroudant",
];

const CityInput = () => {
    const [inputValue, setInputValue] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [showList, setShowList] = useState(false);
    const listRef = useRef(null);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        // Filter cities based on the input
        if (value) {
            const filtered = citiesInMorocco.filter(city =>
                city.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
    };

    const handleInputFocus = () => {
        setShowList(true); // Show the list when the input is focused
        if (!inputValue) {
            setFilteredCities(citiesInMorocco); // Show all cities if input is empty
        }
    };

    const handleSearchClick = () => {
        setShowList(true); // Show the list of cities
    };

    const handleCitySelect = (city) => {
        setInputValue(city); // Set input value to selected city
        setFilteredCities([]); // Clear the filtered list
        setShowList(false); // Hide the list
    };

    const handleClickOutside = (event) => {
        if (listRef.current && !listRef.current.contains(event.target)) {
            setShowList(false); // Hide the list if clicked outside
        }
    };

    useEffect(() => {
        // Attach the click event listener on mount
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup the event listener on unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Box width="300px" margin="auto" mt={5} position="relative" ref={listRef}>
            <FormControl>
                <FormLabel htmlFor="city-input">Enter a City</FormLabel>
                <InputGroup>
                    <Input
                        id="city-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus} // Show list on focus
                        placeholder="Type a city name..."
                    />
                    <IconButton
                        aria-label="Search Cities"
                        icon={<SearchIcon />}
                        onClick={handleSearchClick}
                    />
                </InputGroup>
                {showList && (
                    <List
                        spacing={1}
                        mt={-2} // Adjust the margin to position it above the input
                        borderWidth={1}
                        borderRadius="md"
                        borderColor="gray.200"
                        position="absolute" // Use absolute positioning
                        zIndex={1} // Ensure it appears above other elements
                        maxHeight="200px"
                        overflowY="auto"
                        width="100%" // Match input width
                        bg="white" // Solid background color
                    >
                        {filteredCities.map((city, index) => (
                            <ListItem
                                key={index}
                                padding={2}
                                bg="white" // Background color for each list item
                                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                                onClick={() => handleCitySelect(city)}
                            >
                                {city}
                            </ListItem>
                        ))}
                    </List>
                )}
            </FormControl>
        </Box>
    );
};

export default CityInput;