import { Divider } from '@chakra-ui/layout';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import MessagePopover from './MessagePopover';

const Message = ({ timestamp, message, reactions, username, avatarUrl, prevSameUser, nextSameUser, msgId, firstName, lastName, audioUrl, sender, edited }) => {
  return (
    <Flex flexDirection='column' p={prevSameUser && nextSameUser ? '0 1rem' : nextSameUser ? '1rem 1rem 0' : prevSameUser ? '0 1rem 1rem' : '1rem'}>
      {prevSameUser ? (
        <MessagePopover message={message} reactions={reactions} msgId={msgId} timestamp={timestamp} audioUrl={audioUrl} sender={sender} edited={edited} />
      ) : (
        <>
          <Flex flexDirection='row'>
            <Avatar name={`${firstName} ${lastName}`} src={avatarUrl} />
            <Flex alignItems='flex-start' flexDirection='column'>
              <Box ml='0.5rem' fontSize='1.4rem'>
                {`${username}`}
              </Box>
              <Text fontSize='0.8rem' opacity='35%' ml='0.4rem' >
                {new Date(parseInt(timestamp)).toLocaleString()}
              </Text>
            </Flex>
          </Flex>
          <Box px='3rem'>
            <Divider maxW='9rem' borderColor='primaryLight' />
          </Box>
          <MessagePopover message={message} reactions={reactions} msgId={msgId} timestamp={timestamp} audioUrl={audioUrl} sender={sender} edited={edited} />
        </>
      )}
    </Flex>
  );
};


export default Message;
