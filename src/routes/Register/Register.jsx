import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
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
import { isEmpty } from 'lodash';
import PhoneNumberInput from '../../components/PhoneNumberInput/PhoneNumberInput';
import { COUNTRIES } from '../../services/countries';

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
    };

    const onRegister = async (e) => {
        e.preventDefault();
        try {
            const imgUrl = await storeImage(form.avatar, form.username);

            const snapshot = await getUserByHandle(form.username);
            if (snapshot.exists()) {
                throw new Error(`Username @${form.username} has already been taken!`);
            }

            const credential = await registerUser(form.email, form.password);
            await createUser(form.username, credential.user.uid, credential.user.email, form.firstName, form.lastName, imgUrl, phoneValue);

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
            <Container maxW='2xl'>
                <Flex w="100%" direction='column'>
                    <form onSubmit={onRegister}>
                        <FormControl display="flex" flexDirection="column" justify="center" alignItems="center" gap="10px">
                            <Box w="100%"><FormLabel>First name*</FormLabel>
                                <Input id="first-name" borderRadius="md" type="text" value={form.firstName} onChange={updateForm('firstName')} placeholder="First name" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel>Last name*</FormLabel>
                                <Input id="last-name" borderRadius="md" type="text" value={form.lastName} onChange={updateForm('lastName')} placeholder="Last name" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel>Username*</FormLabel>
                                <Input id="handle" borderRadius="md" type="text" value={form.username} onChange={updateForm('username')} placeholder="Username" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel>Email*</FormLabel>
                                <Input id="email" borderRadius="md" type="email" value={form.email} onChange={updateForm('email')} placeholder="Email address" autoComplete="off" required />
                            </Box>
                            <Box w="100%"><FormLabel>Password*</FormLabel>
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
                                <Input id="avatar" pt='4px' borderRadius="md" type="file" onChange={updateImage} autoComplete="off" accept='.jpg,.png,.jpeg' />
                            </Box>

                            <Button borderRadius="md" w="100%" type='submit' color='primaryDark' _hover={{ bg: 'primaryLight', color: '#fff' }} >Register</Button>
                        </FormControl>
                    </form>
                    <Text >Already registered? <Link btn-id="toLoginBtn" pl={2} onClick={() => { navigate('/login'); }}>Login</Link></Text>
                </Flex>
            </Container>

        </>
    );

};

export default Register;
