import { useState, useEffect, useContext } from 'react';
import { addChatMember, createChatRoom, getAllUserChatRooms } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { Button, Input } from '@chakra-ui/react';
import { Flex, Container, Box, Text } from '@chakra-ui/layout';
// import ChatRoom from '../ChatRoom/Chatroom';
import ChatListItem from '../ChatListItem/ChatListItem';
import { getUserByUsername } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const { user } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState([]);
  const [newUser, setNewUser] = useState('');
  const navigate = useNavigate();

  const activeChatsObserver = snapshot => {
    setActiveChats(Object.keys(snapshot.val()) || []);
  };

  useEffect(()=>{
    getAllUserChatRooms(user.uid, activeChatsObserver );
  },[user.uid]);

  console.log('AAAAA',activeChats);

  const handleChange = (event) => {
    setNewUser(event.target.value);
    console.log(newUser);
  };
  
  async function handleAddChatRoom(){
    
    try {
      console.log('clicked');
      const chatRoomId = await createChatRoom(user.uid);
      await addChatMember(newUser, chatRoomId);
      // navigate;
      // console.log(result);
    }catch(error){
      console.log(error);
    }
  }
  console.log('ACTivE CHATS',activeChats);
  return (
    <div>
      <Flex direction='column'>
        { 
         activeChats && activeChats.map((chatRoomId)=>{
           return <ChatListItem key={chatRoomId} cId={chatRoomId} />;
          })
        }
        aaa
        <Input placeholder='user id' value={newUser} onChange={ handleChange }/>
        <Button colorScheme='blue'onClick={handleAddChatRoom }>Start ChatRoom</Button>
      </Flex>
    </div>
    
    // <Flex direction='column'>
    //   {teamId ?
    //     <Channels channels={channels} teamId={teamId} channelId={channelId} /> : <Pms pmMembers={pmMembers} pmId={pmID} userGroupPMs={userGroupPMs} />}
    // </Flex>
  );
};

export default ChatList;