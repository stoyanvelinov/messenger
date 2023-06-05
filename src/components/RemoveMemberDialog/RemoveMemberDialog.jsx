import { AlertDialog, AlertDialogBody, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, Button, useToast } from '@chakra-ui/react';
import { removeMemberFromTeam } from '../../services/teams.service';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RemoveMemberDialog = ({ isOpen, onClose, uid, teamId, heading, message }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const handleRemove = async () => {
        try {
            await removeMemberFromTeam(uid, teamId);
            onClose();
            if (heading.includes('Leave')) navigate('/');
        } catch (e) {
            console.log(e.message);
            toast({
                title: 'There was a problem processing your request!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
        }
    };

    return (<AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
            <AlertDialogContent bg="primaryMid">
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {heading}
                </AlertDialogHeader>
                <AlertDialogBody>
                    {message}
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button variant="outline" bg="primaryDark" _hover={{ bg: 'primaryMid' }} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button bg='darkRed' _hover={{ bg: 'red' }} onClick={handleRemove} ml={3}>
                        {heading && heading.slice(0, heading.indexOf(' '))}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>);
};

RemoveMemberDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired,
    teamId: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default RemoveMemberDialog;