import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { FiLoader } from 'react-icons/fi';
import { Container } from '@chakra-ui/react';
import LandingPage from '../../components/LandingPage/LandingPage/LandingPage';


const AuthenticatedRoute = ({ children }) => {
    const { user, userData } = useContext(AuthContext);

    if (user && !userData) {
        return <Container centerContent><FiLoader size='24px' /></Container>;
    }
    if (!user) {
        return <LandingPage />;
    }
    return children;

};

export default AuthenticatedRoute;

