import { useContext, useEffect, useState } from 'react';
import { Flex, IconButton, useDisclosure, useToast, Box } from '@chakra-ui/react';
import { getLiveTeamMemberIds, getTeamById } from '../../services/teams.service';
import TeamMember from '../TeamMember/TeamMember';
import { FiLoader, FiLogOut } from 'react-icons/fi';
import AddTeamMembersDialog from '../AddTeamMembersDialog/AddTeamMembersDialog';
import { AuthContext } from '../../context/authContext';
import RemoveMemberDialog from '../RemoveMemberDialog/RemoveMemberDialog';
import { useParams } from 'react-router-dom';
import Scrollbars from 'react-custom-scrollbars-2';

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

    if (team === null || memberIds === null) return <FiLoader />;

    return (
        <>
            <Flex justifyContent="space-between" alignItems="center" bg="primaryLight" pos="sticky" px={2} mb="0.6rem" py="0.2rem">
                <Box as="h2" fontSize="1.6em" h="1.6em">Members</Box>
                {user.uid === team.teamOwner ? <AddTeamMembersDialog teamId={teamId} memberIds={memberIds} /> :
                    <IconButton icon={<FiLogOut fontSize="1rem" />} onClick={onOpen} bg="transparent" _hover={{ color: 'primaryDark', bg: 'transparent' }} />}
                <RemoveMemberDialog isOpen={isOpen} onClose={onClose} uid={user.uid} teamId={teamId}
                    heading="Leave Team" message="Are you sure you want to leave the team?" />
            </Flex>
            <Scrollbars style={{ height: '100%', width: '100%' }} autoHide>
                <Flex direction="column" gap="0.5rem" overflowX="hidden" overflowY="auto">
                    {memberIds && memberIds.map(uid => {
                        return (<TeamMember key={uid} uid={uid} avatarSize="sm" team={team} />);
                    }
                    )}
                </Flex>
            </Scrollbars>
        </>
    );
};

export default TeamMembers;
