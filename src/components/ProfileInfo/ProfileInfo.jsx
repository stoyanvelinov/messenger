import { Box, Button, Divider, Flex, Icon, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useToast } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import { AuthContext } from '../../context/authContext';
import { EditIcon } from '@chakra-ui/icons';
import ProfileEdit from '../ProfileEdit/ProfileEdit';
import { updateUserAvatarUrl, updateUserProfile, updateUserStatus } from '../../services/users.service';
import { STATUS } from '../../common/status';
import ProfileStatusIcon from './ProfileStatusIcon';
import ProfileChangePassword from '../ProfileChangePassword/ProfileChangePassword';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, TOAST_DURATION } from '../../common/constants';

const ProfileInfo = () => {
    const { user, userData, setUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const toast = useToast();
    const [avatarUrl, setAvatarUrl] = useState(userData.avatar);
    const [passForm, setPassForm] = useState({
        currentPass: null,
        newPass: null,
        confirmPass: null
    });
    const [form, setForm] = useState({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone
    });
    const handleSave = async () => {
        try {
            if (isChangingPassword) {
                // Perform reauthentication
                const reauthenticateUser = async (email, password) => {
                    try {
                        const credential = EmailAuthProvider.credential(email, password);
                        await reauthenticateWithCredential(user, credential);
                        return true; // Reauthentication successful
                    } catch (error) {
                        console.log(error);
                        return false; // Reauthentication failed
                    }
                };

                const isReauthenticated = await reauthenticateUser(userData.email, passForm.currentPass);
                if (isReauthenticated) {
                    // Check if the new password and confirm password match
                    const passwordsMatch = passForm.newPass === passForm.confirmPass;
                    if (!passwordsMatch) {
                        toast({
                            title: 'New password and confirm password do not match',
                            status: 'error',
                            duration: `${TOAST_DURATION}`,
                            isClosable: true,
                            position: 'top-left',
                        });
                        return;
                    }

                    // Check if the new password meets the length requirements
                    const passwordLength = passForm.newPass.length >= MIN_PASSWORD_LENGTH && passForm.newPass.length <= MAX_PASSWORD_LENGTH;
                    if (!passwordLength) {
                        toast({
                            title: 'Password should be between 8 and 20 characters',
                            status: 'error',
                            duration: `${TOAST_DURATION}`,
                            isClosable: true,
                            position: 'top-left',
                        });
                        return;
                    }

                    // Update the user password
                    await updatePassword(user, passForm.newPass);

                    toast({
                        title: 'Password changed',
                        status: 'success',
                        duration: `${TOAST_DURATION}`,
                        isClosable: true,
                        position: 'top-left',
                    });
                } else {
                    toast({
                        title: 'Incorrect current password',
                        status: 'error',
                        duration: `${TOAST_DURATION}`,
                        isClosable: true,
                        position: 'top-left',
                    });
                    return;
                }
            } else {
                // Perform profile update logic
                await updateUserProfile(userData.uid, form);
                setUser((prev) => ({
                    ...prev,
                    userData: { ...prev.userData, ...form },
                }));
                toast({
                    title: 'Profile updated',
                    status: 'success',
                    duration: `${TOAST_DURATION}`,
                    isClosable: true,
                    position: 'top-left',
                });
            }
        } catch (err) {
            console.log(err);
        }
    };


    const updateUserAvatar = async (userId, avatarUrl) => {
        await updateUserAvatarUrl(userId, avatarUrl);
        setUser((prev) => ({
            ...prev,
            userData: { ...prev.userData, avatar: avatarUrl },
        }));
    };

    useEffect(() => {
        console.log(avatarUrl, 'sss');
        updateUserAvatar(user.uid, avatarUrl);
    }, [avatarUrl]);




    let style;

    switch (userData.status) {
        case STATUS.ONLINE:
            style = 'green';
            break;
        case STATUS.DO_NOT_DISTURB:
            style = 'red';
            break;
        default:
            style = 'gray';
    }

    const handleStatusChange = async (status) => {
        await updateUserStatus(userData.uid, status);
        setUser((prev) => ({
            ...prev,
            userData: { ...prev.userData, status: status }
        }));
    };


    return (
        <Flex flexDirection='column' >
            <Flex alignContent='center' justify='center' position='relative'>
                <label htmlFor='avatar-img'>

                    <ProfileAvatar
                        name={`${userData.firstName} ${userData.lastName}`}
                        src={userData.avatar}
                        size='xl'
                        target={userData.username}
                        updateState={setAvatarUrl}
                    />
                    {/* <Input id='avatar-img' type='file' accept='.jpg,.png,.jpeg' display='none' onChange={(e) => handleUploadImg(e)} /> */}
                </label>
                <Popover placement='bottom-start' >
                    <PopoverTrigger>
                        <Icon viewBox='0 0 200 200' ml='-0.8rem' color={`${style}`} cursor='pointer'>
                            <path
                                fill='currentColor'
                                d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
                            />
                        </Icon>
                        {/* <ProfileStatusIcon color={`${style}`} cursor='pointer' /> */}
                    </PopoverTrigger>
                    <PopoverContent w='12rem' bg='primaryDark'>
                        <PopoverArrow bg='primaryDark' />
                        <PopoverBody w='100%'>
                            <Flex w='100%' flexDirection='column'>
                                <Button justifyContent='flex-start' size='sm' leftIcon={<ProfileStatusIcon color='green' ml='' />} mb='0.6rem' variant='outline' onClick={() => handleStatusChange(STATUS.ONLINE)}>
                                    Online
                                </Button>
                                <Button justifyContent='flex-start' size='sm' leftIcon={<ProfileStatusIcon color='red' ml='' />} variant='outline' onClick={() => handleStatusChange(STATUS.DO_NOT_DISTURB)}>
                                    Do not disturb
                                </Button>
                            </Flex>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Flex>
            <Flex mt='1rem' alignContent='center' justify='center' flexDirection='column' alignItems='center'>
                <Box>{`${userData.firstName} ${userData.lastName}`}</Box>
                <Box>{`${userData.email}`}</Box>

                <Flex w='100%' justifyContent='center' mt='0.5rem' >
                    {isEditing ? (
                        <>
                            <Button color='primaryDark' bg='primaryLight' pl='1.4rem' pr='1.4rem' size='sm' onClick={handleSave}>
                                {/* {isChangingPassword ? 'Change Password' : 'Save'} */}Save
                            </Button>
                            <Button variant='outline' ml='1rem' pl='1.4rem' pr='1.4rem' size='sm' onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Box>
                            <Button leftIcon={<EditIcon />} color='primaryDark' bg='primaryLight' size='sm' mr='1rem' onClick={() => { setIsChangingPassword(false); setIsEditing(true); }}>
                                Edit Profile
                            </Button>

                            <Button leftIcon={<EditIcon />} color='primaryDark' bg='primaryLight' size='sm' onClick={() => { setIsEditing(true); setIsChangingPassword(true); }}>
                                Password
                            </Button>
                        </Box>
                    )}
                </Flex>
            </Flex>
            <Divider mt='0.8rem' mb='0.8rem' />
            {isEditing ? (
                isChangingPassword ? (
                    <ProfileChangePassword setPassForm={setPassForm} />
                ) : (
                    <ProfileEdit form={form} setForm={setForm} />
                )
            ) : (
                <Box></Box>
            )}
        </Flex>
    );
};

export default ProfileInfo;

