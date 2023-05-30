import React, { useEffect, useContext, useState } from 'react';
import { getChatRoomMembersExceptMe } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { getUserById, getUserData } from '../../services/users.service';
import { AvatarGroup, Avatar, HStack, Box } from '@chakra-ui/react';

const ChatListItem = ({ members }) => {

  return (
    <div>
        <Box mb={1}  bg='primaryLight' border='1px' borderColor='gray.900' boxShadow='dark-lg'  rounded='md'>
            <HStack p={2}>
                <AvatarGroup size="sm" max={2}>
                    {
                        members && 
                        members.map((m,index)=>{
                            console.log(m[0]);
                            
                            return <Avatar 
                                key={index}
                                name={m[0].username} 
                                src={m[0].avatar} 
                            />;
                            
                        })
                    }                    
                </AvatarGroup>
                {
                        members && 
                        members.map((m,index)=>{
                            return <span>{m[0].username}</span>;
                        })
                    }                   
            </HStack>

        </Box>
    </div>
  );
};

export default ChatListItem;