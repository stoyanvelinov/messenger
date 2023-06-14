import { Box } from '@chakra-ui/react';
import LandingHeader from '../LandingHeader/LandingHeader';
import LandingFooter from '../LandingFooter/LandingFooter';
import LandingBody from '../LandingBody/LandingBody';

const LandingPage = () => {
  return (
    <Box
      className='wrapper'
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </Box>
  );
};

export default LandingPage;
