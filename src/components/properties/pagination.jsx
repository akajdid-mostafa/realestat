import React from 'react';
import { Button, Flex, Select, Text } from '@chakra-ui/react';

const Pagination = ({ totalPages, currentPage, onPageChange, rowsPerPage, totalRows, onRowsPerPageChange }) => {
    const getPageButtons = () => {
        const pages = [];
        const maxButtons = 5; // Maximum number of page buttons to display besides first and last

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
                <Flex align="center">
                    <Text mr={2}>Rows per page:</Text>
                    <Select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        width="auto"
                    >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={36}>36</option>
                        <option value={72}>72</option>
                    </Select>
                </Flex>
                <Text>
                    {startRow}-{endRow} of {totalRows}
                </Text>
            </Flex>
            <Flex justify="center" align="center">
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    variant="outline"
                    mr={2}
                    borderRadius="lg"
                    bg={currentPage === 1 ? 'white' : 'blue.600'}
                    color={currentPage === 1 ? 'black' : 'white'}
                    borderColor="white" // Set border color to white
                    _hover={{
                        bg: 'blue.600',
                        color: 'white',
                    }}
                    _active={{
                        bg: 'blue.600',
                        color: 'white',
                    }}
                >
                    Previous
                </Button>
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
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    variant="outline"
                    ml={2}
                    borderRadius="md"
                    bg={currentPage === totalPages ? 'white' : 'blue.600'}
                    color={currentPage === totalPages ? 'black' : 'white'}
                    borderColor="white" // Set border color to white
                    _hover={{
                        bg: 'blue.600',
                        color: 'white',
                    }}
                    _active={{
                        bg: 'blue.600',
                        color: 'white',
                    }}
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    );
};

export default Pagination;
