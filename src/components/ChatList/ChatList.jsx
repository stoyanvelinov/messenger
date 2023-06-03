//chatlist.jsx
import { useState, useEffect, useContext } from 'react';
import { addChatMember, createChatRoom, getCurrentUserChatRooms } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
// import { Button, Input, useStepContext } from '@chakra-ui/react';
import { Flex, Container, Box, Text } from '@chakra-ui/layout';
import ChatListItem from '../ChatListItem/ChatListItem';
import { getAllUsers, getUserById, getUserByUsername } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import SearchUsers from '../SearchUsers/SearchUsers';
import { getChatRoomMembersExceptMe } from '../../services/chat.service';
import { isEmpty } from 'lodash';

const ChatList = () => {
  const { user } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState([]);
  const [allUsers, setAllUsers] = useState('');
  const [members, setMembers] = useState({});
  const [chatRoomsDetails, setChatRoomsDetails] = useState([]);
  const navigate = useNavigate();


  const activeChatsObserver = (snapshot) => {
    const chatRoomIds = snapshot.val();
    const activeChatKeys = Object.keys(chatRoomIds || []);

    setActiveChats(activeChatKeys);
    const promises = activeChatKeys.map((chatRoomId) => {
      return getChatRoomMembersExceptMe(user.uid, chatRoomId);
    });
  
    Promise.all(promises)
      .then((results) => {
        setChatRoomsDetails([
          ...chatRoomsDetails,
          ...results
        ]);

        results.forEach((chatItem) => {
          chatItem.members.map((memberId)=> {
            return getUserById(memberId).then((result)=>{
              setMembers({ 
                ...members, 
                [memberId]:result.val() 
              });
            });
          });
        });
      })
      .catch((error) => {
        console.error('Error retrieving user data:', error);
      });
    };
    
    useEffect(() => {
      const unsubscribe = getCurrentUserChatRooms(user.uid, activeChatsObserver);
  
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
      // setNewChatRoom(chatRoomId);
      navigate(`/messages/${chatRoomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenChatRoom = (chatRoomId) => {
    navigate(`/messages/${chatRoomId}`);
  };

  return (
    <div>
      <SearchUsers addChatRoom={addChatRoom}/>
      <Flex direction='column'>
        {activeChats &&
          !isEmpty(members) &&
          chatRoomsDetails.map((details) => (
            <Box 
                key={details.chatRoomId}
                onClick={()=>{ handleOpenChatRoom(details.chatRoomId); }}
              >
              <ChatListItem
                members={details.members.map((k) => allUsers.filter((user) => user.uid === k))}
              />
            </Box>
          ))}
      </Flex>
    </div>
  );
};

export default ChatList;