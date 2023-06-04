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
            <Flex flexDirection='column'>
              <Box ml='0.5rem'>
                {`${firstName} ${lastName}`}
              </Box>
              <Text fontSize='sm' opacity='35%' ml='0.5rem'>
                {new Date(parseInt(timestamp)).toLocaleString()}
              </Text>
              <Divider />
            </Flex>
          </Flex>

            <MessagePopover message={message} reactions={reactions} msgId={msgId} />
        </>
      )}
    </Flex>
  );
};
