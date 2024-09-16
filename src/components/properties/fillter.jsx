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
  properties = [] // List of properties passed as a prop
}) => {
  const [activeTab, setActiveTab] = useState('ALL TYPE');
  const [selectedPropertyType, setSelectedPropertyType] = useState('View All');
  const [selectedCity, setSelectedCity] = useState('Select a city');
  const [cityInput, setCityInput] = useState('');
  const [selectedRoomCount, setSelectedRoomCount] = useState(null);
  const [selectedBathroomsCount, setSelectedBathroomsCount] = useState(null);
  const inputRef = useRef(null);

  // Derive unique categories from properties
  const propertyTypes = [...new Set(properties.map(property => property.type.type))];
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab); // Notify parent component about the tab change
  };

  const handlePropertyTypeChange = (type) => {
    setSelectedPropertyType(type);
    onPropertyTypeChange(type); // Notify parent component about the property type change
  };

  const handleCitySearch = (event) => {
    setCityInput(event.target.value);
  };

  const filteredCities = citiesInMorocco.filter((city) =>
    city.toLowerCase().includes(cityInput.toLowerCase())
  );

  return (
    <Box>
      <Box as="main">
        <Box maxW="7xl" mx="auto" py={6} px={{ base: 4, sm: 6, lg: 8 }}>
          <Box borderRadius="lg" overflow="hidden" boxShadow="xl">
            <Box bg="white">
              <Flex borderBottom="1px" borderColor="gray.200" align="center" justify="center">
                {['ALL TYPE', 'FOR Vente' , 'FOR Location'].map((tab) => (
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

              {/* flex button search */}
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
                        {selectedRoomCount || "Nombre de chambre"}
                      </MenuButton>
                      <MenuList>
                        {["Tous chambre" , "1 chambre", "2 chambre", "3 chambre", "4 chambre", "Plus 5 chambre"].map((count) => (
                          <MenuItem key={count} icon={<FaBed />} onClick={() => setSelectedRoomCount(count)}>
                            {count}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </GridItem>
                  <GridItem>
                    <Menu>
                      <MenuButton as={Button} leftIcon={<FaBath />} rightIcon={<FaChevronDown />} w="100%" size="lg">
                        {selectedBathroomsCount || "Nombre de bathroom"}
                      </MenuButton>
                      <MenuList>
                        {["Tous bathroom" , "1 bathroom", "2 bathroom", "3 bathroom", "4 bathroom", "Plus 5 bathroom"].map((count) => (
                          <MenuItem key={count} icon={<FaBath />} onClick={() => setSelectedBathroomsCount(count)}>
                            {count}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </GridItem>
                </Grid>
                <Button p={4} w={{ base: "100%", md: "auto" }} bg="blue.600" _hover={{ bg: 'blue.700' }} color="white">
                  <SearchIcon mr={2} />
                  Search
                </Button>
              </Flex>
              {/* Dynamic filter type cards */}
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
