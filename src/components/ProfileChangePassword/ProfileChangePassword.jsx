import { useState } from 'react';
import { Flex, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

const ProfileChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-left',
            });
            return;
        }

        try {
            const user = firebase.auth().currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
            await user.reauthenticateWithCredential(credential);

            await user.updatePassword(newPassword);

            toast({
                title: 'Password changed successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-left',
            });

            // Redirect the user to the desired location
            navigate('/profile');
        } catch (error) {
            toast({
                title: 'Error changing password',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-left',
            });
        }
    };

    return (
        <Flex mt='1rem' alignContent='center' justify='center' flexDirection='column'>
            <FormControl>
                <FormLabel fontSize='sm' opacity='0.5'>
                    Old Password
                </FormLabel>
                <Input
                    name='oldPassword'
                    id='oldPassword'
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <FormLabel fontSize='sm' mt='0.2rem' opacity='0.5'>
                    New Password
                </FormLabel>
                <Input
                    name='newPassword'
                    id='password'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <FormLabel fontSize='sm' mt='0.2rem' opacity='0.5'>
                    Confirm Password
                </FormLabel>
                <Input
                    name='confirmPassword'
                    id='confirmPassword'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </FormControl>
            <Button mt="1rem" colorScheme="teal" onClick={handleChangePassword}>
                Change Password
            </Button>
        </Flex>
    );
};

export default ProfileChangePassword;
