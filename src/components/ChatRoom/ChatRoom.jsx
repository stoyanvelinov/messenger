import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Flex, Button, Textarea } from '@chakra-ui/react';
import { Message } from '../Message/Message';
import { AuthContext } from '../../context/authContext';
import { createMsg, getLiveMsgByChatRoomId, } from '../../services/chat.service';
import { getLiveUsersByChatRoomId } from '../../services/users.service';
import { useParams } from 'react-router-dom';
import TeamMembersSmallerScreen from '../TeamMembersSmallerScreen/TeamMembersSmallerScreen';
import ChannelsSmallerScreen from '../ChannelsSmallerScreen/ChannelsSmallerScreen';


const ChatRoom = () => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const { user, userData, currentChatRoomId } = useContext(AuthContext);
  const { teamId } = useParams();

  // Listen for messages received
  useEffect(() => {
    const unsub = getLiveMsgByChatRoomId(currentChatRoomId, (c) => setMessages([...c]));
    const unsub2 = getLiveUsersByChatRoomId(currentChatRoomId, (c) => setMembers([...c]));

    return () => { unsub(), unsub2(); };
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
      firstName: userData.firstName,
      lastName: userData.lastName,
      edited:
      {
        edited: false
      }

    };

    if (isValidMessage(input)) {
      //add error handling
      const asd = await createMsg(input, data.sender, data.avatarUrl, data.firstName, data.lastName, data.edited, currentChatRoomId);
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

  return (<>
    <Flex flexDirection="column" minWidth="250px" h="100%" >
      <Flex alignItems="center" as="header" h="3.6em" bg="tertiary" px="0.5rem" w="100%">
        <Box flexGrow={1}></Box>
        {teamId && <ChannelsSmallerScreen />}
        {teamId && <TeamMembersSmallerScreen />}
      </Flex>
      <Box flexGrow="1" flexShrink="1" overflowY="auto" h="100%" px={5}>
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
      <Flex className="text-input" px={{ base: '1rem', lg: '1.5rem', '2xl': '3.5rem' }} minHeight="4.5rem" minWidth="12.5rem" gap="1rem" justifyContent="center" alignItems="center"  >
        <Textarea
          minHeight="2.5rem"
          minWidth="11.5rem"
          w="90%"
          placeholder="Enter message"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
          onKeyPress={e => handleKeyPress(e)}
          resize="none"
        />
        <Button bg="accent" _hover={{ bg: 'primaryLight', color: 'primaryDark' }} minHeight="40px" minWidth="30px" maxWidth="85%" onClick={e => sendMessage(e)}>
          Send
        </Button>
      </Flex>
    </Flex >
  </>
  );
};

export default ChatRoom;