import { useState, useEffect, useContext } from 'react';
import { addChatMember, createChatRoom, getCurrentUserChatRooms } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { Button, Input, useStepContext } from '@chakra-ui/react';
import { Flex, Container, Box, Text } from '@chakra-ui/layout';
// import ChatRoom from '../ChatRoom/Chatroom';
import ChatListItem from '../ChatListItem/ChatListItem';
import { getAllUsers, getUserById, getUserByUsername } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import SearchUsers from '../SearchUsers/SearchUsers';
import { getChatRoomMembersExceptMe } from '../../services/chat.service';
import { isEmpty } from 'lodash';

const ChatList = () => {
  const { user } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [allUsers, setAllUsers] = useState('');
  const [members, setMembers] = useState({});
  const [chatRoomsDetails, setChatRoomsDetails] = useState([]);
  const [membersData, setMembersData] = useState([]);
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
        console.log('RESULTS:',results);
        // Handle the user data for each chat room

        setChatRoomsDetails([
          ...chatRoomsDetails,
          ...results
        ]);

        results.forEach((chatItem) => {
          chatItem.members.map((memberId)=> {
            return getUserById(memberId).then((result)=>{
              console.log('result Value', result.val());
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
      const unsubscribePromise = getCurrentUserChatRooms(user.uid, activeChatsObserver);
  
      return () => {
        unsubscribePromise.then((cleanup) => cleanup());
      };
    }, [user.uid]);
    useEffect(()=>{
    const promise = membersData.map((item)=>{

    });
  },[]);

    useEffect(()=>{
      getAllUsers()
      .then((result)=>{
        setAllUsers(result);
      });
    },[]);

  const handleChange = (event) => {
    setNewUser(event.target.value);
    console.log(newUser);
  };
  
  async function handleAddChatRoom(){
    try {
      const chatRoomId = await createChatRoom(user.uid);
      await addChatMember(newUser, chatRoomId);
      // navigate;
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div>
      <SearchUsers/>
      <Flex direction='column'>
        {activeChats &&
          !isEmpty(members) &&
          chatRoomsDetails.map((details) => (
            <ChatListItem
            key={details.chatRoomId}
            members={details.members.map((k) => allUsers.filter((user) => user.uid === k))}
          />
          
          ))}
      </Flex>
    </div>
  );
};

export default ChatList;