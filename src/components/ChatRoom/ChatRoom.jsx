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

const messagest = [
  {
    message: 'Hello!',
    timestamp: 1622482200000,
    avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/team11-messenger.appspot.com/o/images%2FelCapitan-young-thug-lil-durk-computer-meme.jpg-193cdd22-7ca8-47fe-a7d7-59ad2f333f6f?alt=media&token=ccc99ec5-ba3a-4214-9fff-48d2404c7624',
    firstName: 'Kosta',
    lastName: 'Kurchov',
    sender: 'HjtUKOkCteM5nUAKkGwdv69tqiD2',
    reactions: []
  },
  {
    message: 'taka mai biva',
    timestamp: 1622482300000,
    avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/team11-messenger.appspot.com/o/images%2Fgoni-undefined-b99df3b5-7359-465a-bd7b-c8076501063d?alt=media&token=d782a72b-3b57-41e1-b616-864114a4946f',
    firstName: 'Pesho',
    lastName: 'Peshov',
    sender: 'FCvR6saKWeZnPUNyDzRWIKbPs5E2',
    reactions: [
      {
        reactionType: 'cry',
        userId: 'FCvR6saKWeZnPUNyDzRWIKbPs5E2'
      }
    ]
  },
  {
    message: 'asdasdasd?',
    timestamp: 1622482300000,
    avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/team11-messenger.appspot.com/o/images%2Fgoni-undefined-b99df3b5-7359-465a-bd7b-c8076501063d?alt=media&token=d782a72b-3b57-41e1-b616-864114a4946f',
    firstName: 'Pesho',
    lastName: 'Peshov',
    sender: 'FCvR6saKWeZnPUNyDzRWIKbPs5E2',
    reactions: [

    ]
  },
  {
    message: 'How are you?',
    timestamp: 1622482300000,
    avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/team11-messenger.appspot.com/o/images%2Fgoni-undefined-b99df3b5-7359-465a-bd7b-c8076501063d?alt=media&token=d782a72b-3b57-41e1-b616-864114a4946f',
    firstName: 'Pesho',
    lastName: 'Peshov',
    sender: 'FCvR6saKWeZnPUNyDzRWIKbPs5E2',
    reactions: [
      {
        reactionType: 'laugh',
        userId: 'FCvR6saKWeZnPUNyDzRWIKbPs5E2'
      }
    ]
  },
  {
    message: 'I am good, thanks!',
    timestamp: 1622482400000,
    avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/team11-messenger.appspot.com/o/images%2Fedge-undefined-b16372c3-6414-47d4-9f2b-0ecfb7a801b6?alt=media&token=b1f8856a-a5d2-4cbb-bd9e-7c1a517ce37e',
    firstName: 'John',
    lastName: 'Doe',
    sender: 'CuVBsKkhMOdfkR2fjDBjj5Vjf4E3',
    reactions: [
      {
        reactionType: 'like',
        userId: 'FCvR6saKWeZnPUNyDzRWIKbPs5E2'
      }
    ]
  },
];




const ChatRoom = () => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const { user, userData, currentChatRoomId } = useContext(AuthContext);
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
      // reactions: [
      //   {
      //     reactionType: 'like',
      //     userId: user.uid
      //   }
      // ]
    };

    if (isValidMessage(input)) {
      //add error handling
      const asd = await createMsg(input, data.sender, data.avatarUrl, data.firstName, data.lastName, data.reactions, currentChatRoomId);
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
          <Box>
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