import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { AvatarGroup, Avatar, HStack, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getLiveUsersByChatRoomId } from '../../services/chat.service';

const ChatListItem = ({ chatRoomId }) => {
  const navigate = useNavigate();
  const [chatMembers, setChatMembers] = useState([]);
  const { setUser, user } = useContext(AuthContext);

  const handleClick = () => {
    setUser((prev) => ({
        ...prev,
        currentChatRoomId: chatRoomId
    }));
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
          cursor: 'pointer'
        }}
        rounded='md'
        onClick={handleClick}
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
      </Box>
    </div>
  );
};

export default ChatListItem;
