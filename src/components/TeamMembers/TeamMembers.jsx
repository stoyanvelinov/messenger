import { useContext, useEffect, useState } from 'react';
import { Flex, HStack, IconButton, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { getLiveTeamMemberIds, getTeamById } from '../../services/teams.service';
import TeamMember from '../TeamMember/TeamMember';
import { FiLoader, FiLogOut } from 'react-icons/fi';
import AddTeamMembersDialog from '../AddTeamMembersDialog/AddTeamMembersDialog';
import { AuthContext } from '../../context/authContext';
import PropTypes from 'prop-types';
import RemoveMemberDialog from '../RemoveMemberDialog/RemoveMemberDialog';
import { useParams } from 'react-router-dom';

const TeamMembers = () => {
    const [memberIds, setMemberIds] = useState(null);
    const [team, setTeam] = useState(null);
    const { user } = useContext(AuthContext);
    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { teamId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamSnapshot = await getTeamById(teamId);
                const t = await teamSnapshot.val();
                setTeam(t);
            } catch (e) {
                console.log(e.message);
                toast({
                    title: 'Something went wrong while fetching team members!',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-left'
                });
            }
        };
        fetchData();
    }, [teamId]);

    useEffect(() => {
        const unsubscribe = getLiveTeamMemberIds(teamId, mbs => setMemberIds(mbs));
        return () => unsubscribe();
    }, [team]);

    if (team === null) return <FiLoader />;

    return (<Flex direction="column" gap="1rem" w="100%">
        <HStack justifyContent="space-between" bg="primaryLight" fontWeight="bold" fontSize="1.6rem" px={2} py="0.2rem">
            <Text as="h2" >Members</Text>
            {user.uid === team.teamOwner ? <AddTeamMembersDialog teamId={teamId} memberIds={memberIds} /> :
                <IconButton icon={<FiLogOut fontSize="1rem" />} onClick={onOpen} bg="transparent" _hover={{ color: 'primaryDark', bg: 'transparent' }} />}
            <RemoveMemberDialog isOpen={isOpen} onClose={onClose} uid={user.uid} teamId={teamId}
                heading="Leave Team" message="Are you sure you want to leave the team?" />
        </HStack>
        <Flex direction="column" gap="0.5rem" >
            {memberIds && memberIds.map(uid => {
                return (<TeamMember key={uid} uid={uid} avatarSize="sm" team={team} />);
            }
            )}
        </Flex>
    </Flex>

    );
};

TeamMembers.propTypes = {
    teamId: PropTypes.string.isRequired,
};
export default TeamMembers;
