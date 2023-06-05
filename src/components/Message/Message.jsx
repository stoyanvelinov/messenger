import { Divider } from '@chakra-ui/layout';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import MessagePopover from './MessagePopover';

export const Message = ({ timestamp, sender, message, reactions, firstName, lastName, avatarUrl, prevSameUser, nextSameUser, msgId  }) => {


  //listen for changing 
  return (
    <Flex flexDirection='column' p={prevSameUser && nextSameUser ? '0 1rem' : nextSameUser ? '1rem 1rem 0' : prevSameUser ? '0 1rem 1rem' : '1rem'}>
      {prevSameUser ? (
        <MessagePopover message={message} reactions={reactions} msgId={msgId } />
      ) : (
        <>
          <Flex Flex flexDirection='row'>
            <Avatar name={`${firstName} ${lastName}`} src={avatarUrl} />
            <Flex alignItems='center'>
              <Box ml='0.5rem' fontSize='1.4rem'>
                {`${firstName} ${lastName}`}
              </Box>
                <Text fontSize='0.8rem' opacity='35%' ml='0.4rem' mt='1rem' >
                  {new Date(parseInt(timestamp)).toLocaleString()}
                </Text>
            </Flex>
            </Flex >
            <Box px='3rem'>
              <Divider />
            </Box>
            <MessagePopover message={message} reactions={reactions} msgId={msgId} />
        </>
      )}
    </Flex>
  );
};
