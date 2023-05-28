import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { addNewChannel, getLiveChannelsByTeamId } from '../../services/channels.service';
import { Box, Flex, IconButton, Tooltip, Input, useToast } from '@chakra-ui/react';
import './ChannelsSideBar.css';
import { getTeamById } from '../../services/teams.service';
// import { MdSettings, MdFace } from 'react-icons/md';
import { EditIcon, AddIcon } from '@chakra-ui/icons';
import { AuthContext } from '../../context/authContext';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_NAME_MIN_LENGTH } from '../../constants/constants';

const ChannelsSideBar = () => {
    const toast = useToast();
    const { teamId } = useParams();
    const [channels, setChannels] = useState(null);
    const [team, setTeam] = useState(null);
    const [addChannel, toggleAddChannel] = useState(false);
    const [channelName, setChannelName] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const unsub = getLiveChannelsByTeamId(teamId, (c) => setChannels([...c]));
        getTeamById(teamId)
            .then(snapshot => snapshot.val())
            .then(t => setTeam(t))
            .catch(e => console.log(e));
        return () => unsub();
    }, [teamId]);

    const onAddChannel = () => {
        toggleAddChannel(!addChannel);
    };

    const handleChange = (e) => {
        //prevents creation of channel with empty name after having input, deleting it and hitting Enter
        if (e.target.value.length > 0) {
            setChannelName(e.target.value);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            try {
                if (channelName && (channelName.length < CHANNEL_NAME_MIN_LENGTH || channelName.length > CHANNEL_NAME_MAX_LENGTH)) {
                    throw new Error('Channel name should be between 3 and 40 symbols!');
                }
                await addNewChannel(channelName, teamId);
                toggleAddChannel(!addChannel);
            } catch (error) {
                toast({
                    title: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-left'
                });
            }
        }
    };

    return (
        <>
            <Flex justifyContent="space-between" bg="accent" fontWeight="bold" fontSize="1.2rem" pl={2}>
                {team && team.name}
                {team && team.owner === user.uid && <Box>
                    <Tooltip label="edit team" placement="top">
                        <IconButton bg="accent" size="sm" _hover={{ bg: 'accent' }} icon={<EditIcon />}>
                        </IconButton>
                    </Tooltip>
                </Box>}
            </Flex>
            {channels && channels.map(channel => {
                return <Flex justifyContent="space-between" key={channel.channelId} className="channel" fontSize="1.1rem" pl={2}>{channel.channelName} </Flex>;
            })}
            <Box px={2}>
                <IconButton bg="accent" size="xs" _hover={{ bg: 'primaryLight', color: 'primaryDark' }} icon={<AddIcon onClick={onAddChannel} />} />
                {addChannel && <Input placeholder="Channel Name" onChange={handleChange} onKeyDown={handleKeyDown}></Input>}
            </Box>
        </>
    );
};

export default ChannelsSideBar;