import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const LandingFooter = () => {
  return (
    <Box
      className='landing-footer'
      height="5%"
      width="100%"
      bg="primary"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <Text fontSize="sm" color="gray.500">
          &copy; 2023 [name]. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default LandingFooter;
