import { useState, useEffect, useContext } from 'react';
import { getCurrentUserChatRooms, toggleChatRoomVisibility, addChatRoomMember, createChatRoom, checkRoomActivity, disableChatRoomForUser, removeChatRoom } from '../../services/chat.service';
import { getUserValueByUsername } from '../../services/users.service';
import { AuthContext } from '../../context/authContext';
import { Flex } from '@chakra-ui/layout';
import ChatListItem from '../ChatListItem/ChatListItem';
import { getAllUsers } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import SearchUsers from '../SearchUsers/SearchUsers';

const ChatList = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState([]);
  const [allUsers, setAllUsers] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = getCurrentUserChatRooms(user.uid, (chatRoomIds)=>{
      const onlyDirect = Object.keys(chatRoomIds).filter((chatRoomId)=>{
        return chatRoomIds[chatRoomId]['type'] === 'direct'; 
      });
      setActiveChats(onlyDirect);
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
      const newChatRoom = await createChatRoom(user.uid,'direct');
      const newUserId = await getUserValueByUsername(newUser);
      const chatRoomId = await addChatRoomMember(newUserId, newChatRoom, 'direct');
      navigate(`/messages/${chatRoomId}`);

    } catch(error){
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
    <div>
      <SearchUsers 
        addMember={ handleAddChatRoom }
      />
      <Flex direction='column'>
        {activeChats &&
          activeChats.map((chatRoomId) => (
              <ChatListItem key={chatRoomId}
                chatRoomId={chatRoomId}
                handleRemoveFromList={ (e)=>{ handleRemoveFromList(e, chatRoomId); }}
              />
          ))}
      </Flex>
    </div>
  );
};

export default ChatList;