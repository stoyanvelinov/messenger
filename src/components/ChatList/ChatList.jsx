//chatlist.jsx
import { useState, useEffect, useContext } from 'react';
import { addChatMember, createChatRoom, getCurrentUserChatRooms } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { Flex, Container, Box, Text } from '@chakra-ui/layout';
import ChatListItem from '../ChatListItem/ChatListItem';
import { getAllUsers, getUserById, getUserByUsername } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import SearchUsers from '../SearchUsers/SearchUsers';

const ChatList = () => {
  const { user } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState([]);
  const [allUsers, setAllUsers] = useState('');
  // const [members, setMembers] = useState({});
  // const [chatRoomsDetails, setChatRoomsDetails] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = getCurrentUserChatRooms(user.uid, (chatRoomIds)=>{
      setActiveChats(chatRoomIds);
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

  const addChatRoom = async (newUser) => {
    try {
      const chatRoomId = await createChatRoom(user.uid);
      const newUserId = await getUserByUsername(newUser);
      await addChatMember(newUserId, chatRoomId);
      navigate(`/messages/${chatRoomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <SearchUsers addChatRoom={addChatRoom}/>
      <Flex direction='column'>
        {activeChats &&
          activeChats.map((chatRoomId) => (
              <ChatListItem key={chatRoomId}
                chatRoomId={chatRoomId}
              />
          ))}
      </Flex>
    </div>
  );
};

export default ChatList;