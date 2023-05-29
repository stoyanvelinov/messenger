import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
  Button
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useRef } from 'react';
import { Text, Flex } from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import ProfileInfo from '../ProfileInfo/ProfileInfo';
import { logout } from '../../services/auth.service';
import { updateUserStatus } from '../../services/users.service';
import { STATUS } from '../common/status';
import { useNavigate } from 'react-router-dom';
import ProfileStatusIcon from '../ProfileInfo/ProfileStatusIcon';

const Profile = () => {
  const { userData, setUser } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const btnRef = useRef();
  const [isProfile, setIsProfile] = useState(true);

  const isOpenProfileTrue = () => {
    setIsProfile(true);
  };

  const handleLogout = async () => {

    try {
      await logout();
      await updateUserStatus(userData.uid, STATUS.OFFLINE);
      setUser({});
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  let style;

  switch (userData.status) {
    case STATUS.ONLINE:
      style = 'green';
      break;
    case STATUS.DO_NOT_DISTURB:
      style = 'red';
      break;
    default:
      style = 'gray';
  }

  const updateImg = () => { };
  return (
    <Box width='100%' >
      <Flex position='relative'  onClick={onOpen} ref={btnRef} w='100%' justify='center' align='center' mr='3rem'>

        <Text color='white' mr='0.4rem' fontSize='s' cursor="pointer">{`${userData.firstName} ${userData.lastName}`} </Text>

        <ProfileAvatar
          onChange={updateImg}
          name={`${userData.firstName} ${userData.lastName}`}
          status={userData.status}
          src={userData.avatar}
        />
        <ProfileStatusIcon ml='-0.6rem' zIndex='5' mt='2rem' color={style} />
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement='right'
        finalFocusRef={btnRef}
        onClose={onClose}>

        <DrawerOverlay />

        <DrawerContent>
          <DrawerCloseButton onClick={isOpenProfileTrue} />

          <DrawerHeader borderBottomWidth='0.2rem' borderColor='primaryLight' background='primaryMid' pb='0.7rem'>
            My profile
          </DrawerHeader>

          <DrawerBody background='primaryDark'>
            <Flex flexDirection='column' h='100%' justifyContent='space-between'>
              <ProfileInfo />
              <Flex justifyContent='flex-end'>
                <Button mt='2rem' bg='darkRed' size='sm' color='white' pl='1.4rem' pr='1.4rem' onClick={handleLogout}>Logout</Button>
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>

      </Drawer>
    </Box>
  );
};

export default Profile;
