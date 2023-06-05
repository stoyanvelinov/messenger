import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, Text, Link, Flex, Container } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { loginUser } from '../../services/auth.service';
import { AuthContext } from '../../context/authContext';
import ForgotPasswordModal from './ForgotPasswordModal/ForgotPasswordModal';
import { useDisclosure } from '@chakra-ui/react';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();


    const updateForm = prop => e => {
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    };

    const onLogin = () => {
        if (!form.email) {
            return alert('Please enter email!');
        }
        if (!form.password) {
            return alert('Please enter password!');
        }

        loginUser(form.email, form.password)
            .then(credential => {
                setUser({
                    user: credential.user,
                });
            })
            .then(() => {
                navigate('/messages');
            })
            .catch(e => setError(e));
    };

    return (
        <>
            <Box ml='3rem' mt='2rem' cursor='pointer'  onClick={()=>navigate('/')} >
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
            <Container maxW='2xl' mt='3rem' borderColor='primaryLight' border='1px' borderRadius='1rem' >
                <Flex w="100%" direction='column' p='1rem'>
                    <FormControl display="flex" flexDirection="column" justify="center" alignItems="center" gap="10px">
                        <Box w="100%"><FormLabel>Email</FormLabel>
                            <Input id="email" borderRadius="2xl" type="email" value={form.email} onChange={updateForm('email')} placeholder="Email address" autoComplete="off" required />

                        </Box>
                        <Box w="100%"><FormLabel>Password</FormLabel>
                            <Input id="password" borderRadius="2xl" type="password" value={form.password} onChange={updateForm('password')} placeholder="Password" autoComplete="off" required />
                            {error && <Text color="red">{error.message}</Text>}
                        </Box>
                        <Button color='primaryDark' _hover={{ bg: 'primaryLight', color: '#fff' }} borderRadius="2xl" w="100%" onClick={onLogin}>Log in</Button>
                    </FormControl>
                    <Box>
                        <Flex justifyContent='space-around' mt='0.2rem' opacity='0.5'>
                            <Text >Not a member yet? <Link btn-id="toRegisterBtn" pl={2} onClick={() => { navigate('/register'); }} fontSize='1.3rem' color="blue.400" >Sign up</Link></Text>
                            <Link btn-id='forgotPassBtn' onClick={onModalOpen}>Forgot your password?</Link>
                        </Flex>
                    </Box>
                </Flex>
            </Container>
            <ForgotPasswordModal isModalOpen={isModalOpen} onModalClose={onModalClose} />
        </>
    );
};

export default Login;
