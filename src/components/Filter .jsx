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
  HStack,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';

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
  const componentRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const savedInputValue = localStorage.getItem('cityInput');
    if (savedInputValue) {
      setInputValue(savedInputValue);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cityInput', inputValue);
  }, [inputValue]);

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
    <Box ref={componentRef} className="search-box-offcanvas p-4 md:p-6 rounded-lg shadow-lg">
      {/* Tabs Component */}
      <Box >
        <Tabs
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
          variant="enclosed"
          size="lg"
        >
          <TabList
            justifyContent="center"
            color="white"
          >
            <Tab
              bgColor="rgba(128, 128, 128, 0.4)"
              _hover={{ bg: 'white', color: 'black' }}
              _selected={{ bg: 'white', color: 'black' }}
              mr={1}
            >All Type</Tab>
            <Tab
              bgColor="rgba(128, 128, 128, 0.4)"
              _hover={{ bg: 'white', color: 'black' }}
              _selected={{ bg: 'white', color: 'black' }}
              mr={1}
            >Pour l'achat</Tab>
            <Tab
              bgColor="rgba(128, 128, 128, 0.4)"
              _hover={{ bg: 'white', color: 'black' }}
              _selected={{ bg: 'white', color: 'black' }}
            >A louer</Tab>
          </TabList>
        </Tabs>
      </Box>

      <Box className="filter-form p-4 md:p-6 bg-white rounded-lg shadow-lg">
        <form>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            wrap="wrap"
            align="center"
            gap={4}
          >
            <FormControl ref={componentRef} flex="1" minWidth={{ base: '100%', md: 'auto' }}>
              <FormLabel fontSize={{ base: 'md', md: 'md' }} color="gray.600">Ville</FormLabel>
              <InputGroup>
                <Input
                  id="city-input"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="Choisir une ville"
                  size="lg"
                />
              </InputGroup>
              {showList && (
                <List
                  spacing={1}
                  mt={1}
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

            <FormControl flex="1" minWidth={{ base: '100%', md: 'auto' }}>
              <FormLabel fontSize={{ base: 'md', md: 'md' }} color="gray.600">Catégorie</FormLabel>
              <Select
                name="category_id"
                variant="outline"
                bg="white"
                borderColor="gray.300"
                borderRadius="md"
                size="lg"
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
              >
                <option value="">Tous</option>
                <option value="1">Appartment</option>
                <option value="2">Villa</option>
                <option value="3">Condo</option>
                <option value="4">House</option>
                <option value="5">Land</option>
                <option value="6">Commercial property</option>
              </Select>
            </FormControl>

            <FormControl flex="1" minWidth={{ base: '100%', md: 'auto' }}>
              <FormLabel fontSize={{ base: 'md', md: 'md' }} color="gray.600">Floor</FormLabel>
              <Select
                name="surface_id"
                variant="outline"
                bg="white"
                borderColor="gray.300"
                borderRadius="md"
                size="lg"
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
              >
                <option value="">Tous</option>
                <option value="0-60">Rez de chaussée</option>
                <option value="60-100">Premier étage</option>
                <option value="100-200">Deuxième étage</option>
                <option value="200+">Troisième étage</option>
                <option value="200+">Quatrième étage</option>
                <option value="200+">Plus Quatrième étage</option>
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              variant="solid"
              size="lg"
              flexShrink={0}
              mt={8}
            >
              Search
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default Filter;
