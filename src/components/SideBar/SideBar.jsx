import { Box, Tooltip, Text, Flex, Divider, Image } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getLiveTeams } from '../../services/teams.service';
import './SideBar.css';
import messageIcon from '../../assets/icons/icon-msg.png';
import messageIconHover from '../../assets/icons/icon-msg-hover.png';
import { useNavigate } from 'react-router-dom';
import TeamButton from '../TeamButton/TeamButton';
import CreateTeam from '../CreateTeam/CreateTeam';

const SideBar = () => {
    const { user } = useContext(AuthContext);
    const [teamIds, setTeamIds] = useState([]);
    const [iconMsg, setIconMsg] = useState(messageIcon);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = getLiveTeams(user.uid, (t) => setTeamIds([...t]));
        return () => unsub();
    }, [user.uid]);

    const onOpen = (e) => {
        const teamId = e.target.closest('span').getAttribute('data-team-id');
        navigate(`/teams/${teamId}`);
    };

    const onOpenDirectMessages = () => {
        navigate('/messages/');
    };

    return (
        <Flex
            bg="primaryDark"
            borderRight="1px"
            borderRightColor="primaryLight"
            display={{ base: 'none', md: 'block' }}
            w={{ md: '7rem' }}
            overflowY="hidden"
            // overflowY="auto"
            overflowX="hidden"
        >
            <Text
                display="flex"
                fontSize="2xl"
                fontWeight="bold"
                p={4}
            >
                Logo
            </Text>
            <Flex direction="column" p={2} gap="1rem" >
                {/* <Box boxSize='sm'>
                    <Image src={messageIcon}  boxSize='50px' alt='message icon' />
                </Box> */}
                <span>
                    <Tooltip label='Direct Messages' openDelay={300} placement="right">
                        <Image src={iconMsg}
                            boxSize='5em'
                            onMouseEnter={() => setIconMsg(messageIconHover)}
                            onMouseOut={() => setIconMsg(messageIcon)}
                            onClick={onOpenDirectMessages}
                            alt='message icon' />
                    </Tooltip>
                </span>
                <span>
                    <Divider />
                </span>
                <CreateTeam />
            </Flex>
            <Flex id="teams" p={2} direction="column" gap="1rem" overflowY="auto" overflowX="hidden">
                {teamIds.length > 0 && teamIds.map(teamId => {
                    return <TeamButton key={teamId} onOpen={onOpen} teamId={teamId} uid={user.uid} />;
                })}
            </Flex>
        </ Flex>
    );
};

export default SideBar;