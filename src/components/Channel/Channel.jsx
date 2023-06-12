import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { Flex, Input, Text, IconButton, useToast } from '@chakra-ui/react';
import ChannelUpdate from '../ChannelUpdate/ChannelUpdate';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { updateChannel } from '../../services/channels.service';
import { CHANNEL_NAME_MIN_LENGTH, CHANNEL_NAME_MAX_LENGTH } from '../../common/constants.js';
import PropTypes from 'prop-types';
import './Channel.css';

const Channel = ({ channelId, channelName, team, channelChatRoom }) => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        channelName
    });
    const toast = useToast();

    const setActiveChannel = (id) => {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        document.querySelector(`#${id}`).classList.add('active');

    };

    const goToChannel = (e) => {
        const id = e.currentTarget.getAttribute('id');
        //to ensure the dots menu can be accessed without errors due to Chakra's implementation of the popover
        if (id && !id.includes('popover')) {
            setActiveChannel(id);
            navigate(`/teams/${team.teamId}/${id}/${channelChatRoom}`);
            setUser((prev) => ({
                ...prev,
                currentChatRoomId: channelChatRoom
            }));
        }
    };

    const handleChange = e => {
        setForm({ channelName: e.target.value });
    };

    const handleSave = async (e) => {
        try {
            e.preventDefault();
            if (form.channelName.length < CHANNEL_NAME_MIN_LENGTH || form.channelName.length > CHANNEL_NAME_MAX_LENGTH) {
                throw new Error(`Channel name should be between ${CHANNEL_NAME_MIN_LENGTH} and ${CHANNEL_NAME_MAX_LENGTH} symbols!`);
            }
            await updateChannel(channelId, form);
            setIsEditing(false);
        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setForm({
            channelName
        });
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSave}>
                <Flex className="channel-editing" px={2} gap="0.2rem">
                    <Input
                        className="channelNameInput"
                        flexGrow="1"
                        h="2.2em"
                        fontSize="1.4em"
                        type="text"
                        value={form.channelName}
                        onChange={handleChange}
                        autoComplete='off' />
                    <Flex justifyContent='center' alignItems="center" gap="2px">
                        <IconButton bg="accent" size="xs" _hover={{ bg: 'primary' }} type="submit" icon={<CheckIcon size="xs" />} />
                        <IconButton bg="primaryLight" size="xs" _hover={{ bg: 'primary' }} onClick={handleCancel} icon={<CloseIcon size="xs" />} />
                    </Flex>
                </Flex>
            </form >
        );
    }

    return (<Flex
        key={channelId}
        className="channel"
        id={channelId}
        cursor="pointer"
        onClick={goToChannel}
    >
        <Text pl={2} px={2} h="2.2em" lineHeight="2.2em" fontSize="1.4em" isTruncated>{form.channelName}</Text>
        {user.uid === team.teamOwner && < ChannelUpdate channelId={channelId} setIsEditing={setIsEditing} />}
    </Flex>);
};

Channel.propTypes = {
    channelId: PropTypes.string.isRequired,
    channelName: PropTypes.string.isRequired,
    team: PropTypes.shape({
        teamId: PropTypes.string.isRequired,
        teamOwner: PropTypes.string.isRequired,
    }).isRequired,
    channelChatRoom: PropTypes.string.isRequired
};

export default Channel;