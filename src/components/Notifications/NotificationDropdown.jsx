import React, { useContext } from 'react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { updateUserNotification } from '../../services/users.service';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router';

const NotificationDropdown = ({ notifications }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = async(uid, chatRoomId) => {
        try {
            await updateUserNotification(uid, chatRoomId);
            navigate(`/messages/${chatRoomId}`);
            // Handle success or any additional logic after the update
        } catch (error) {
            // Handle error if necessary
        }
    };

    return (
        <Menu>
            <MenuButton
                bg="primaryMid"
                _hover={{ color: 'white', bg: 'primaryMid' }}
                border="none"
                aria-label="Notifications"
                size="md"
            >
                Notifications
            </MenuButton>
            <MenuList bg="primary">
                {notifications.map(notification => (
                    !notification.isSeen && (
                        <MenuItem
                            key={notification.id}
                            bg="primary"
                            _hover={{ color: 'white', bg: 'primaryMid' }}
                            onClick={() => handleClick(user.uid, notification.chatRoomId)}
                        >
                            {notification.chatRoomId}
                        </MenuItem>
                    )
                ))}
            </MenuList>
        </Menu>
    );
};

export default NotificationDropdown;
