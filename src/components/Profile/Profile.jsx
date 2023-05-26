import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useRef } from 'react';
import { Text, Flex } from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';

const Profile = () => {
  const { userData } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [isProfile, setIsProfile] = useState(true);

  const isOpenProfileTrue = () => {
    setIsProfile(true);
  };

  return (
    <Box width='100%' >
      <Flex onClick={onOpen} ref={btnRef} w='100%' justify='center' align='center'  mr='3rem'>

        <Text color='white' mr='0.4rem' fontSize='s' cursor="pointer">{`${userData.firstName} ${userData.lastName}`} </Text>

        <ProfileAvatar
          name={`${userData.firstName} ${userData.lastName}`}
          status={userData.status}
          src={userData.avatarUrl}
          background='yellow'
          size='sm'
          cursor="pointer" />
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement='right'
        finalFocusRef={btnRef}
        onClose={onClose}>

        <DrawerOverlay />

        <DrawerContent>
          <DrawerCloseButton onClick={isOpenProfileTrue} />

          <DrawerHeader borderBottomWidth='0.2rem' borderColor='primaryLight' background='primaryMid' pb='1.47rem'>
            My profile
          </DrawerHeader>

          <DrawerBody background='primaryDark'>
     
          </DrawerBody>
        </DrawerContent>

      </Drawer>
    </Box>
  );
}

export default Profile;
