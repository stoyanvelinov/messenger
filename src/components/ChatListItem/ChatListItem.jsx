import React, { useEffect, useContext, useState } from 'react';
import { getChatRoomMembersExceptMe } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { getUserById, getUserData } from '../../services/users.service';
import { AvatarGroup, Avatar, HStack, Box } from '@chakra-ui/react';

const ChatListItem = ({ members }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const updateChatListItem = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    
  }, [members, refreshKey]);

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
        onLoad={updateChatListItem} 
      >
        <HStack p={2}>
          <AvatarGroup size="sm" max={2}>
            {members &&
              members.map((m, index) => {
                return (
                  <Avatar
                    key={index}
                    name={m[0].username}
                    src={m[0].avatar}
                  />
                );
              })}
          </AvatarGroup>
          {members &&
            members.map((m, index) => {
              return <span key={index}>{m[0].username}</span>;
            })}
        </HStack>
      </Box>
    </div>
  );
};

export default ChatListItem;
