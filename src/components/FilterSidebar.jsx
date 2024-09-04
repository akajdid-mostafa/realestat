// components/FilterSidebar.js
import { Box, Checkbox, Stack, Text, Input, Select } from '@chakra-ui/react';

const FilterSidebar = () => {
    return (
        <Box bg="gray.100" p={4} borderRadius="md" boxShadow="md">
            <Stack spacing={4}>
                <Text fontSize="xl" mb={4}>Filters</Text>
                
                <Stack spacing={2}>
                    <Text fontWeight="bold">Location</Text>
                    <Input placeholder="Enter location" />
                </Stack>
                
                <Stack spacing={2}>
                    <Text fontWeight="bold">Categories</Text>
                    <Select placeholder="Select category">
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Condo</option>
                        <option>Villa</option>
                    </Select>
                </Stack>
                
                <Stack spacing={2}>
                    <Text fontWeight="bold">Price Range</Text>
                    <Select placeholder="Select price range">
                        <option>$0 - $500,000</option>
                        <option>$500,000 - $1,000,000</option>
                        <option>$1,000,000+</option>
                    </Select>
                </Stack>
                
                <Stack spacing={2}>
                    <Text fontWeight="bold">Bedrooms</Text>
                    <Checkbox>1 Bedroom</Checkbox>
                    <Checkbox>2 Bedrooms</Checkbox>
                    <Checkbox>3 Bedrooms+</Checkbox>
                </Stack>
                
                <Stack spacing={2}>
                    <Text fontWeight="bold">Bathrooms</Text>
                    <Checkbox>1 Bathroom</Checkbox>
                    <Checkbox>2 Bathrooms</Checkbox>
                    <Checkbox>3 Bathrooms+</Checkbox>
                </Stack>
            </Stack>
        </Box>
    );
};

export default FilterSidebar;
