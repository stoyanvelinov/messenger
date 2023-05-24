import { Box, Flex } from '@chakra-ui/react';
import './MainContent.css';
import SearchUsers from '../SearchUsers/SearchUsers';

const MainContent = () => {
    return (
        <Flex className='main-content-box' h='100%' direction={{ base: 'column', md: 'row' }} bg='primaryMid'>  
            <Box bg='primary' display={{ base: 'none', lg: 'flex' }} minW='250px' flexBasis={{ md: '250px', lg: '15%' }}>
                <SearchUsers />
            </Box>
            <Box flexGrow={1} h={{ base: '100%' }} borderRight="1px"
                borderRightColor="primaryLight" borderLeft='1px' borderLeftColor='primaryLight'>Some other text</Box>
            <Box bg='primary' display={{ base: 'none', xl: 'flex' }} minW='250px' flexBasis={{ md: '250px', lg: '15%' }}>Some text</Box>
        </Flex>
    );
};

export default MainContent;
