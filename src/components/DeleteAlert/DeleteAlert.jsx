import { AlertDialog, AlertDialogOverlay, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getTeamIdByChannelId, getTeamById } from '../../services/teams.service';
import PropTypes from 'prop-types';

const DeleteAlert = ({ isOpen, onClose, deleteFn, heading, id }) => {
    const navigate = useNavigate();
    const { teamId, channelId } = useParams();
    const toast = useToast();

    const handleDelete = async () => {
        try {
            //don't delete if there's only one channel in the team
            if (heading.includes('Channel')) {
                const tId = await getTeamIdByChannelId(channelId);
                const teamSnapshot = await getTeamById(tId);
                const team = teamSnapshot.val();
                const channelIds = Object.keys(team.channels);
                if (channelIds.length <= 1) throw new Error('You need at least one channel!');
            }
            await deleteFn(id);
            onClose();
            //navigation after deleting based on what is being deleted and from where
            if (heading.includes('Team') && id === teamId) navigate('/');
            if (channelId === id) navigate(`/teams/${teamId}`);
        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'center',
            });
        }
    };

    return (
        <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent bg="primaryMid">
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {heading}
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure? You can&apos;t undo this action afterwards.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button variant="outline" bg="primaryDark" _hover={{ bg: 'primaryMid' }} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button bg='darkRed' _hover={{ bg: 'red' }} onClick={handleDelete} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog >
    );
};

DeleteAlert.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deleteFn: PropTypes.func.isRequired,
    heading: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
};

export default DeleteAlert;