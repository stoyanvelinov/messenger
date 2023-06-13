import { useContext } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Box, Flex } from '@chakra-ui/react';
import { updateUserNotification } from '../../../services/users.service';
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router';
import { BellIcon } from '@chakra-ui/icons';

const NewNotifications = ({ unseenNotifications }) => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = async (uid, chatRoomId) => {
        try {
            await updateUserNotification(uid, chatRoomId);

            //check if chatRoom is in team and navigate correctly
            // navigate(`/messages/${chatRoomId}`);
            setUser((prev) => ({
                ...prev,
                currentChatRoomId: chatRoomId
            }));
        } catch (error) {
            console.log(error);
            // Handle error
        }
    };

    const formatTimeSince = (timestamp) => {
        const currentTime = Date.now();
        const receivedTime = parseInt(timestamp);
        const diffInSeconds = Math.floor((currentTime - receivedTime) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minutes ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hours ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} days ago`;
        }
    };

    return (
        <Menu>
            <MenuButton
                fontSize='1.2rem'
                color='yellow'
                as={BellIcon}
            />

            <MenuList bg="primary">
                {unseenNotifications.map((notification, i) => (
                    !notification.isSeen && (
                        <MenuItem
                            key={i}
                            bg="primary"
                            _hover={{ color: 'white', bg: 'primaryMid' }}
                            onClick={() => handleClick(user.uid, notification.chatRoomId)}
                        >
                            <Flex gap='1rem'>
                            <Box fontWeight='bold' > {notification.username} </Box >
                            <Box opacity='50%'>{formatTimeSince(notification.timeStamp)}</Box>
                            </Flex>
                            
                        </MenuItem>
                    )
                ))}
            </MenuList>
        </Menu>
    );
};

export default NewNotifications;
