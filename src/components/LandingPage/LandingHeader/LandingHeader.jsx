import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

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
        <Box m="1rem" color='white'>Logo</Box>
        {/* <Box>title</Box> */}
      </Flex>
      <Flex flexDirection="row" alignItems="center" justifyContent='space-between'>
        <Link opacity={0.6} onClick={() => navigate('/login')}>Log in</Link>
        <Link fontSize="sm" opacity={0.6} m="0 0.5rem" onClick={() => navigate('/register')}>
          Sign Up
        </Link>
        <Link fontSize='sm' color="blue.500" pr='1rem'>Contacts</Link>
      </Flex>
    </Flex>
  );
};

export default LandingHeader;
