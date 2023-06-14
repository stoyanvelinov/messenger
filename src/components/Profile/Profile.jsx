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
import ProfileInfo from '../ProfileInfo/ProfileInfo';
import { logout } from '../../services/auth.service';
import { updateUserStatus } from '../../services/users.service';
import { STATUS } from '../../common/status';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../../UserAvatar/UserAvatar';

const Profile = () => {
  const { userData, setUser } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const btnRef = useRef();

  const handleLogout = async () => {

    try {
      await logout();
      await updateUserStatus(userData.uid, STATUS.OFFLINE);
      setUser({
        user: null,
        userData: null,
      });
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box width='100%' >
      <Flex position='relative' onClick={onOpen} ref={btnRef} w='100%' justify='center' align='center' mr='3rem'>
        <Text color='white' mr='0.4rem' fontSize='s' cursor="pointer">{`${userData.firstName} ${userData.lastName}`} </Text>
        <UserAvatar avatarSize="md" user={userData} />
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement='right'
        finalFocusRef={btnRef}
        onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton onClick={onClose} />
          <DrawerHeader background='primaryLight' >
            My&nbsp; profile
          </DrawerHeader>
          <DrawerBody background='primaryDark'>
            <Flex flexDirection='column' h='100%' justifyContent='space-between'>
              <ProfileInfo />
              <Flex justifyContent='flex-end'>
                <Button mt='2rem' bg="darkRed" _hover={{ bg: 'red' }} size='sm' pl='1.4rem' pr='1.4rem' onClick={handleLogout}>Logout</Button>
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>

      </Drawer>
    </Box>
  );
};

export default Profile;
