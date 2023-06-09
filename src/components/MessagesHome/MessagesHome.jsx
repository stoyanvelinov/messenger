import { ReactComponent as ChatImage } from '../../assets/svg/chat.svg';
import {
  Box,
  Flex,
  Button,
  AbsoluteCenter,
  Center,
  FormControl,
  Textarea,
  HStack,
} from '@chakra-ui/react';

const MessgesHome = () => {
    return (
        <Flex fontSize="md" flexDirection="column">
          <Box position='relative' >
              <Center  p='10' color='white' axis='both'>
                <ChatImage width='60%'
  height='60%'/>
              </Center>
            </Box>
        </Flex>
      );
};

export default MessgesHome;