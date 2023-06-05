import React from 'react';
import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import InfoBar from '../InfoBar/InfoBar';
import Carousel from '../Carousel/Carousel';
import './LandingBody.css'
import { LANDING_TEXT } from '../../common/constants';

const LandingBody = () => {
  const showInfoBar = useBreakpointValue({ base: false, md: true }); // Show InfoBar on medium screens and above
  const showAnimationBox = useBreakpointValue({ base: false, md: true }); // Show the animation box on medium screens and above

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
        bg="primary"
        justifyContent="center"
        fontWeight="bold"
        fontSize="xl"
        position="relative"
      >
        <Text fontSize='m' p='1rem'>{LANDING_TEXT}
        </Text>
        {showAnimationBox && ( // Render the animation box only when showAnimationBox is true
          <Box
            className='gtp-animation'
            position="absolute"
            top="60%"
            transform="translate(-50%, -50%)" // Center the box precisely
          >
            {/* Add your animation styles here */}
            <Link to="/login">
              <button className="cta-button">Get Started</button>
            </Link>
          </Box>
        )}
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
