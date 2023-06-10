import { HamburgerIcon } from '@chakra-ui/icons';
import { Text, Flex, MenuButton, MenuList, Menu, MenuItem, Box } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import Profile from '../Profile/Profile';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getLiveUserNotification } from '../../services/notifications.service';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const Header = () => {
    const [notifications, setNotifications] = useState([]);
    const { user, currentChatRoomId } = useContext(AuthContext);
    useEffect(() => {
        const un1 = getLiveUserNotification(user.uid, (c) => setNotifications([...c]));
        return () => un1();
    }, [user]);
    console.log(notifications,'notificationsHeader');

    return (<Flex
        bg="primaryDark"
        as="header"
        px="4"
        position="sticky"
        top="0"
        height="20"
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
        <Flex alignItems='center' ml='auto'>
            <Box>
        <NotificationDropdown notifications={notifications} />
            </Box>
        <Box ml='auto'>
            <Profile />
        </Box>
        </Flex>
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
