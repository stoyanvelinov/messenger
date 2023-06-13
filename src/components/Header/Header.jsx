import { HamburgerIcon } from '@chakra-ui/icons';
import { Button, Text, Flex, Box, IconButton, useDisclosure } from '@chakra-ui/react';
import Profile from '../Profile/Profile';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getLiveUserNotification } from '../../services/notifications.service';
import { updateUserNotification } from '../../services/users.service';
import NewNotifications from '../Notifications/NewNotifications/NewNotifications';
import AllNotifications from '../Notifications/AllNotifications/AllNotifications';
import SmallScreenMenu from '../SmallScreenMenu/SmallScreenMenu';

const Header = () => {
    const [notifications, setNotifications] = useState([]);
    const { user, currentChatRoomId } = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();

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
        top="0"
        height="5rem"
        zIndex="1"
        alignItems="center"
        borderBottomWidth="1px"
        borderBottomColor="primaryLight"
        justifyContent={{ base: 'space-between' }}
        style={{ zIndex: '999' }}
        position='relative'
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
    </Flex >);
};

export default Header;
