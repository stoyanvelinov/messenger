import SearchUsers from '../SearchUsers/SearchUsers';
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, IconButton, Tooltip, useDisclosure, Box, Text, useToast } from '@chakra-ui/react';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { useState } from 'react';
import { getUserByUsername } from '../../services/users.service';
import { addMemberToTeam, getTeamChatRooms } from '../../services/teams.service';
import PropTypes from 'prop-types';
import { addChatRoomMember } from '../../services/chat.service';

const AddTeamMembersDialog = ({ teamId, memberIds }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [newMember, setNewMember] = useState(null);
    const toast = useToast();

    const addMember = (user) => {
        setNewMember(user);
    };

    const handleAdd = async () => {
        try {
            const memberSnapshot = await getUserByUsername(newMember);
            const memberData = await Object.values(memberSnapshot.val())[0];
            const memberUid = memberData.uid;
            if (memberIds.includes(memberUid)) {
                throw new Error('The user is already part of the team!');
            }
            await addMemberToTeam(memberUid, teamId);
            const teamChatRoomsSnapshot = await getTeamChatRooms(teamId);
            const teamChatRooms = Object.keys(teamChatRoomsSnapshot.val());
            // console.log('teamChatRooms',teamChatRooms);
            const addMembersPromises = teamChatRooms.map((chatRoomId)=>{
                addChatRoomMember(memberUid, chatRoomId,'channel', teamId );
            });
            await Promise.all(addMembersPromises);
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

    return (<>
        <IconButton icon={< HiOutlineUserAdd fontSize="1rem" />} size="sm" pr="0.3rem" bg="transparent" _hover={{ color: 'primaryDark', bg: 'transparent' }} onClick={onOpen} />
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            returnFocusOnClose={false}
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg="primaryMid">
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Add Members to Team
                    </AlertDialogHeader>
                    <AlertDialogBody display="flex" alignItems="center" px="3rem">
                        <SearchUsers addMember={addMember} width="100%" />
                        <Button bg='accent' h="1.9rem" _hover={{ bg: 'primaryLight' }} onClick={handleAdd} ml={3}>
                            Add
                        </Button>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button variant="outline" bg="primaryDark" _hover={{ bg: 'primaryMid' }} onClick={onClose}>
                            Close
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog >
    </>
    );
};

AddTeamMembersDialog.propTypes = {
    teamId: PropTypes.string.isRequired,
    memberIds: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default AddTeamMembersDialog;