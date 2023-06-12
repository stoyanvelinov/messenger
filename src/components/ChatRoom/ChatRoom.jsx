import { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  Textarea,
} from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';
import { createMsg, getLiveMsgByChatRoomId, } from '../../services/chat.service';
import Message from '../Message/Message';
import AudioRecorder from '../AudioRecorder/AurdioRecorder';
import { storeAudio } from '../../services/audio.service';


const ChatRoom = ({ chatRoomId }) => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);///////////////////////////
  const [isTextAreaHidden, setIsTextAreaHidden] = useState(false);
  const { user, userData, currentChatRoomId } = useContext(AuthContext);
  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => {
    const unsubscribeMessages = getLiveMsgByChatRoomId(chatRoomId, (c) => setMessages([...c]));

    return () => unsubscribeMessages();
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
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      edited: false,
      audioUrl: ''
      // messageType:
    };

    if (audioFile) {////////////////
      try {
        const audioUrl = await storeAudio(audioFile, chatRoomId);
        data.audioUrl = audioUrl;
      } catch (error) {
        console.log('Error uploading audio:', error);
        return;
      }
    }
    
    if (isValidMessage(input)) {
      //add error handling
      await createMsg(input, data.sender, data.avatarUrl, data.username, data.edited, currentChatRoomId, data.firstName, data.lastName, data.audioUrl);//////////
      setInput('');
      setAudioFile(null);
      setAudioBlob(null);
      setIsTextAreaHidden(false);
    }
  };

  // Check if the message is valid before sending
  const isValidMessage = input => {
    let validMessage = true;

    if (input.trim() === '' && !audioFile) {
      validMessage = false;
    }
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
                  username={message.username}
                  reactions={message.reactions}
                  timestamp={message.timestamp}
                  msgId={message.msgId}
                  firstName={message.firstName}
                  lastName={message.lastName}
                  audioUrl={message.audioUrl}
                  sender={message.sender}
                  edited={message.edited}
                />
              );
            })}
            <div ref={scrollToMyRef} />
          </Box>
        </Flex>
        <FormControl>
          <Flex justifyContent="center" alignItems="center" flexDirection="row">
            {!isTextAreaHidden && <Textarea
              w="50vw"
              placeholder="Enter message"
              value={input}
              onChange={event => {
                setInput(event.target.value);
              }}
              onKeyPress={e => handleKeyPress(e)}
              size="sm"
              resize="none"
            />}
            <AudioRecorder setAudioFile={setAudioFile} setIsTextAreaHidden={setIsTextAreaHidden} setAudioBlob={setAudioBlob} audioBlob={audioBlob} />
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