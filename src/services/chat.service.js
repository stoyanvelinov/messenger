import {
  get,
  set,
  ref,
  update,
  query,
  push,
  onValue,
  child,
} from 'firebase/database';
import { db } from '../config/firebase.config';
  import { getUserById } from './users.service';

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

  export const getCurrentUserChatRooms = (uid, listener) => {
      const chatRoomsRef = ref(db, `users/${uid}/chatRooms/`);
      return onValue(chatRoomsRef, (snapshot) => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const chatRoomIds = Object.keys(data);
        listener(chatRoomIds);
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



export const createMsg = async (input, sender, avatar = null, firstName, lastName, reactions = [], chatRoomId) => {
  const msgId = push(child(ref(db), '/messages')).key;
  const msgData = {
    msgId: msgId,
    message: input,
    timestamp: Date.now(),
    sender: sender,
    avatar: avatar,
    firstName: firstName,
    lastName: lastName,
    chatRoomId: chatRoomId,
    reactions: reactions
  };
  const updates = {
    [`/messages/${msgId}`]: msgData,
    [`/chatRooms/${chatRoomId}/messages/${msgId}`]: true
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
