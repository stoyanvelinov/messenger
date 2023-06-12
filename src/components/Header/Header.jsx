import { HamburgerIcon } from '@chakra-ui/icons';
import { Text, Flex, Box, IconButton, useDisclosure } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import Profile from '../Profile/Profile';
import SmallScreenMenu from '../SmallScreenMenu/SmallScreenMenu';

const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

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
        <IconButton
            icon={<HamburgerIcon />}
            bg="primaryMid"
            _hover={{ color: 'white', bg: 'primaryMid' }}
            border="none"
            as={Button}
            aria-label="Options"
            size="md"
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
        />
        <SmallScreenMenu isOpen={isOpen} onClose={onClose} />
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
