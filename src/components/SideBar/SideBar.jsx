import { Box, Text, Flex } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getLiveTeams } from '../../services/teams.service';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';
import TeamButton from '../TeamButton/TeamButton';
import CreateTeam from '../CreateTeam/CreateTeam';

const SideBar = () => {
    const { user } = useContext(AuthContext);
    const [teamIds, setTeamIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = getLiveTeams(user.uid, (t) => setTeamIds([...t]));
        return () => unsub();
    }, [user.uid]);

    const onOpen = (e) => {
        const teamId = e.target.closest('span').getAttribute('data-team-id');
        navigate(`/teams/${teamId}`);
    };

    return (
        <Box
            bg="primaryDark"
            borderRight="1px"
            borderRightColor="primaryLight"
            display={{ base: 'none', md: 'block' }}
            w={{ md: '6rem' }}
            pos="fixed"
            h="full"
        // overflowY="scroll"
        // overflowX="hidden"
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
                <CreateTeam />
                {teamIds.length > 0 && teamIds.map(teamId => {
                    return <TeamButton key={teamId} onOpen={onOpen} teamId={teamId} uid={user.uid} />;
                })}
            </Flex>
        </Box >
    );
};

export default SideBar;