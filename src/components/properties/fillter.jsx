import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  List,
  ListItem,
  InputGroup,
  FormControl,
  FormLabel,
  Grid,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { SlidersHorizontal } from 'lucide-react';

const citiesInMorocco = [
  "Agadir", "Aïn Harrouda", "Ben Yakhlef", "Bouskoura", "Casablanca", "Médiouna", "Mohammadia", "Tit Mellil", "Bejaad", "Ben Ahmed", "Benslimane", "Berrechid",
  "Boujniba", "Boulanouare", "Bouznika", "Deroua", "El Borouj", "El Gara", "Guisser", "Hattane", "Khouribga", "Loulad", "Oued Zem", "Oulad Abbou",
  "Oulad H'Riz Sahel", "Oulad M'rah", "Oulad Said", "Oulad Sidi Ben Daoud", "Ras El Ain", "Settat", "Sidi Rahhal Chataï", "Soualem", "Azemmour", "Bir Jdid",
  "El Jadida", "Hrara", "Ighoud", "Jamaat Shaim", "Jorf Lasfar", "Khemis Zemamra", "Laaounate", "Moulay Abdallah", "Oualidia", "Oulad Amrane", "Oulad Frej",
  "Oulad Ghadbane", "Safi", "Sebt El Maârif", "Sebt Gzoula", "Sidi Ahmed", "Sidi Ali Ban Hamdouche", "Sidi Bennour", "Sidi Bouzid", "Sidi Smaïl", "Youssoufia",
  "Fès", "Ain Cheggag", "Bhalil", "Boulemane", "El Menzel", "Guigou", "Imouzzer Kandar", "Imouzzer Marmoucha", "Missour", "Moulay Yaacoub", "Ouled Tayeb",
  "Ribate El Kheir", "Séfrou", "Skhinate", "Tafajight", "Arbaoua", "Ain Dorij", "Dar Gueddari", "Had Kourt", "Jorf El Melha", "Kénitra", "Khenichet",
  "Lalla Mimouna", "Mechra Bel Ksiri", "Mehdia", "Moulay Bousselham", "Sidi Allal Tazi", "Sidi Kacem", "Sidi Slimane", "Sidi Taibi", "Sidi Yahya El Gharb",
  "Souk El Arbaa", "Akka", "Assa", "Bouizakarne", "El Ouatia", "Es-Semara", "Fam El Hisn", "Foum Zguid", "Guelmim", "Taghjijt", "Tan-Tan", "Tata",
  "Zag", "Marrakech", "Ait Daoud", "Amizmiz", "Assahrij", "Ait Ourir", "Ben Guerir", "Chichaoua", "El Hanchane", "El Kelaâ des Sraghna", "Fraïta",
  "Ghmate", "Imintanoute", "Kattara", "Lalla Takerkoust", "Loudaya", "Laatataouia", "Moulay Brahim", "Mzouda", "Sid L'Mokhtar", "Sid Zouin", "Sidi Abdallah Ghiat",
  "Sidi Bou Othmane", "Sidi Rahhal", "Skhour Rehamna", "Smimou", "Tafetachte", "Tahannaout", "Talmest", "Tamallalt", "Tamanar", "Tamansourt", "Tameslouht",
  "Tanalt", "Meknes", "Khenifra", "Agourai", "Ain Taoujdate", "MyAliCherif", "Rissani", "Amalou Ighriben", "Aoufous", "Arfoud", "Azrou", "Ain Jemaa",
  "Ain Karma", "Ain Leuh", "Ait Boubidmane", "Ait Ishaq", "Boudnib", "Boumia", "El Hajeb", "Elkbab", "Er-Rich", "Errachidia", "Gardmit", "Goulmima",
  "Gourrama", "Had Bouhssoussen"
];


const PropertySearchPage = () => {
  const [activeTab, setActiveTab] = useState('ALL TYPE'); // Set default active tab to "ALL TYPE"
  const [selectedPropertyType, setSelectedPropertyType] = useState('View All');
  const [showFilters, setShowFilters] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showList, setShowList] = useState(false);
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
    <Box>
      <Box as="main">
        <Box maxW="7xl" mx="auto" py={6} px={{ base: 4, sm: 6, lg: 8 }}>
          <Box borderRadius="lg" overflow="hidden" boxShadow="xl">
            <Box bg="white">
              {/* Header Tabs */}
              <Flex borderBottom="1px" borderColor="gray.200" align="center" justify="center">
                {['ALL TYPE', 'FOR RENT', 'FOR SALE'].map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    fontWeight="semibold"
                    color={activeTab === tab ? 'blue.600' : 'gray.600'}
                    borderBottomWidth={activeTab === tab ? '2px' : '0'}
                    borderColor={activeTab === tab ? 'blue.600' : 'transparent'}
                    onClick={() => setActiveTab(tab)}
                    px={6}
                    py={4}
                  >
                    {tab}
                  </Button>
                ))}
              </Flex>

              {/* Search Bar */}
              <Flex
                p={4}
                align="center"
                gap={4}
                flexDir={{ base: "column", md: "row" }} // Responsive flex direction
              >
                <Box
                  display="flex"
                  flexDirection={{ base: "column", md: "row" }} // Stack elements vertically on small screens and horizontally on large screens
                  gap={4} // Add spacing between elements
                  width="100%" // Ensure box takes full width
                >
                  <FormControl ref={componentRef} flex="1" minWidth={{ base: '100%', md: 'auto' }}>
                    <InputGroup>
                      <Input
                        id="city-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Search Ville"
                        size="lg"
                        flex="1"
                        minW="0" // Allow input to shrink
                        w={{ base: "100%", md: "auto" }} // Full width on small screens and auto width on large screens
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
                        zIndex={9999} // Set a high zIndex value
                        maxHeight="200px" // Set a maximum height
                        overflowY="auto" // Enable vertical scrolling
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
                  <Select
                    placeholder="Choisir l'espace"
                    flex="1"
                    w={{ base: "100%", md: "auto" }} // Consistent width with Input
                    size="lg" // Match the size of Input
                  >
                    <option value="all">Tous</option>
                    <option value="0 à 60 m²">0 à 60 m²</option>
                    <option value="60 m² à 100 m²">60 m² à 100 m²</option>
                    <option value="100 m² à 200 m²">100 m² à 200 m²</option>
                    <option value="200 m² à 500 m²">200 m² à 500 m²</option>
                    <option value="Plus de 500 m²">Plus de 500 m²</option>
                  </Select>
                  <Select
                    placeholder="Choisissez l'étage"
                    flex="1"
                    w={{ base: "100%", md: "auto" }} // Consistent width with Input
                    size="lg" // Match the size of Input
                  >
                    <option value="all">Tous</option>
                    <option value="floor1">Premier étage</option>
                    <option value="floor2">Deuxième étage</option>
                    <option value="floor3">Troisième étage</option>
                    <option value="floor4">Quatrième étage</option>
                    <option value="floor5+">Au-dessus du cinquième</option>
                  </Select>
                </Box>
                <Box
                  display="flex"
                  gap={4} // Add spacing between buttons
                  alignItems="center" // Align buttons centrally
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    aria-expanded={showFilters}
                    aria-label="Toggle filters"
                  >
                    <SlidersHorizontal size={16} />
                  </Button>
                  <Button bg="blue.600" _hover={{ bg: 'blue.700' }} color="white">
                    <SearchIcon mr={2} />
                    Search
                  </Button>
                </Box>
              </Flex>

              {/* Filters Section */}
              {showFilters && (
                <Box p={4} borderTop="1px" borderColor="gray.200">
                  <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4} mt={2}>
                    <Box >
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Number rooms </Text>
                      <Select
                        placeholder="ALL"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </Select>
                    </Box>
                    <Box >
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Number bedromms </Text>
                      <Select
                        placeholder="ALL"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </Select>
                    </Box>
                    <Box >
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Number livingrooms </Text>
                      <Select
                        placeholder="ALL"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </Select>
                    </Box>
                    <Box >
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Number kitchen </Text>
                      <Select
                        placeholder="ALL"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </Select>
                    </Box>
                  </Grid>
                </Box>
              )}

              {/* Property Type Buttons */}
              <Flex flexWrap="wrap" gap={2} p={4} borderTop="1px" borderColor="gray.200" justifyContent="center">
                {['View All', 'Apartment', 'Villa', 'Studio', 'House', 'Office'].map((type) => (
                  <Button
                    key={type}
                    variant={selectedPropertyType === type ? 'solid' : 'outline'}
                    colorScheme={selectedPropertyType === type ? 'blue' : 'gray'}
                    onClick={() => setSelectedPropertyType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default PropertySearchPage;

