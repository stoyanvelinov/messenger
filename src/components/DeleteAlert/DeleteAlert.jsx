import { AlertDialog, AlertDialogOverlay, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const DeleteAlert = ({ isOpen, onClose, deleteFn, heading, id }) => {
    const navigate = useNavigate();
    const { teamId } = useParams();
    const toast = useToast();

    const handleDeleteTeam = async () => {

        try {
            onClose();
            await deleteFn(id);
            if (heading.includes('Team') && id === teamId) navigate('/');

        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-center'
            });

        }
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
        >
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
                        <Button bg='darkRed' _hover={{ bg: 'red' }} onClick={handleDeleteTeam} ml={3}>
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