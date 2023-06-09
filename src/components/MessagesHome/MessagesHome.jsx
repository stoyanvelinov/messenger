import { ReactComponent as ChatImage } from '../../assets/svg/chat.svg';
import {
  Box,
  Flex,
  Center,
} from '@chakra-ui/react';

const MessagesHome = () => {
    return (
        <Flex fontSize="md" flexDirection="column">
          <Box position='relative' >
              <Center  p='10' color='white' axis='both'>
                <ChatImage width='60%' height='60%'/>
              </Center>
            </Box>
        </Flex>
      );
};

export default MessagesHome;