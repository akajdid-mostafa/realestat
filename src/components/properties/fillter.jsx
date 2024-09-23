import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaBed, FaChevronDown, FaBath } from "react-icons/fa";
import { useRouter } from 'next/router';
import Link from 'next/link';

const citiesInMorocco = [
  "All Ville","Agadir","Aïn Harrouda",  "Ben Yakhlef",  "Bouskoura",  "Casablanca",  "Médiouna",  "Mohammadia",  "Tit Mellil",  "Bejaad",  "Ben Ahmed",  "Benslimane",  "Berrechid",
  "Boujniba",  "Boulanouare",  "Bouznika",  "Deroua",  "El Borouj",  "El Gara",  "Guisser",  "Hattane",  "Khouribga",  "Loulad",  "Oued Zem",  "Oulad Abbou",
  "Oulad H'Riz Sahel",  "Oulad M'rah",  "Oulad Said",  "Oulad Sidi Ben Daoud",  "Ras El Ain",  "Settat",  "Sidi Rahhal Chataï",  "Soualem",  "Azemmour",  "Bir Jdid",
  "El Jadida",  "Hrara",  "Ighoud",  "Jamaat Shaim",  "Jorf Lasfar",  "Khemis Zemamra",  "Laaounate",  "Moulay Abdallah",  "Oualidia",  "Oulad Amrane",  "Oulad Frej",
  "Oulad Ghadbane",  "Safi",  "Sebt El Maârif",  "Sebt Gzoula",  "Sidi Ahmed",  "Sidi Ali Ban Hamdouche",  "Sidi Bennour",  "Sidi Bouzid",  "Sidi Smaïl",  "Youssoufia",
  "Fès",  "Ain Cheggag",  "Bhalil",  "Boulemane",  "El Menzel",  "Guigou",  "Imouzzer Kandar",  "Imouzzer Marmoucha",  "Missour",  "Moulay Yaacoub",  "Ouled Tayeb",
  "Ribate El Kheir",  "Séfrou",  "Skhinate",  "Tafajight",  "Arbaoua",  "Ain Dorij",  "Dar Gueddari",  "Had Kourt",  "Jorf El Melha",  "Kénitra",  "Khenichet",
  "Lalla Mimouna",  "Mechra Bel Ksiri",  "Mehdia",  "Moulay Bousselham",  "Sidi Allal Tazi",  "Sidi Kacem",  "Sidi Slimane",  "Sidi Taibi", "Sidi Yahya El Gharb",
  "Souk El Arbaa",  "Akka",  "Assa",  "Bouizakarne",  "El Ouatia",  "Es-Semara",  "Fam El Hisn",  "Foum Zguid",  "Guelmim",  "Taghjijt",  "Tan-Tan",  "Tata",
  "Zag",  "Marrakech",  "Ait Daoud",  "Amizmiz",  "Assahrij",  "Ait Ourir",  "Ben Guerir",  "Chichaoua",  "El Hanchane",  "El Kelaâ des Sraghna",  "Fraïta",
  "Ghmate",  "Imintanoute",  "Kattara",  "Lalla Takerkoust",  "Loudaya",  "Laatataouia",  "Moulay Brahim",  "Mzouda",  "Sid L'Mokhtar",  "Sid Zouin",  "Sidi Abdallah Ghiat",
  "Sidi Bou Othmane",  "Sidi Rahhal",  "Skhour Rehamna",  "Smimou",  "Tafetachte",  "Tahannaout",  "Talmest",  "Tamallalt",  "Tamanar",  "Tamansourt",  "Tameslouht",
  "Tanalt",  "Meknes",  "Khenifra",  "Agourai",  "Ain Taoujdate",  "MyAliCherif",  "Rissani",  "Amalou Ighriben",  "Aoufous",  "Arfoud",  "Azrou",  "Ain Jemaa",
  "Ain Karma",  "Ain Leuh",  "Ait Boubidmane",  "Ait Ishaq",  "Boudnib",  "Boumia",  "El Hajeb",  "Elkbab",  "Er-Rich",  "Errachidia",  "Gardmit",  "Goulmima",
  "Gourrama",  "Had Bouhssoussen"
];

const PropertySearchPage = ({ 
  onTabChange, 
  onPropertyTypeChange, 
  properties = [],
  onCityChange,
  onRoomCountChange,
  onBathroomsCount
}) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('View All');
  const [selectedCity, setSelectedCity] = useState('Select a city');
  const [cityInput, setCityInput] = useState('');
  const [selectedRoomCount, setSelectedRoomCount] = useState('Tous chambre');
  const [selectedBathroomsCount, setSelectedBathroomsCount] = useState('Tous Salle de bain');
  const inputRef = useRef(null);

  const propertyTypes = [...new Set(properties.map(property => property.type.type))];

  useEffect(() => {
    // Assuming properties might be updated asynchronously, re-calculate propertyTypes when properties change
    const newPropertyTypes = [...new Set(properties.map(property => property.type.type))];
    // Optionally set a state here if propertyTypes needs to trigger re-renders
  }, [properties]); // Dependency on properties to update when it changes

  const updateUrlWithoutNavigation = (newParams) => {
    const url = new URL(window.location.href);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, '', url.toString());
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (typeof onTabChange === 'function') {
      onTabChange(tab);
    }
    // Update URL without navigation
    updateUrlWithoutNavigation({ tab: tab.replace(/\s/g, '+') });
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (typeof onCityChange === 'function') {
      onCityChange(city);
    }
    updateUrlWithoutNavigation({ city });
  };

  const handleRoomCountChange = (count) => {
    setSelectedRoomCount(count);
    if (typeof onRoomCountChange === 'function') {
      onRoomCountChange(count);
    }
    updateUrlWithoutNavigation({ roomCount: count });
  };

  const handleBathroomsCountChange = (count) => {
    setSelectedBathroomsCount(count);
    if (typeof onBathroomsCount === 'function') {
      onBathroomsCount(count);
    }
    updateUrlWithoutNavigation({ bathroomsCount: count });
  };

  const handlePropertyTypeChange = (type) => {
    setSelectedPropertyType(type);
    if (typeof onPropertyTypeChange === 'function') {
      onPropertyTypeChange(type);
    }
    // Update URL without navigation
    updateUrlWithoutNavigation({ propertyType: type.replace(/\s/g, '+') });
  };

  const handleCitySearch = (event) => {
    setCityInput(event.target.value);
  };

  const getSearchUrl = () => {
    const queryParams = new URLSearchParams({
      city: selectedCity === 'Select a city' ? '' : selectedCity,
      roomCount: selectedRoomCount,
      bathroomsCount: selectedBathroomsCount,
      tab: activeTab.replace(/\s/g, '+'),
      propertyType: selectedPropertyType === 'View All' ? '' : selectedPropertyType.replace(/\s/g, '+')
    }).toString();

    return `/properties?${queryParams}`;
  };

  const handleSearch = () => {
    router.push(getSearchUrl());
  };
  // array.includes()

  const filteredCities = citiesInMorocco.filter((city) =>
    city.toLowerCase().includes(cityInput.toLowerCase())
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tabFromUrl = queryParams.get('tab');
    const cityFromUrl = queryParams.get('city');
    const roomCountFromUrl = queryParams.get('roomCount');
    const bathroomsCountFromUrl = queryParams.get('bathroomsCount');
    const propertyTypeFromUrl = queryParams.get('propertyType');

    // Update states based on URL parameters
    if (tabFromUrl) {
      const formattedTab = tabFromUrl.replace(/\+/g, ' ');
      setActiveTab(formattedTab);
      if (typeof onTabChange === 'function') {
        onTabChange(formattedTab);
      }
    }
    if (cityFromUrl) setSelectedCity(cityFromUrl);
    if (roomCountFromUrl) setSelectedRoomCount(roomCountFromUrl);
    if (bathroomsCountFromUrl) setSelectedBathroomsCount(bathroomsCountFromUrl);
    if (propertyTypeFromUrl) {
      const formattedPropertyType = propertyTypeFromUrl.replace(/\+/g, ' ');
      setSelectedPropertyType(formattedPropertyType);
      if (typeof onPropertyTypeChange === 'function') {
        onPropertyTypeChange(formattedPropertyType);
      }
    }

  }, [router.query, onTabChange, onPropertyTypeChange]); // Add onTabChange and onPropertyTypeChange to the dependency array

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading indicator
  }

  return (
    <Box>
      <Box as="main">
        <Box maxW="7xl" mx="auto" py={6} px={{ base: 4, sm: 6, lg: 8 }}>
          <Box borderRadius="lg" overflow="hidden" boxShadow="xl">
            <Box bg="white">
              <Flex borderBottom="1px" borderColor="gray.200" align="center" justify="center">
                {['ALL TYPE', 'FOR Vente', 'FOR Location'].map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    fontWeight="bold"
                    color={activeTab === tab ? 'blue.600' : 'gray.600'}
                    borderBottomWidth={activeTab === tab ? '2px' : '0'}
                    borderColor={activeTab === tab ? 'blue.600' : 'transparent'}
                    onClick={() => handleTabChange(tab)}
                    px={6}
                    py={4}
                  >
                    {tab}
                  </Button>
                ))}
              </Flex>

              <Flex p={4} align="center" gap={4} flexDir={{ base: "column", md: "row" }}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} width="100%">
                  <GridItem>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<FaChevronDown />} w="100%" size="lg">
                        {selectedCity}
                      </MenuButton>
                      <MenuList maxHeight="320px" overflowY="auto">
                        <InputGroup p={2}>
                          <Input
                            placeholder="Search..."
                            value={cityInput}
                            onChange={handleCitySearch}
                            ref={inputRef}
                          />
                        </InputGroup>
                        {filteredCities.map((city, index) => (
                          <MenuItem key={index} onClick={() => {
                            setSelectedCity(city);
                            setCityInput('');
                          }}>
                            {city}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </GridItem>
                  <GridItem>
                    <Menu>
                      <MenuButton as={Button} leftIcon={<FaBed />} rightIcon={<FaChevronDown />} w="100%" size="lg">
                        {selectedRoomCount}
                      </MenuButton>
                      <MenuList>
                        {["Tous chambre", "1 chambre", "2 chambre", "3 chambre", "4 chambre", "Plus 5 chambre"].map((count) => (
                          <MenuItem key={count} onClick={() => setSelectedRoomCount(count)}>
                            {count}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </GridItem>
                  <GridItem>
                    <Menu>
                      <MenuButton as={Button} leftIcon={<FaBath />} rightIcon={<FaChevronDown />} w="100%" size="lg">
                        {selectedBathroomsCount}
                      </MenuButton>
                      <MenuList>
                        {["Tous Salle de bain", "1 Salle de bain", "2 Salle de bain", "3 Salle de bain", "4 Salle de bain", "Plus 5 Salle de bain"].map((count) => (
                          <MenuItem key={count} onClick={() => setSelectedBathroomsCount(count)}>
                            {count}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </GridItem>
                </Grid>
                <Button 
                  onClick={handleSearch}
                  p={4} 
                  w={{ base: "100%", md: "auto" }} 
                  bg="blue.600" 
                  _hover={{ bg: 'blue.700' }} 
                  color="white"
                >
                  <SearchIcon mr={2} />
                  Search
                </Button>
              </Flex>
              <Flex flexWrap="wrap" gap={2} p={4} borderTop="1px" borderColor="gray.200" justifyContent="center">
                {['View All', ...propertyTypes].map((type) => (
                  <Button
                    key={type}
                    variant={selectedPropertyType === type ? 'solid' : 'outline'}
                    colorScheme={selectedPropertyType === type ? 'blue' : 'gray'}
                    onClick={() => handlePropertyTypeChange(type)}
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
