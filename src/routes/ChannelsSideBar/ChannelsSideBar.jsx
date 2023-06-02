import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { addNewChannel, getLiveChannelsByTeamId } from '../../services/channels.service';
import { Box, Flex, IconButton, Input, useToast, useOutsideClick } from '@chakra-ui/react';
import './ChannelsSideBar.css';
import { getLiveTeamInfo } from '../../services/teams.service';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_NAME_MIN_LENGTH } from '../../constants/constants';
import { AddIcon } from '@chakra-ui/icons';
import Channel from '../../components/Channel/Channel';

const ChannelsSideBar = () => {
    const toast = useToast();
    const { teamId } = useParams();
    const [channels, setChannels] = useState(null);
    const [team, setTeam] = useState(null);
    const [addChannel, setAddChannel] = useState(false);
    const [channelName, setChannelName] = useState('');
    const newChannelInput = useRef();

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
        setAddChannel(true);
    };

    useOutsideClick({
        ref: newChannelInput,
        handler: () => setAddChannel(false),
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
                    throw new Error(`Channel name should be between ${CHANNEL_NAME_MIN_LENGTH} and ${CHANNEL_NAME_MAX_LENGTH} symbols!`);
                }
                await addNewChannel(channelName, teamId);
                setAddChannel(false);
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
            <Flex justifyContent="space-between" bg="primaryLight" fontWeight="bold" p={1} fontSize="1.2rem" pl={2}>
                {team && team.teamName}
            </Flex >
            {channels && channels.map(channel => {
                const id = channel.channelId;
                const name = channel.channelName;
                return <Channel key={id} channelId={id} channelName={name} team={team} />;
            })}
            <Box px={2}>
                <IconButton
                    bg="accent"
                    size="xs"
                    _hover={{ bg: 'primaryLight', color: 'primaryDark' }}
                    onClick={onAddChannel}
                    icon={<AddIcon />} />
                {addChannel && <Input
                    placeholder="Channel Name"
                    ref={newChannelInput}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}>
                </Input>}
            </Box>
        </>
    );
};
export default ChannelsSideBar;
