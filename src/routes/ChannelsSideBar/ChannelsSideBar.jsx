import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { addNewChannel, getLiveChannelsByTeamId } from '../../services/channels.service';
import { Box, Flex, Text, IconButton, Input, useToast } from '@chakra-ui/react';
import './ChannelsSideBar.css';
import { getLiveTeamInfo } from '../../services/teams.service';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_NAME_MIN_LENGTH } from '../../constants/constants';
import { AddIcon } from '@chakra-ui/icons';
import ChannelUpdate from '../../components/ChannelUpdate/ChannelUpdate';
import { useOutsideClick } from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';

const ChannelsSideBar = () => {
    const toast = useToast();
    const { teamId } = useParams();
    const [channels, setChannels] = useState(null);
    const [team, setTeam] = useState(null);
    const [addChannel, toggleAddChannel] = useState(false);
    const [channelName, setChannelName] = useState('');
    const navigate = useNavigate();
    const newChannelInput = useRef();
    const { user } = useContext(AuthContext);


    useEffect(() => {
        // console.log("channels use effect ran")
        const unsub1 = getLiveChannelsByTeamId(teamId, (c) => setChannels([...c]));
        const unsub2 = getLiveTeamInfo(teamId, (teamObj) => setTeam(teamObj));
        return () => {
            unsub1();
            unsub2();
        };
    }, [teamId]);


    const onAddChannel = () => {
        toggleAddChannel(!addChannel);
    };

    useOutsideClick({
        ref: newChannelInput,
        handler: () => toggleAddChannel(false),
    });

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

    const setActiveChannel = (id) => {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        document.querySelector(`#${id}`).classList.add('active');
    };

    const goToChannel = (e) => {
        const id = e.target.getAttribute('id');
        //to ensure the dots menu can be accessed without errors due to Chakra's implementation of the popover
        if (id && !id.includes('popover')) {
            setActiveChannel(id);
            navigate(`/teams/${teamId}/${id}`);
        }
    };

    return (
        <>
            <Flex justifyContent="space-between" bg="primaryLight" fontWeight="bold" p={1} fontSize="1.2rem" pl={2}>
                {team && team.teamName}
            </Flex >
            {channels && channels.map(channel => {
                const channelId = channel.channelId;
                return (<Flex
                    key={channelId}
                    className="channel"
                    id={channelId}
                    justifyContent="space-between"
                    alignItems="center"
                    fontSize="1.1rem"
                    pl={2}
                    cursor="pointer"
                    onClick={goToChannel}>
                    <Text>{channel.channelName}</Text>
                    {user.uid === team.teamOwner && < ChannelUpdate channelId={channel.channelId} />}
                </Flex>);
            })}
            <Box px={2}>
                <IconButton
                    bg="accent"
                    size="xs"
                    _hover={{ bg: 'primaryLight', color: 'primaryDark' }}
                    onClick={onAddChannel}
                    icon={<AddIcon />} />
                {addChannel && <Input placeholder="Channel Name" ref={newChannelInput} onChange={handleChange} onKeyDown={handleKeyDown}></Input>}
            </Box>
        </>
    );
};
export default ChannelsSideBar;
