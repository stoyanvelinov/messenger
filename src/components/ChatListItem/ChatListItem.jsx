import React, { useEffect, useContext, useState } from 'react';
import { getChatRoomMembersExceptMe } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { getUserById, getUserData } from '../../services/users.service';

const ChatListItem = ({ cId }) => {
    const [members, setMembers] = useState([]);
    const [membersData, setMembersData] = useState({});
    const { user } = useContext(AuthContext);

    useEffect(()=>{
        const getUsers = async () => {
            const allUsers = await getChatRoomMembersExceptMe(user.uid, cId);
            setMembers(allUsers);
            const FFF = allUsers.forEach((usr) => {
                return ;
            });
        };
        getUsers();
    },[]);

    useEffect(()=>{
        const getUsersData = async () => {
            const allUsersObj = await Promise.all(
                members.map((usr) => {
                    return getUserById(usr);
                })
            );
            const result = allUsersObj.map((item)=> item.val());
            setMembersData(...result);
        };
        getUsersData();
    },[members]);

    console.log('мемберс',members);
    console.log('мемберсDEITA',membersData);
  return (
    <div>
        <h5>{membersData && membersData.username}</h5>
    </div>
  );
};

export default ChatListItem;