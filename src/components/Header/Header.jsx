import { HamburgerIcon } from '@chakra-ui/icons';
import { Text, Flex, MenuButton, MenuList, Menu, MenuItem, Box } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import Profile from '../Profile/Profile';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getLiveUserNotification } from '../../services/notifications.service';
import NotificationDropdown from '../Notifications/NewNotifications/NewNotifications';
import { updateUserNotification } from '../../services/users.service';
import NewNotifications from '../Notifications/NewNotifications/NewNotifications';
import AllNotifications from '../Notifications/AllNotifications/AllNotifications';

const Header = () => {
    const [notifications, setNotifications] = useState([]);
    const { user, currentChatRoomId } = useContext(AuthContext);
    useEffect(() => {
        const un1 = getLiveUserNotification(user.uid, (c) => setNotifications([...c]));
        return () => un1();
    }, [user.uid]);
    useEffect(() => {
        const updateUserNotificationAsync = async () => {
            if (currentChatRoomId === notifications.chatRoomId) {
                await updateUserNotification(user.uid, currentChatRoomId);
            }
        };

        updateUserNotificationAsync();
    }, [currentChatRoomId, notifications, user.uid]);
    const unseenNotifications = notifications.filter((c) => !c.isSeen && c.chatRoomId !== currentChatRoomId);

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
            <Flex flexDirection='column'>
                {unseenNotifications.length > 0 && (
                    < NewNotifications unseenNotifications={unseenNotifications} />
                )}
                {notifications.length > 0 && (
                    < AllNotifications notifications={notifications} />
                )}
            </Flex>
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
