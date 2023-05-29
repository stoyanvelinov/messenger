import { Box, Button, Divider, Flex, Icon, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import { AuthContext } from '../../context/authContext';
import { EditIcon } from '@chakra-ui/icons';
import ProfileEdit from '../ProfileEdit/ProfileEdit';
import { updateUserProfile, updateUserStatus } from '../../services/users.service';
import { storeImage } from '../../services/image.service';
import { STATUS } from '../common/status';
import ProfileStatusIcon from './ProfileStatusIcon';

const ProfileInfo = () => {
    const { userData, setUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const toast = useToast();
    const [form, setForm] = useState({
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone
    });
    const handleSave = async () => {
        try {
            await updateUserProfile(userData.uid, form);
            setUser((prev) => ({
                ...prev,
                userData: { ...prev.userData, ...form }
            }));
            toast({
                title: 'Profile updated',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-left'
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleUploadImg = async (e) => {
        const img = await storeImage(e.target.files[0], userData.username);
        console.log(img);
        setUser((prev) => ({
            ...prev,
            userData: { ...prev.userData, avatar: img }
        }));
    };

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
                        status={userData.status}
                        src={userData.avatar}
                        size='xl'
                    />
                    <Input id='avatar-img' type='file' accept='.jpg,.png,.jpeg' display='none' onChange={(e) => handleUploadImg(e)} />
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
                        <PopoverArrow bg='primaryDark'  />
                            <PopoverBody w='100%'>
                                <Flex w='100%' flexDirection='column'>
                                <Button justifyContent='flex-start' size='sm' leftIcon={<ProfileStatusIcon color='green' ml='' />} mb='0.6rem' variant='outline'  onClick={() => handleStatusChange(STATUS.ONLINE)}>
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
                    {isEditing ?
                        <>
                            <Button color='primaryDark' bg='primaryLight' pl='1.4rem' pr='1.4rem' size='sm' onClick={handleSave}>Save</Button>
                            <Button variant='outline' ml='1rem' pl='1.4rem' pr='1.4rem' size='sm' onClick={() => setIsEditing(false)}>Cancel</Button>
                        </>
                        :
                        <Button leftIcon={<EditIcon />} color='primaryDark' bg='primaryLight' size='sm' onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </Button>
                    }
                </Flex>
            </Flex>
            <Divider mt='0.8rem' mb='0.8rem' />
            {isEditing ? <ProfileEdit form={form} setForm={setForm} /> : <Box></Box>}
        </Flex>
    );
};

export default ProfileInfo;
