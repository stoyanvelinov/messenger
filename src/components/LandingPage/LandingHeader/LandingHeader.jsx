import { Flex, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@chakra-ui/layout';

const LandingHeader = () => {
  const navigate = useNavigate();
  return (
    <Flex
      className='landing-header'
      height="10%"
      width="100%"
      bg="primary"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems='center'>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          ml='1rem'
          maxW='5rem'
        >
          Logo
        </Text>
        {/* <Box>title</Box> */}
      </Flex>
      <Flex flexDirection="row" alignItems="center" justifyContent='space-between'>
        <Link fontSize='1.4rem' opacity={0.6} onClick={() => navigate('/login')}>Log in</Link>
        <Link fontSize='1.4rem' opacity={0.6} m="1rem" onClick={() => navigate('/register')}>
          Sign Up
        </Link>
        <Link fontSize='1.4rem' color="blue.500" mr='1rem'>Contacts</Link>
      </Flex>
    </Flex>
  );
};

export default LandingHeader;
