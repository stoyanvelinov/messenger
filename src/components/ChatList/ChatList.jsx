import { useState, useEffect, useContext } from 'react';
import { getCurrentUserChatRooms, addChatRoomMember, createChatRoom, removeChatRoom } from '../../services/chat.service';
import { getUserValueByUsername } from '../../services/users.service';
import { AuthContext } from '../../context/authContext';
import { Flex } from '@chakra-ui/layout';
import ChatListItem from '../ChatListItem/ChatListItem';
import { getAllUsers } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import SearchUsers from '../SearchUsers/SearchUsers';
import { Box, Button, HStack } from '@chakra-ui/react';

const ChatList = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState([]);
  const [allUsers, setAllUsers] = useState('');
  const [newChatMember, setNewChatMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = getCurrentUserChatRooms(user.uid, (chatRoomIds) => {
      const onlyDirect = Object.keys(chatRoomIds).filter((chatRoomId) => {
        return chatRoomIds[chatRoomId]['type'] === 'direct';
      });
      setActiveChats(onlyDirect);
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  useEffect(() => {
    getAllUsers()
      .then((result) => {
        setAllUsers(result);
      });
  }, []);

  const handleAddMember = (user) => {
    setNewChatMember(user);
  };

  const handleAddChatRoom = async () => {
    try {
      const newUserId = newChatMember ? await getUserValueByUsername(newChatMember) : null;
      if (newUserId && newUserId !== user.uid) {
        const newChatRoom = await createChatRoom(user.uid, 'direct');
        const chatRoomId = await addChatRoomMember(newUserId, newChatRoom, 'direct');
        navigate(`/messages/${chatRoomId}`);
      }
      setNewChatMember(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromList = async (e, chatRoomId) => {
    e.stopPropagation();
    await removeChatRoom(chatRoomId);
    navigate('/messages');

    setUser((prev) => ({
      ...prev,
      currentChatRoomId: null
    }));
  };

  return (
    <>
      <Box p="1rem">
        <Box>
          Start a chat
        </Box>
        <HStack>
          <SearchUsers addMember={handleAddMember} width="100%" />
          <Button bg='accent' h="1.9rem" _hover={{ bg: 'primaryLight' }} onClick={handleAddChatRoom} ml={3}>
            Go
          </Button>
        </HStack>
      </Box>
      <Flex direction='column'>
        {activeChats &&
          activeChats.map((chatRoomId) => (
            <ChatListItem key={chatRoomId}
              chatRoomId={chatRoomId}
              handleRemoveFromList={(e) => { handleRemoveFromList(e, chatRoomId); }}
            />
          ))}
      </Flex>
    </>
  );
};

export default ChatList;