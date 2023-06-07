import {
  get,
  set,
  ref,
  update,
  query,
  push,
  onValue,
  child,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { db } from '../config/firebase.config';
import { getUserById, getUserByUsername } from './users.service';
import { isEmpty } from 'lodash';

export const addChatMember = (uid, chatRoomId) => {
  const updates = {};
  updates[`chatRooms/${chatRoomId}/members/${uid}`] = true;
  updates[`users/${uid}/chatRooms/${chatRoomId}`] = true;
  update(ref(db), updates);
  return chatRoomId;
};

export const toggleChatRoomVisibility = async (uid, chatRoomId) => {
  const currentStatus = await get(query(ref(db,`users/${uid}/chatRooms/${chatRoomId}`)));
  const updates = {};
  updates[`users/${uid}/chatRooms/${chatRoomId}`] = !currentStatus.val();
  update(ref(db), updates);
  return chatRoomId;
};

export const findActiveRoom = async (chatRoomId, uid) => {
  const dbRef = ref(db, `chatRooms/${chatRoomId}/members/${uid}`);
  const snapshot = await get(dbRef);

  if (snapshot.exists()) {
    return chatRoomId;
  } else {
    return false; 
  }
};

export const isOpenChatRoom = async (username) => {
  try {
    const userId = await getUserByUsername(username);
    const snapshot = await getUserChatRooms(userId);
    const data = snapshot.exists() ? snapshot.val() : {};
    if(isEmpty(data)){
      return false;
    }

    const chatIds = Object.keys(data);
    const promises = chatIds.map((chatId) => {
      return findActiveRoom(chatId, userId);
    });
    const chatRooms = await Promise.all(promises);
    const singleChatRoom = chatRooms.filter((chatRoom) => chatRoom)[0];
    return singleChatRoom;
  } catch (error) {
    console.log(error);
  }
};

export const addChatRoom = async (myUserId,newUserUsername) => {
  try {
    const chatRoomId = await createChatRoom(myUserId);
    const newUserId = await getUserByUsername(newUserUsername);
    await addChatMember(newUserId, chatRoomId);
    
  } catch (error) {
    console.log(error);
  }
};

export const createChatRoom = (uid) => {
  return push(ref(db, 'chatRooms/'), {}).then((chatRoomId) => {
    return addChatMember(uid, chatRoomId.key);
  });
};

export const getUserChatRooms = (uid) =>{
  const chatRoomsRef = ref(db, `users/${uid}/chatRooms/`);

  return get(chatRoomsRef);
};

export const getCurrentUserChatRooms = (uid, listener) => {
    const chatRoomsRef = ref(db, `users/${uid}/chatRooms/`);
    return onValue(chatRoomsRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      // const chatRoomIds = Object.keys(data);
      listener(data);
    });
};

export const getLiveUsersByChatRoomId = (chatRoomId, listener) => {
  return onValue(ref(db, `/chatRooms/${chatRoomId}/members`), snapshot => {
    const data = snapshot.exists() ? snapshot.val() : {};
    const userUid = Object.keys(data);
    const usersPromises = userUid.map(uid => getUserById(uid));
    Promise.all(usersPromises).then(usersSnapshot => {
      const users = usersSnapshot.map(user => user.val());
      listener(users);
    });
  });
};

export const getChatRoomMembers = (chatRoomId) => {
  return get(query(ref(db,`chatRooms/${chatRoomId}/members`)));
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

export const createMsg = async (input, sender, avatar = null, username, edited, chatRoomId, firstName, lastName) => {
  const msgId = push(child(ref(db), '/messages')).key;
  const msgData = {
    msgId: msgId,
    message: input,
    timestamp: Date.now(),
    sender: sender,
    avatar: avatar,
    username: username,
    chatRoomId: chatRoomId,
    edited: edited,
    firstName: firstName,
    lastName: lastName
  };
  const updates = {
    [`/messages/${msgId}`]: msgData,
    [`/chatRooms/${chatRoomId}/messages/${msgId}`]: { edited:false }
  };
  await update(ref(db), updates);
  return msgId;
};

export const getLiveMsgByChatRoomId = (chatRoomId, listener) => {
  return onValue(ref(db, `/chatRooms/${chatRoomId}/messages`), snapshot => {
    const data = snapshot.exists() ? snapshot.val() : {};
    const msgId = Object.keys(data);
    const msgPromises = msgId.map(id => getMsgById(id));
    Promise.all(msgPromises).then(msgSnapshot => {
      const messages = msgSnapshot.map(msg => msg.val());
      listener(messages);
    });
  });
};

export const getMsgById = (id) => {
  return get(ref(db, `messages/${id}`));
};
