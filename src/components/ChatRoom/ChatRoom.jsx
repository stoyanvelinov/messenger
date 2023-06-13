import { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Flex,
  Button,
  Textarea,
} from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';
import { createMsg, getLiveMsgByChatRoomId, } from '../../services/chat.service';
import Message from '../Message/Message';
import AudioRecorder from '../AudioRecorder/AurdioRecorder';
import { storeAudio } from '../../services/audio.service';
import { useParams } from 'react-router-dom';
import TeamMembersSmallerScreen from '../TeamMembersSmallerScreen/TeamMembersSmallerScreen';
import ChannelsSmallerScreen from '../ChannelsSmallerScreen/ChannelsSmallerScreen';


const ChatRoom = ({ chatRoomId }) => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);///////////////////////////
  const [isTextAreaHidden, setIsTextAreaHidden] = useState(false);
  const { user, userData, currentChatRoomId } = useContext(AuthContext);
  const [audioBlob, setAudioBlob] = useState(null);
  const { teamId } = useParams();

  // Listen for messages received
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
    };

    if (audioFile) {
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

  return (<><Flex flexDirection="column" minWidth="250px" h="100%" >
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
            username={message.username}
            reactions={message.reactions}
            timestamp={message.timestamp}
            msgId={message.msgId}
            firstName={message.firstName}
            lastName={message.lastName}
            audioUrl={message.audioUrl}
            sender={message.sender}
          />
        );
      })}
      <div ref={scrollToMyRef} />
    </Box>
    <Flex className="text-input" backgroundColor='primaryMid' style={{ zIndex: 999 }} px={{ base: '1rem', lg: '1.5rem', '2xl': '3.5rem' }} minHeight="4.5rem" minWidth="12.5rem" gap="1rem" justifyContent="center" alignItems="center"  >
      {!isTextAreaHidden && <Textarea
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
      />}
      <AudioRecorder setAudioFile={setAudioFile} setIsTextAreaHidden={setIsTextAreaHidden} setAudioBlob={setAudioBlob} audioBlob={audioBlob} />
      <Button bg="accent" _hover={{ bg: 'primaryLight', color: 'primaryDark' }} minHeight="40px" minWidth="30px" maxWidth="85%" onClick={e => sendMessage(e)}>
        Send
      </Button>
    </Flex>
  </Flex >
  </>);
};

export default ChatRoom;