import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import { Flex, Input, Text, IconButton, useToast, useMediaQuery, useDisclosure } from '@chakra-ui/react';
import ChannelUpdate from '../ChannelUpdate/ChannelUpdate';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { updateChannel } from '../../services/channels.service';
import { CHANNEL_NAME_MIN_LENGTH, CHANNEL_NAME_MAX_LENGTH } from '../../common/constants.js';
import PropTypes from 'prop-types';
import './Channel.css';
import DeleteAlert from '../DeleteAlert/DeleteAlert';
import { deleteChannel } from '../../services/channels.service';
import { HiDotsVertical } from 'react-icons/hi';

const Channel = ({ chnlId, channelName, team, channelChatRoom }) => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        channelName
    });
    const toast = useToast();
    const { channelId } = useParams();
    const [isSmallerThan991] = useMediaQuery('(max-width: 991px)');
    const { isOpen: isDialogOpen, onClose: onDialogClose, onOpen: onDialogOpen } = useDisclosure();

    useEffect(() => {
        if (chnlId === channelId) document.querySelectorAll(`.${chnlId}`).forEach(chan => chan.classList.add('active'));
    }, [channelId, isEditing]);

    const clearActiveChannel = () => {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
    };

    const goToChannel = (e) => {
        const id = e.currentTarget.getAttribute('data-channel-id');
        if (chnlId !== channelId) clearActiveChannel();
        navigate(`/teams/${team.teamId}/${id}/${channelChatRoom}`);
        setUser((prev) => ({
            ...prev,
            currentChatRoomId: channelChatRoom
        }));
    };

    //click on dots menu on smaller screen
    const handleClickInDrawer = (e) => {
        e.stopPropagation();
        setIsEditing(true);
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
    };

    const switchChannelUpdateOption = () => {
        if (!isSmallerThan991) return < ChannelUpdate channelId={chnlId} setIsEditing={setIsEditing} />;
        else return <IconButton icon={<HiDotsVertical />} bg="transparent" _hover={{ bg: 'transparent' }} cursor="pointer" onClick={handleClickInDrawer} />;
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
                    <Flex flexDirection={{ base: 'column', lg: 'row' }} justifyContent='center' alignItems="center" gap="2px">
                        <IconButton bg="accent" size="xs" _hover={{ bg: 'primary' }} type="submit" icon={<CheckIcon size="xs" />} />
                        <IconButton bg="primaryLight" size="xs" _hover={{ bg: 'primary' }} onClick={handleCancel} icon={<CloseIcon size="xs" />} />
                    </Flex>
                    {isSmallerThan991 && <><DeleteIcon ml="1.5px" mr="3px" onClick={onDialogOpen} />
                        <DeleteAlert isOpen={isDialogOpen} onClose={onDialogClose} deleteFn={deleteChannel} heading="Delete Channel" id={chnlId} /></>}
                </Flex>
            </form >
        );
    }

    return (<Flex
        key={chnlId}
        className={`channel ${chnlId}`}
        data-channel-id={chnlId}
        cursor="pointer"
        onClick={goToChannel}>
        <Text pl={2} px={2} h="2.2em" lineHeight="2.2em" fontSize="1.4em" isTruncated>{form.channelName}</Text>
        {user.uid === team.teamOwner && switchChannelUpdateOption()}
    </Flex>);
};

Channel.propTypes = {
    chnlId: PropTypes.string.isRequired,
    channelName: PropTypes.string.isRequired,
    team: PropTypes.shape({
        teamId: PropTypes.string.isRequired,
        teamOwner: PropTypes.string.isRequired,
    }).isRequired,
    channelChatRoom: PropTypes.string.isRequired
};

export default Channel;