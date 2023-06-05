//chatlist.jsx
import { useState, useEffect, useContext } from 'react';
import { addChatMember, createChatRoom, getCurrentUserChatRooms, toggleChatRoomVisibility, findActiveRoom, getUserChatRooms ,addChatRoom, isOpenChatRoom } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { Flex, Container, Box, Text } from '@chakra-ui/layout';
import ChatListItem from '../ChatListItem/ChatListItem';
import { getAllUsers, getUserById, getUserByUsername } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import SearchUsers from '../SearchUsers/SearchUsers';
import { Button } from '@chakra-ui/react';

const ChatList = () => {
  const { user, setUser, currentChatRoomId } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState([]);
  const [allUsers, setAllUsers] = useState('');
  // const [existingChatroom, setExistingChatroom] = useState('');
  // const [newUser, setNewUser] = useState('');
  // const [members, setMembers] = useState({});
  // const [chatRoomsDetails, setChatRoomsDetails] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = getCurrentUserChatRooms(user.uid, (chatRoomIds)=>{
      const onlyVisible = Object.keys(chatRoomIds).filter((chatRoomId)=>{
        return chatRoomIds[chatRoomId] === true; 
      });
      setActiveChats(onlyVisible);
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

    useEffect(()=>{
      getAllUsers()
      .then((result)=>{
        setAllUsers(result);
      });
    },[]);

  const handleAddChatRoom = async (newUser) => {
    try {
      const chR = await isOpenChatRoom(newUser);
      if (chR) {
        const chatRoomId = await toggleChatRoomVisibility(user.uid, chR);
        navigate(`/messages/${chatRoomId}`);
      } else {
        const chatRoomId = await addChatRoom(user.uid, newUser);
        navigate(`/messages/${chatRoomId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleRemoveFromList = (e, chatRoomId) => {
    e.stopPropagation();
    toggleChatRoomVisibility(user.uid, chatRoomId);
    navigate('/messages');

    setUser((prev) => ({
      ...prev,
      currentChatRoomId: null
  }));
  };

  return (
    <div>
      <SearchUsers 
        addChatRoom={handleAddChatRoom}
      />
      <Flex direction='column'>
        {activeChats &&
          activeChats.map((chatRoomId) => (
              <ChatListItem key={chatRoomId}
                chatRoomId={chatRoomId}
                handleRemoveFromList={(e)=>{handleRemoveFromList(e, chatRoomId);}}
              />
          ))}
      </Flex>
    </div>
  );
};

export default ChatList;