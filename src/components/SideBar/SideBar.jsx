import { Box, Text } from '@chakra-ui/react';

// const LinkItems = [
//     { label: 'Home', href: '/' },
//     { label: 'Profile', href: '/' },
// ];

const SideBar = () => {
    return (
        <Box
            bg="primaryDark"
            borderRight="1px"
            borderRightColor="primaryLight"
            display={{ base: 'none', md: 'block' }}
            w={{ md: 20 }}
            pos="fixed"
            h="full"
        >
            <Text
                display="flex"
                fontSize="2xl"
                fontWeight="bold"
                px="4"
            >
                Logo
            </Text>
            {/* {LinkItems.map((link, i) => (
                <NavLink key={i} link={link} />
            ))} */}
        </Box>
    );
};

export default SideBar;