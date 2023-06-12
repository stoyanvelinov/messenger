import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Link, useDisclosure, useToast } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Flex, Container, Box, Text } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { AuthContext } from '../../context/authContext';
import { getUserByHandle } from '../../services/users.service';
import { registerUser } from '../../services/auth.service';
import { createUser } from '../../services/users.service';
import { toast } from 'react-toastify';
import { storeImage } from '../../services/image.service';
import PhoneNumberInput from '../../components/PhoneNumberInput/PhoneNumberInput';
import { COUNTRIES } from '../../services/countries';
import { AttachmentIcon } from '@chakra-ui/icons';
import './Register.css';
import { validateForm } from '../../common/helperFuncs.js';
import { TOAST_DURATION } from '../../common/constants.js';
import TermsModal from './TermsModal';
import { updateInfo } from '../../services/infoBar.service';

const Register = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        username: '',
        avatar: {},
        imgUrl: ''
    });
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isFileAttached, setIsFileAttached] = useState(false);
    const customToast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isChecked, setIsChecked] = useState(false);

    const countryOptions = COUNTRIES.map(({ name, iso }) => ({
        label: name,
        value: iso
    }));
    const [phoneValue, setPhoneValue] = useState('');

    const updateForm = prop => e => {
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    };
    const updateImage = (e) => {
        setForm({
            ...form,
            avatar: e.target.files[0]
        });
        setIsFileAttached(e.target.files[0]);
    };

    const onRegister = async (e) => {
        e.preventDefault();

        try {
            if (!isChecked) {
                customToast({
                    title: 'Please accept the Terms & Conditions',
                    status: 'error',
                    duration: `${TOAST_DURATION}`,
                    isClosable: true,
                    position: 'top-left',
                });
                return;
            }

            const errors = validateForm(form);
            console.log(errors);
            if (Object.keys(errors).length > 0) {
                Object.values(errors).forEach((errorMessage) => {
                    customToast({
                        title: `${errorMessage}`,
                        status: 'error',
                        duration: `${TOAST_DURATION}`,
                        isClosable: true,
                        position: 'top-left',
                    });
                });
                return;
            }

            const imgUrl = await storeImage(form.avatar, form.username);

            const snapshot = await getUserByHandle(form.username);
            if (snapshot.exists()) {
                throw new Error(`Username @${form.username} has already been taken!`);
            }

            const credential = await registerUser(form.email, form.password);
            await createUser(form.username, credential.user.uid, credential.user.email, form.firstName, form.lastName, imgUrl, phoneValue);
            await updateInfo(form.username);

            setUser({
                user: credential.user,
            });
            console.log('redirecting..');
            toast.success('User Created');
            navigate('/');
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Box ml='3rem' mt='2rem' cursor='pointer' onClick={() => navigate('/')} >
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    ml='1rem'
                    _hover={{ bg: 'primaryLight' }}
                    maxW='5rem'
                >
                    Logo
                </Text>
            </Box>
            <Container maxW='2xl' mt='3rem' borderColor='primaryLight' border='1px' borderRadius='1rem'>
                <Flex w="100%" direction='column' p='1rem'>
                    <form onSubmit={onRegister}>
                        <FormControl display="flex" flexDirection="column" justify="center" alignItems="center" gap="10px">
                            <Box w="100%"><FormLabel htmlFor="first-name">First name</FormLabel>
                                <Input id="first-name" borderRadius="md" type="text" value={form.firstName} onChange={updateForm('firstName')} placeholder="First name" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel htmlFor='last-name'>Last name</FormLabel>
                                <Input id="last-name" borderRadius="md" type="text" value={form.lastName} onChange={updateForm('lastName')} placeholder="Last name" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel htmlFor='username' >Username</FormLabel>
                                <Input id="username" borderRadius="md" type="text" value={form.username} onChange={updateForm('username')} placeholder="Username" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel htmlFor="email">Email</FormLabel>
                                <Input id="email" borderRadius="md" type="email" value={form.email} onChange={updateForm('email')} placeholder="Email address" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel htmlFor="password">Password</FormLabel>
                                <Input id="password" borderRadius="md" type="password" value={form.password} onChange={updateForm('password')} placeholder="Password" autoComplete="off" required />
                            </Box>
                            <Box w="100%">
                                <FormControl mb="32px">
                                    <FormLabel>Phone Number: {phoneValue}</FormLabel>
                                    <PhoneNumberInput
                                        value={phoneValue}
                                        options={countryOptions}
                                        placeholder="Enter phone number"
                                        onChange={value => setPhoneValue(value)}
                                    />
                                </FormControl>
                            </Box>
                            <Box w="100%"><FormLabel>Avatar</FormLabel>
                                <Box border='1px' borderRadius='md' p='0.2rem' >
                                    <label htmlFor="avatar" id='avatarLabelRegister' >
                                        <AttachmentIcon boxSize={6} mr={2} cursor='pointer' />
                                        Attach Avatar
                                        <Input id="avatar" display="none" type="file" onChange={updateImage} autoComplete="off" accept=".jpg,.png,.jpeg" />
                                    </label>
                                    {isFileAttached && <Box >{isFileAttached.name}</Box>}
                                </Box>
                            </Box>
                            <Box display="flex" w='100%'>
                                <Checkbox isChecked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}
                                />
                                <Link pl='0.4rem' onClick={onOpen}>I agree with Terms &amp; Conditions</Link>
                            </Box>
                            <Button borderRadius="md" w="100%" type='submit' color='primaryDark' _hover={{ bg: 'primaryLight', color: '#fff' }} >Register</Button>
                        </FormControl>
                    </form>
                    <Text mt='0.2rem' opacity='0.5'>Already registered?
                        <Link btn-id="toLoginBtn" pl={2} onClick={() => { navigate('/login'); }} fontSize='1.3rem' color="blue.400">Login</Link>
                    </Text>
                </Flex>
            </Container>
            <TermsModal isOpen={isOpen} onClose={onClose} />
        </>
    );

};

export default Register;
