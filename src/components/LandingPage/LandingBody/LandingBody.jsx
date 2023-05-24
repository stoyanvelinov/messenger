import React from 'react';
import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import InfoBar from '../InfoBar/InfoBar';
import Carousel from '../Carousel/Carousel';

const LandingBody = () => {
  const showInfoBar = useBreakpointValue({ base: false, md: true }); // Show InfoBar on medium screens and above

  return (
    <Box
      className='body-left-side'
      height="85%"
      width="100%"
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }} // Column layout on smaller screens, row layout on medium screens and above
    >
      {showInfoBar && <InfoBar />} {/* Render InfoBar only when showInfoBar is true */}
      <Flex
        className='body-center'
        width={{ base: '100%', md: '35%' }} // Take full width on smaller screens, 35% width on medium screens and above
        height="100%"
        bg="white"
        justifyContent="center"
        alignItems="center"
        fontWeight="bold"
        fontSize="xl"
      >
        <Text fontSize='xs'>Enhance your team's communication and collaboration with our powerful messenger platform. Stay connected with your colleagues, exchange ideas, share files, and work together seamlessly. Our feature-rich messenger provides a streamlined experience designed to boost productivity and foster teamwork.</Text>
      </Flex>
      <Flex
        className='body-right-side'
        width={{ base: '100%', md: '55%' }} // Take full width on smaller screens, 55% width on medium screens and above
        height="100%"
        bg="primary"
      >
        <Carousel />
      </Flex>
    </Box>
  );
};

export default LandingBody;
