import { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { Message } from '../Message/Message';
import { AuthContext } from '../../context/authContext';
import { createMsg, getLiveMsgByChatRoomId, } from '../../services/chat.service';
import { getLiveUsersByChatRoomId } from '../../services/users.service';
import { useParams } from 'react-router-dom';


const ChatRoom = ({ chatRoomId }) => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const { user, userData } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribeMessages = getLiveMsgByChatRoomId(chatRoomId, (c) => setMessages([...c]));
    const unsubscribeUsers = getLiveUsersByChatRoomId(chatRoomId, (c) => setMembers([...c]));

    return () => { unsubscribeMessages(), unsubscribeUsers(); };
  }, [chatRoomId]);

  // Scroll to the bottom of the element upon message submission
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle message submission
  const sendMessage = async event => {
    event.preventDefault();

    const data = {
      message: input,
      timestamp: Date.now(),
      sender: user.uid,
      avatarUrl: userData.avatar,
      firstName: userData.firstName,
      lastName: userData.lastName,
      edited: 
        {
          edited: false
        }
    };

    if (isValidMessage(input)) {
      //add error handling
      await createMsg(input, data.sender, data.avatarUrl, data.firstName, data.lastName, data.edited, chatRoomId);
      setInput('');
    }
  };

  // Check if the message is valid before sending
  const isValidMessage = input => {
    let validMessage = true;

    if (input.trim() === '') validMessage = false;
    return validMessage;
  };

  // Allow user to press Enter to send messages
  const handleKeyPress = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      sendMessage(event);
    }
  };

  // Function to scroll to bottom of element using a div element as ref
  const scrollToBottom = () => {
    scrollToMyRef.current.scrollIntoView({ behavior: 'smooth' });
  };

//   const logout = () => {
//     handleLogout(() => {
//       history.push('/login');
//     });
//   };

  return (
    <Flex fontSize="md" flexDirection="column">
      <Flex h="93vh" flexDirection="column" p={5}>
        <Flex h="70vh" mb={5} flexDirection="column" overflowY="auto">
          <Box >
            {messages.map((message, index) => {
              return (
                <Message
                  key={message.msgId}
                  prevSameUser={messages?.[index - 1]?.sender === message.sender}
                  nextSameUser={messages?.[index + 1]?.sender === message.sender}
                  message={message.message}
                  avatarUrl={message.avatar}
                  firstName={message.firstName}
                  lastName={message.lastName}
                  reactions={message.reactions}
                  timestamp={message.timestamp}
                  sender={message.sender}
                  msgId={message.msgId}
                />
              );
            })}
            <div ref={scrollToMyRef} />
          </Box>
        </Flex>
        <FormControl>
          <Flex justifyContent="center" alignItems="center" flexDirection="row">
            <Textarea
              w="50vw"
              placeholder="Enter message"
              value={input}
              onChange={event => {
                setInput(event.target.value);
              }}
              onKeyPress={e => handleKeyPress(e)}
              size="sm"
              resize="none"
            />
            <Button h={20} w={150} m={5} onClick={e => sendMessage(e)}>
              Send Message
            </Button>
          </Flex>
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default ChatRoom;