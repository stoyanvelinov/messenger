import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import InfoBar from '../InfoBar/InfoBar';
import Carousel from '../Carousel/Carousel';
import './LandingBody.css';
import { LANDING_TEXT } from '../../../common/constants.js';

const LandingBody = () => {
  const showInfoBar = useBreakpointValue({ base: false, md: true }); 
  const showAnimationBox = useBreakpointValue({ base: false, md: true }); 

  return (
    <Box
      className='body-left-side'
      height="85%"
      width="100%"
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }} 
    >
      {showInfoBar && <InfoBar />}
      <Flex
        className='body-center'
        width={{ base: '100%', md: '35%' }} 
        bg="primary"
        justifyContent="center"
        fontWeight="bold"
        fontSize="xl"
        position="relative"
      >
        <Text fontSize='m' p='1rem'>{LANDING_TEXT}
        </Text>
        {showAnimationBox && (
          <Box
            className='gtp-animation'
            position="absolute"
            top="60%"
            transform="translate(-50%, -50%)" 
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
        width={{ base: '100%', md: '55%' }}
        height="100%"
        bg="primary"
      >
        <Carousel />
      </Flex>
    </Box>
  );
};

export default LandingBody;
