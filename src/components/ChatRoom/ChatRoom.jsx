import { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';
import { createMsg, getLiveMsgByChatRoomId, } from '../../services/chat.service';
import Message from '../Message/Message';


const ChatRoom = () => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { user, userData, currentChatRoomId } = useContext(AuthContext);

  console.log('pisnamiotkod', messages);
  // Listen for messages received


  useEffect(() => {
    const unsub = getLiveMsgByChatRoomId(currentChatRoomId, (c) => setMessages([...c]));

    return () => unsub() ;
  }, [currentChatRoomId]);

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
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      edited: 
        {
          edited: false
        }
      
    };

    if (isValidMessage(input)) {
      //add error handling
      await createMsg(input, data.sender, data.avatarUrl, data.username, data.edited, currentChatRoomId, data.firstName, data.lastName);
      console.log('message sent');
      setInput('');
    }
  };

  // Check if the message is valid before sending
  const isValidMessage = input => {
    let validMessage = true;

    console.log(input.trim());
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

  // const history = useHistory();

  const logout = () => {
    handleLogout(() => {
      history.push('/login');
    });
  };

  return (
    <Flex fontSize="md" flexDirection="column">
      {/* <Box border='solid' mt='0.2rem'>
        {members.map((member) => (

          <Avatar
              key={member.uid}
              name={`${member.firstName} ${member.lastName}`}
              src={member.avatar}
              status={member.status}
            />

        ))}
      </Box> */}
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
                  username={message.username}
                  reactions={message.reactions}
                  timestamp={message.timestamp}
                  msgId={message.msgId}
                  firstName={message.firstName}
                  lastName={message.lastName}
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