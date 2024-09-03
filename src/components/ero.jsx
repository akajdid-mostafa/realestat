import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons'; // Import icons as needed

const FilterMapSection = () => {
    return (
        <section className="flat-map">
            <div
                id="map"
                className="page_speed_228885609"
                data-url="https://homzen.botble.com/ajax/properties/map"
                data-tile-layer="https://mt0.google.com/vt/lyrs=m&amp;x={x}&amp;y={y}&amp;z={z}&amp;hl=en"
                data-center="[43.615134,-76.393186]"
            ></div>
            <div className="search-box-offcanvas container">
                <div className="search-box-offcanvas-backdrop"></div>
                <div className="search-box-offcanvas-content">
                    <div className="search-box-offcanvas-header">
                        <Text fontSize="lg">Filter</Text>
                        <Button className="btn-close" onClick={() => {/* Add toggle logic */}}>
                            Close
                        </Button>
                    </div>
                    <div className="wrap-filter-search">
                        <div className="flat-tab flat-tab-form">
                            <div className="form-sl">
                                <Stack spacing={4}>
                                    <FormControl>
                                        <FormLabel>Keyword</FormLabel>
                                        <Input type="text" placeholder="Search for Keyword" name="k" />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Location</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Search for Location"
                                            name="location"
                                            data-url="https://homzen.botble.com/ajax/cities"
                                        />
                                        <Icon viewBox="0 0 24 24" /* Add SVG path here */ />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="category_id">Category</FormLabel>
                                        <Select name="category_id" id="category_id">
                                            <option value="">All</option>
                                            <option value="1">Apartment</option>
                                            <option value="2">Villa</option>
                                            <option value="3">Condo</option>
                                            <option value="4">House</option>
                                            <option value="5">Land</option>
                                            <option value="6">Commercial property</option>
                                        </Select>
                                    </FormControl>
                                    <Button type="submit" colorScheme="teal">
                                        Search
                                    </Button>
                                </Stack>

                                <VStack spacing={4} align="stretch">
                                    <Text>Price Range</Text>
                                    {/* Add your price slider component here */}
                                    <Text>Square Range</Text>
                                    {/* Add your square range slider component here */}
                                </VStack>

                                <VStack spacing={4} align="stretch">
                                    <FormControl>
                                        <FormLabel htmlFor="bathroom">Bathrooms</FormLabel>
                                        <Select name="bathroom" id="bathroom">
                                            <option value="">All</option>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} Bathroom{num > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="bedroom">Bedrooms</FormLabel>
                                        <Select name="bedroom" id="bedroom">
                                            <option value="">All</option>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} Bedroom{num > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="floor">Floors</FormLabel>
                                        <Select name="floor" id="floor">
                                            <option value="">All</option>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} Floor{num > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="select-type">Type</FormLabel>
                                        <Select name="type" id="select-type">
                                            <option value="">-- Select --</option>
                                            <option value="sale">Sale</option>
                                            <option value="rent">Rent</option>
                                        </Select>
                                    </FormControl>
                                </VStack>

                                <VStack spacing={4} align="stretch">
                                    <Text>Amenities:</Text>
                                    <VStack align="start">
                                        {[
                                            'Wifi',
                                            'Parking',
                                            'Swimming pool',
                                            'Balcony',
                                            'Garden',
                                            'Security',
                                            'Fitness center',
                                            'Air Conditioning',
                                            'Central Heating',
                                            'Laundry Room',
                                            'Pets Allow',
                                            'Spa & Massage',
                                        ].map((amenity, index) => (
                                            <Checkbox key={index} value={index + 1}>
                                                {amenity}
                                            </Checkbox>
                                        ))}
                                    </VStack>
                                </VStack>

                                <Button type="submit" colorScheme="teal">
                                    Find Properties
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FilterMapSection;