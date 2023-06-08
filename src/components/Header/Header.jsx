import { HamburgerIcon } from '@chakra-ui/icons';
import { Text, Flex, MenuButton, MenuList, Menu, MenuItem, Box, IconButton } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import Profile from '../Profile/Profile';

const Header = () => {

    return (<Flex
        bg="primaryDark"
        as="header"
        px="4"
        top="0"
        height="5rem"
        zIndex="1"
        alignItems="center"
        borderBottomWidth="1px"
        borderBottomColor="primaryLight"
        justifyContent={{ base: 'space-between' }}
    >
        <Menu >
            <MenuButton
                bg="primaryMid"
                _hover={{ color: 'white', bg: 'primaryMid' }}
                border="none"
                as={Button}
                aria-label="Options"
                size="md"
                display={{ base: 'flex', md: 'none' }}
            ><HamburgerIcon />
            </MenuButton>
            <MenuList bg="primary" >
                <MenuItem bg="primary" _hover={{ color: 'white', bg: 'primaryMid' }}>My Teams </MenuItem>
                <MenuItem bg="primary" _hover={{ color: 'white', bg: 'primaryMid' }}>Something</MenuItem>
                <MenuItem bg="primary" _hover={{ color: 'white', bg: 'primaryMid' }}>Something</MenuItem>
            </MenuList>
        </Menu >
        <Box ml='auto'>
            <Profile />
        </Box>
        <Text
            display={{ base: 'flex', md: 'none' }}
            fontSize="2xl"
            fontWeight="bold"
            ml='1rem'
        >
            Logo
        </Text>
    </Flex>);
};

export default Header;
