import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuButton, MenuList, MenuItem, Box, Flex } from '@chakra-ui/react';
import { updateUserNotification } from '../../../services/users.service';
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router';
import { BellIcon } from '@chakra-ui/icons';
import { formatTimeSince } from '../../../common/helperFuncs';

const NewNotifications = ({ unseenNotifications }) => {
    const { user, setUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = async (uid, chatRoomId, chanelId, teamId) => {
        try {
            await updateUserNotification(uid, chatRoomId);
            if (chanelId && teamId) {
                navigate(`teams/${teamId}/${chanelId}/${chatRoomId}`);
                setUser((prev) => ({
                    ...prev,
                    currentChatRoomId: chatRoomId,
                    currentTeamId: teamId,
                    currentChannelId: chanelId
                }));
            } else {
                navigate(`/messages/${chatRoomId}`);
                setUser((prev) => ({
                    ...prev,
                    currentChatRoomId: chatRoomId,
                    currentTeamId: null,
                    currentChannelId: null
                }));
            }
            //check if chatRoom is in team and navigate correctly
        } catch (error) {
            console.log(error);
            // Handle error
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
                            onClick={() => handleClick(user.uid, notification.chatRoomId, notification.channelId, notification.teamId)}
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

NewNotifications.propTypes = {
    unseenNotifications: PropTypes.array.isRequired,
};
export default NewNotifications;
