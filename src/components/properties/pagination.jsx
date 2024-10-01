import React from 'react';
import { Button, Flex, Select, Text, Box } from '@chakra-ui/react';
import { GrNext, GrPrevious } from "react-icons/gr";

const Pagination = ({ totalPages, currentPage, onPageChange, rowsPerPage, totalRows, onRowsPerPageChange }) => {
    const getPageButtons = () => {
        const pages = [];
        const maxButtons = 3; // Maximum number of page buttons to display besides first and last

        // Helper function to add a range of pages
        const addRange = (start, end) => {
            for (let i = start; i <= end; i++) {
                if (i > 0 && i <= totalPages) {
                    pages.push(i);
                }
            }
        };

        // Always show the first page
        if (totalPages > 1) pages.push(1);

        // Calculate the range of pages to show around the current page
        const halfRange = Math.floor(maxButtons / 2);
        let startPage, endPage;

        if (totalPages <= maxButtons + 2) {
            // Show all pages if total pages are less than or equal to maxButtons
            startPage = 2;
            endPage = totalPages - 1;
        } else if (currentPage <= halfRange + 1) {
            // Current page is near the start
            startPage = 2;
            endPage = maxButtons;
        } else if (currentPage >= totalPages - halfRange) {
            // Current page is near the end
            startPage = totalPages - maxButtons + 1;
            endPage = totalPages - 1;
        } else {
            // Current page is in the middle
            startPage = currentPage - halfRange;
            endPage = currentPage + halfRange;
        }

        // Add ellipsis if current page is greater than 3
        if (currentPage > 3) {
            pages.push('...');
        }

        // Add the range of pages around the current page
        addRange(startPage, endPage);

        // Add ellipsis if there are pages between the last visible page and the last page
        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        // Always show the last page if there are more than 1 page
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pageButtons = getPageButtons();

    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(currentPage * rowsPerPage, totalRows);

    return (
        <Flex direction="column" align="center" mt={8}>
            <Flex justify="space-between" align="center" width="100%" mb={4}>
                <Flex align="center" width="auto">
                    <Text fontWeight="Bold" mr={2} fontSize={{ base: "sm", md: "lg", lg: "xl" }}>Cartes à chaque page :</Text>
                    <Select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        width="auto"
                        fontWeight="bold"
                        size={{ base: "sm", md: "md", lg: "md" }}// This sets the size of the Select component
                    >
                        <option value={12} style={{ fontWeight:'bold'  , fontSize: '15px' }}>12</option> 
                        <option value={24} style={{ fontWeight:'bold'  ,fontSize: '15px' }}>24</option>
                        <option value={36} style={{ fontWeight:'bold'  ,fontSize: '15px' }}>36</option>
                        <option value={72} style={{ fontWeight:'bold'  ,fontSize: '15px' }}>72</option>
                    </Select>
                </Flex>
                <Text fontWeight="Bold" fontSize={{ base: "sm", md: "md", lg: "lg" }}>
                    {startRow}-{endRow} of {totalRows}
                </Text>
            </Flex>
            <Box overflowX="auto" width="100%">
                <Flex justify="center" align="center" whiteSpace="nowrap">
                    {currentPage > 1 && (
                        <Button
                            onClick={() => onPageChange(currentPage - 1)}
                            variant="outline"
                            mr={2}
                            borderRadius="lg"
                            bg="blue.600"
                            color="white"
                            borderColor="white" // Set border color to white
                            _hover={{
                                bg: 'blue.600',
                                color: 'white',
                            }}
                            _active={{
                                bg: 'blue.600',
                                color: 'white',
                            }}
                            size={{ base: "xs", md: "md", lg: "lg" }} // Smaller size for mobile
                            p={{ base: 1, md: 2, lg: 3 }} // Smaller padding for mobile
                        >
                            <GrPrevious />
                        </Button>
                    )}
                    {pageButtons.map((page, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                if (page !== '...') onPageChange(page);
                            }}
                            variant={currentPage === page ? 'solid' : 'outline'}
                            mx={1}
                            borderRadius="lg"
                            bg={currentPage === page ? 'blue.600' : 'white'}
                            color={currentPage === page ? 'white' : 'black'}
                            borderColor="white" // Set border color to white
                            _hover={{
                                bg: 'blue.600',
                                color: 'white',
                            }}
                            isDisabled={page === '...'}
                            size={{ base: "xs", md: "md", lg: "lg" }} // Smaller size for mobile
                            p={{ base: 1, md: 2, lg: 3 }} // Smaller padding for mobile
                        >
                            {page}
                        </Button>
                    ))}
                    {currentPage < totalPages && (
                        <Button
                            onClick={() => onPageChange(currentPage + 1)}
                            variant="outline"
                            ml={2}
                            borderRadius="md"
                            bg="blue.600"
                            color="white"
                            borderColor="white" // Set border color to white
                            _hover={{
                                bg: 'blue.600',
                                color: 'white',
                            }}
                            _active={{
                                bg: 'blue.600',
                                color: 'white',
                            }}
                            size={{ base: "xs", md: "md", lg: "lg" }} // Smaller size for mobile
                            p={{ base: 1, md: 2, lg: 3 }} // Smaller padding for mobile
                        >
                            <GrNext />
                        </Button>
                    )}
                </Flex>
            </Box>
        </Flex>
    );
};

export default Pagination;
