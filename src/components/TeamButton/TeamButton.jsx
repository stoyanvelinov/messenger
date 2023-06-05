import { Flex, Tooltip, Avatar, useDisclosure, IconButton } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { getLiveTeamInfo } from '../../services/teams.service';
import TeamUpdate from '../TeamUpdate/TeamUpdate';
import { ChevronRightIcon } from '@chakra-ui/icons';
import './TeamButton.css';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/authContext';
import { FiLoader } from 'react-icons/fi';

const TeamButton = ({ onOpen, teamId }) => {
    const [team, setTeam] = useState(null);
    const { user } = useContext(AuthContext);
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

    useEffect(() => {
        const unsub1 = getLiveTeamInfo(teamId, teamObj => setTeam(teamObj));
        return () => unsub1();
    }, [teamId]);

    if (team === null) return <FiLoader />;

    return (<Flex key={team.teamId} gap={1}>
        <span height="auto"><Tooltip label={team.teamName} placement="auto-start">
            <Avatar
                className="team-avatar"
                data-team-id={teamId}
                boxSize="4rem"
                name={team.teamName}
                src={team.teamAvatar}
                cursor="pointer"
                onClick={onOpen} />
        </Tooltip></span>
        {user.uid === team.teamOwner && (<>
            <IconButton
                className="team-btn"
                variant="default"
                size="xxs"
                alignSelf="flex-end"
                _hover={{ bg: 'transparent' }}
                onClick={onDrawerOpen}
                icon={<ChevronRightIcon color="primaryLight"
                    _hover={{ color: '#fff' }} />} />
            <TeamUpdate isDrawerOpen={isDrawerOpen} onDrawerClose={onDrawerClose} team={team} />
        </>)}
    </Flex>);
};

export default TeamButton;

TeamButton.propTypes = {
    onOpen: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
};