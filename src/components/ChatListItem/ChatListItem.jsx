import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { AvatarGroup, Avatar, HStack, Box } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { getLiveUsersByChatRoomId } from '../../services/chat.service';
import { updateUserNotification } from '../../services/users.service';

const ChatListItem = ({ chatRoomId, handleRemoveFromList }) => {
  const navigate = useNavigate();
  const [chatMembers, setChatMembers] = useState([]);
  const { setUser, user, currentChatRoomId } = useContext(AuthContext);

  const handleOpenChatroom = async() => {
    setUser((prev) => ({
      ...prev,
      currentChatRoomId: chatRoomId
    }));
    await updateUserNotification(user.uid, chatRoomId);
    navigate(`/messages/${chatRoomId}`);
  };
  useEffect(()=>{
    const unsubscribe = getLiveUsersByChatRoomId( chatRoomId , (members)=>{
      const otherMembers = members.filter((member)=> member.uid !== user.uid );
      setChatMembers(otherMembers);
    });
    return () => {
      unsubscribe();
    };
  },[chatRoomId]);

  return (
    <div>
      <Box
        mb={1}
        bg='#223659'
        border='1px'
        borderColor='gray.900'
        boxShadow='dark-lg'
        _hover={{
          fontWeight: 'bold',
          cursor: 'pointer',
          bg: '#2D4876'
        }}
        rounded='md'
        onClick={handleOpenChatroom}
        position="relative"
      >
        <HStack p={2}>
          <AvatarGroup size="sm" max={2}>
            {chatMembers &&
              chatMembers.map((member, index) => {
                return (
                  <Avatar
                    key={index}
                    name={member.username}
                    src={member.avatar}
                  />
                );
              })}
          </AvatarGroup>
          {chatMembers &&
            chatMembers.map((member, index) => {
              return <span key={index}>{member.username}</span>;
            })}
          
        </HStack>
        <SmallCloseIcon
        position="absolute"
        top="4"
        insetEnd="4"
        color="gray.600"
        _hover = {{ 
          color:'gray.100',
          transform: 'scale(1.4)',
         }}
         onClick={handleRemoveFromList}
        />
      </Box>
    </div>
  );
};

export default ChatListItem;
