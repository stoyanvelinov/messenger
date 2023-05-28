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

  export const getAllUserChatRooms = (uid, observer) => {
    return onValue(ref(db,`users/${uid}/chatRooms/`), observer);
  };
  
  export const getChatRoomMembers = (chatRoomId) => {
    return get(query(ref(db,`chatRooms/${chatRoomId}/members`)));
  };
  
  export const getChatRoomMembersExceptMe = (uid, chatRoomId) => {
    return getChatRoomMembers(chatRoomId)
            .then((result)=> { 
                // console.log('ALLLLLLLLLLLLLLLLLLL:', Object.keys(result.val()));
               return  Object.keys(result.val());
            })
            .then((result)=>{
                const output = result.filter((id)=> id !== uid);
                // console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZ',output);
                return output;
            });
  };
  
  export const sendMessage = (chatRoomId, message, author, avatar, timeStamp) => {
    return push(ref(db, `messages/${chatRoomId}/`), {})
      .then(msgId => {
        set(ref(db, `messages/${chatRoomId}/${msgId.key}`), { body: message, id: msgId.key, author, avatar, dateCreated: timeStamp });
  
        const updates = {};
        updates[`/chatRooms/${chatRoomId}/messages/${msgId.key}`] = true;
        // updates[`/teams/${teamId}/channels/${channelId}/msgs/${result.key}/picURLs`] = picURLs;
        // updates[`/teams/${teamId}/channels/${channelId}/msgs/${result.key}/seenBy/${owner}`] = true;
  
        return update(ref(db), updates);
      });
  };