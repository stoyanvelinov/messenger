import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getLiveChannelsByTeamId } from '../../services/channels.service';
import { Box, Flex } from '@chakra-ui/react';
import { getLiveTeamInfo } from '../../services/teams.service';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_NAME_MIN_LENGTH } from '../../constants/constants';
import Channel from '../../components/Channel/Channel';
import { AuthContext } from '../../context/authContext';
import CreateNewChannel from '../../components/CreateNewChannel/CreateNewChannel';
import { Scrollbars } from 'react-custom-scrollbars-2';

const ChannelsSideBar = () => {
    const { user } = useContext(AuthContext);
    const { teamId } = useParams();
    const [channels, setChannels] = useState(null);
    const [team, setTeam] = useState(null);

    useEffect(() => {
        const unsub1 = getLiveChannelsByTeamId(teamId, (c) => setChannels([...c]));
        const unsub2 = getLiveTeamInfo(teamId, (teamObj) => setTeam(teamObj));
        return () => {
            unsub1();
            unsub2();
        };
    }, [teamId]);

    return (<><Flex justifyContent="space-between" alignItems="center" pos="sticky"
        bg="primaryLight" fontWeight="bold" px={2} mb="0.6rem">
        <Box fontSize="2.1em" h="3.5rem" flexGrow={1} isTruncated>
            {team && team.teamName}
        </Box>
        {team && team.teamOwner === user.uid && <CreateNewChannel />
        }
    </Flex >
        <Scrollbars style={{ width: '100%', height: '100%' }} autoHide>
            <Flex direction="column" px="0.5px" gap="0.8rem" overflowX="hidden"  >
                {channels && channels.map(channel => {
                    const id = channel.channelId;
                    const name = channel.channelName;
                    return <Channel key={id} channelId={id} channelName={name} team={team} />;
                })}
            </Flex>
        </Scrollbars>

    </>);
};
export default ChannelsSideBar;
