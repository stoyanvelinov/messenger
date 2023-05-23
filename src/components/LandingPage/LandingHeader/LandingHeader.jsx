import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';

const LandingHeader = () => {
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
        <Link color='white' opacity={0.6} fontFamily="cursive">Log in</Link>
        <Link color="white" fontSize="sm" opacity={0.6} fontFamily="cursive" m="0 0.5rem">
          Sign Up
        </Link>
        <Link fontSize='sm' color="blue.500" pr='1rem' fontFamily="cursive" >Contacts</Link>
      </Flex>
    </Flex>
  );
};

export default LandingHeader;
