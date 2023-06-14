// import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuButton, MenuList, MenuItem, Box, Flex } from '@chakra-ui/react';
// import { AuthContext } from '../../../context/authContext';
// import { useNavigate } from 'react-router';
import {  ChevronDownIcon } from '@chakra-ui/icons';

const AllNotifications = ({ notifications }) => {
    // const { user, setUser } = useContext(AuthContext);
    // const navigate = useNavigate();
    // const handleClick = async (uid, chatRoomId) => {
    //     try {
    //         navigate(`/messages/${chatRoomId}`);
    //         setUser((prev) => ({
    //             ...prev,
    //             currentChatRoomId: chatRoomId
    //         }));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <Menu>
            <MenuButton
                fontSize='1.2rem'
                color='primaryLight'
                as={ChevronDownIcon}
            />
            <MenuList bg="primary" >
                <Flex 
                    borderBottom='1px'
                    opacity={0.5}
                    p='0.3rem'
                    justifyContent='center'
                >
                    <Box cursor='default' >recent chats</Box>
                </Flex>
                {notifications.map((notification, i) => (
                    <MenuItem
                        key={i}
                        bg="primary"
                        cursor='default'
                    >
                        <Box>
                        {notification.username} {new Date(parseInt(notification.timeStamp)).toLocaleDateString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}h
                        </Box>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

AllNotifications.propTypes = {
    notifications: PropTypes.array.isRequired,
};
export default AllNotifications;
