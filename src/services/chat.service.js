import {
    get,
    set,
    ref,
    update,
    query,
    push,
    onValue,
    equalTo,
    orderByChild,
  } from 'firebase/database';
  import { db } from '../config/firebase.config';

  export const addChatMember = (uid, chatRoomId) => {
    const updates = {};
    updates[`chatRooms/${chatRoomId}/members/${uid}`] = true;
    updates[`users/${uid}/chatRooms/${chatRoomId}`] = true;
    console.log(updates);
    update(ref(db), updates);
    return chatRoomId;
  };
  
  export const createChatRoom = (uid) => {
    return push(ref(db, 'chatRooms/'), {}).then((chatRoomId) => {
      return addChatMember(uid, chatRoomId.key);
    });
  };

  export const getCurrentUserChatRooms = (uid, observer) => {
      const chatRoomsRef = ref(db, `users/${uid}/chatRooms/`);
      return onValue(chatRoomsRef, (snapshot) => {
        observer(snapshot); // Notify the observer with the snapshot
      });
  };
  
  export const getChatRoomMembers = (chatRoomId) => {
    return get(query(ref(db,`chatRooms/${chatRoomId}/members`)));
  };
  
  export const getChatRoomMembersExceptMe = (uid, chatRoomId) => {
    return getChatRoomMembers(chatRoomId)
            .then((result)=> { 
               return  {
                'chatRoomId': chatRoomId,
                'members': Object.keys(result.val())
              };
            })
            .then((result)=>{
                result.members = result.members.filter((id)=> id !== uid);
                return result;
            });
  };
  
  export const sendMessage = (chatRoomId, message, author, avatar, timeStamp) => {
    return push(ref(db, `messages/${chatRoomId}/`), {})
      .then(msgId => {
        set(ref(db, `messages/${chatRoomId}/${msgId.key}`), { body: message, id: msgId.key, author, avatar, dateCreated: timeStamp });
  
        const updates = {};
        updates[`/chatRooms/${chatRoomId}/messages/${msgId.key}`] = true;
  
        return update(ref(db), updates);
      });
  };


