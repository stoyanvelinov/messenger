import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, Text, Link, Flex, Container } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { loginUser } from '../../services/auth.service';
import { AuthContext } from '../../context/authContext';


const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
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
                navigate('/');
            })
            .catch(e => setError(e));
    };

    return (<>
        <Container maxW='2xl'>
            <Flex w="100%" direction='column'>
                {/* <form onSubmit={onRegister}> */}
                <FormControl display="flex" flexDirection="column" justify="center" alignItems="center" gap="10px">
                    <Box w="100%"><FormLabel>Email*</FormLabel>
                        <Input id="email" borderRadius="2xl" type="email" value={form.email} onChange={updateForm('email')} placeholder="Email address" autoComplete="off" required />

                    </Box>
                    <Box w="100%"><FormLabel>Password*</FormLabel>
                        <Input id="password" borderRadius="2xl" type="password" value={form.password} onChange={updateForm('password')} placeholder="Password" autoComplete="off" required />
                        {error && <Text color="red">{error.message}</Text>}
                    </Box>
                    <Button color='primaryDark' _hover={{ bg: 'primaryLight', color: '#fff' }} borderRadius="2xl" w="100%" onClick={onLogin}>Log in</Button>
                </FormControl>
                <Box>
                    <Text >Not a member yet? <Link btn-id="toRegisterBtn" pl={2} onClick={() => { navigate('/register'); }}>Sign up</Link></Text>
                </Box>
                {/* </form> */}
            </Flex>
        </Container>
    </>);
};

export default Login;