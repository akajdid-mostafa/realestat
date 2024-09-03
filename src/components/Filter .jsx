import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  List,
  Flex,
  ListItem,
  Button,
  InputGroup,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Checkbox,
} from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';

const citiesInMorocco = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir",
  "Oujda", "Kenitra", "Meknes", "Tétouan", "Safi", "El Jadida",
  "Beni Mellal", "Khouribga", "Settat", "Nador", "Laayoune",
  "Dakhla", "Tiznit", "Taroudant",
];

const Filter = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showList, setShowList] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const componentRef = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = value ? citiesInMorocco.filter(city =>
      city.toLowerCase().startsWith(value.toLowerCase())
    ) : [];
    setFilteredCities(filtered);
    setShowList(!!value);
  };

  const handleInputFocus = () => {
    setShowList(true);
    if (!inputValue) {
      setFilteredCities(citiesInMorocco);
    }
  };

  const handleCitySelect = (city) => {
    setInputValue(city);
    setFilteredCities([]);
    setShowList(false);
  };

  const handleShowProperties = () => {
    setShowProperties(!showProperties);
  };

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setShowList(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box ref={componentRef} className="search-box-offcanvas bg-white p-6 rounded-lg shadow-lg">
      <form>
        <VStack spacing={4} ref={componentRef}>
          <Box ref={componentRef}  display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems="center">
            <Flex  ref={componentRef} spacing={4} gap={4} flexWrap="wrap" width="100%">
              <FormControl ref={componentRef}   flex="1" minWidth="200px">
                <FormLabel ref={componentRef} fontSize="sm">Keyword</FormLabel>
                <Input 
                
                  type="text"
                  placeholder="Search for Keyword"
                  name="k"
                  variant="outline"
                  bg="yellow.50"
                  size="lg"
                  
                />
              </FormControl>
              <FormControl flex="1" minWidth="200px">
                <FormLabel htmlFor="city-input">Enter a City</FormLabel>
                <InputGroup>
                  <Input
                    id="city-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Type a city name..."
                    type="text"
                    name="k"
                    bg="yellow.50"
                    size="lg"
                  />
                </InputGroup>
                {showList && (
                  <List
                    spacing={1}
                    mt={-2}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor="gray.200"
                    position="absolute"
                    zIndex={1}
                    maxHeight="200px"
                    overflowY="auto"
                    width="100%"
                    bg="white"
                  >
                    {filteredCities.map((city, index) => (
                      <ListItem
                        key={index}
                        padding={2}
                        bg="white"
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </ListItem>
                    ))}
                  </List>
                )}
              </FormControl>
              <FormControl  flex="1" minWidth="200px">
                <FormLabel ref={componentRef} fontSize="sm">Category</FormLabel>
                <Select  name="category_id" variant="outline" bg="yellow.50" size="lg">
                  <option value="">All</option>
                  <option value="1">Apartment</option>
                  <option value="2">Villa</option>
                  <option value="3">Condo</option>
                  <option value="4">House</option>
                  <option value="5">Land</option>
                  <option value="6">Commercial property</option>
                </Select>
              </FormControl>
            </Flex>
            <Button
              colorScheme='blue'
              variant='solid'
              mt={{ base: 4, md: 0 }}
              ml={{ base: 0, md: 6 }}
              height='45px'
            >
              Search
            </Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default Filter;