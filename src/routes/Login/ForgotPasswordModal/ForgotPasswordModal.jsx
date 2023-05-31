import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { TOAST_DURATION } from '../../../components/common/constants';

const ForgotPasswordModal = ({ isModalOpen, onModalClose }) => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: 'Email is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        toast({
          title: 'Password reset email sent',
          status: 'success',
          duration: `${TOAST_DURATION}`,
          isClosable: true,
        });
        onModalClose();
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: `${TOAST_DURATION}`,
        isClosable: true,
      });
    }
  };


  return (
    <>
      <Modal isCentered isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='80%' backdropBlur='2px' />
        <ModalContent alignItems='center' bg='primaryLight'>
          <ModalHeader color='primaryDark'>Send reset password email.</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter your email"
              value={email}
              borderColor='primaryDark'
              onChange={(e) => setEmail(e.target.value)}
              mt="4"
            />
          </ModalBody>
          <ModalFooter>
            <Button bg='primaryDark' onClick={handleResetPassword} colorScheme="blue" mr={3}>
              Reset Password
            </Button>
            <Button bg='primaryLight' color='primaryDark' onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ForgotPasswordModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;
