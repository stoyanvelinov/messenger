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
import { getUserById, getUserValueByUsername } from './users.service';
import { isEmpty } from 'lodash';
import { sendNotification } from './notifications.service';

export const addChatRoomMember = (uid, chatRoomId, type, teamId, channelId) => {
  teamId = teamId || false;
  channelId = channelId || false;
  const updates = {};
  updates[`chatRooms/${chatRoomId}/members/${uid}`] = true;
  // updates[`users/${uid}/chatRooms/${chatRoomId}`] = true;
  updates[`users/${uid}/chatRooms/${chatRoomId}/visible`] = true;
  updates[`users/${uid}/chatRooms/${chatRoomId}/type`] = type;
  updates[`users/${uid}/chatRooms/${chatRoomId}/team`] = teamId;
  updates[`users/${uid}/chatRooms/${chatRoomId}/channel`] = channelId;
  update(ref(db), updates);
  return chatRoomId;
};

export const addMultipleChatRoomMembers = (usersList, chatRoomId) => {
  const updates = {};
  usersList.forEach((uid) => {
    updates[`chatRooms/${chatRoomId}/members/${uid}`] = true;
  });
  update(ref(db), updates);
  return chatRoomId;
};

export const removeChatRoomMember = (uid, chatRoomId) => {
  const updates = {};
  updates[`chatRooms/${chatRoomId}/members/${uid}`] = null;
  updates[`users/${uid}/chatRooms/${chatRoomId}`] = null;
  update(ref(db), updates);
  return chatRoomId;
};

export const disableChatRoomForUser = (uid, chatRoomId) => {
  const updates = {};
  updates[`chatRooms/${chatRoomId}/members/${uid}`] = false;
  update(ref(db), updates);
  return chatRoomId;
};

export const checkRoomActivity = async (chatRoomId) => {
  const dbRef = ref(db, `chatRooms/${chatRoomId}/members/`);
  const snapshot = await get(dbRef);
  const roomMembers = Object.values(snapshot.val());
  if(roomMembers.length < 1){
    return false;
  } 
  return true;
};

export const toggleChatRoomVisibility = async (uid, chatRoomId) => {
  const currentStatus = await get(query(ref(db, `users/${uid}/chatRooms/${chatRoomId}`)));
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
    const userId = await getUserValueByUsername(username);
    const snapshot = await getUserChatRooms(userId);
    const data = snapshot.exists() ? snapshot.val() : {};
    if (isEmpty(data)) {
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

export const addChatRoom = async (myUserId, newUserUsername) => {
  try {
    const chatRoomId = await createChatRoom(myUserId);
    const newUserId = await getUserValueByUsername(newUserUsername);
    await addChatRoomMember(newUserId, chatRoomId);

  } catch (error) {
    console.log(error);
  }
};

export const createChatRoom = async (uid, type, teamId, channelId) => {
  teamId = teamId || false;
  channelId = channelId || false;
  const newChatRoom = await push(ref(db, 'chatRooms/'), {});
  const chatRoomId = newChatRoom.key;
  const updates = {};
  updates[`chatRooms/${chatRoomId}/type`] = type;
  updates[`chatRooms/${chatRoomId}/team`] = teamId;
  updates[`chatRooms/${chatRoomId}/channel`] = channelId;
  await update(ref(db), updates);
  await addChatRoomMember(uid, chatRoomId, type, teamId, channelId);
  return chatRoomId;
};

// export const createChatRoom = (uid, type) => {
//   return push(ref(db, 'chatRooms/'), {}).then((chatRoomId) => {
//     return addChatRoomMember(uid, chatRoomId.key);
//   });
// };

export const getUserChatRooms = (uid) => {
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

export const getChatRoomMembers = async (chatRoomId) => {
  const dbRef = ref(db, `chatRooms/${chatRoomId}/members/`);
  const snapshot = await get(dbRef);
  const roomMembers = Object.keys(snapshot.val());
  return roomMembers;
};

export const getChatRoom = async (chatRoomId) => {
  const chatRoomRef = ref(db, `chatRooms/${chatRoomId}`);
  const chatRoomSnapshot = await get(chatRoomRef);

  if (chatRoomSnapshot.exists()) {
    return chatRoomSnapshot.val();
  } else {
    return null;
  }
};

export const removeChatRoom = async (chatRoomId) => {
  try {
    const chatRoomRef = ref(db, `chatRooms/${chatRoomId}`);
    const chatRoomSnapshot = await get(chatRoomRef);
    const chatRoomMembers = await getChatRoomMembers(chatRoomId);
    const promises = chatRoomMembers.map(async(userId)=>{
      await removeChatRoomMember(userId, chatRoomId);
    });
    await Promise.all(promises);

    if (chatRoomSnapshot.exists()) {
      const updates = {};
      updates[`chatRooms/${chatRoomId}`] = null;
      update(ref(db), updates);

      
      return chatRoomId;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
// export const removeChatRoom = async (chatRoomId) => {
//   try {
//     const chatRoomRef = ref(db, `chatRooms/${chatRoomId}`);
//     const chatRoomSnapshot = await get(chatRoomRef);

//     if (chatRoomSnapshot.exists()) {
//       const updates = {};
//       updates[`chatRooms/${chatRoomId}`] = null;
//       update(ref(db), updates);
//       return chatRoomId;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

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

export const sendMessage = (chatRoomId, message, author, avatar, timeStamp) => {
  return push(ref(db, `messages/${chatRoomId}/`), {})
    .then(msgId => {
      set(ref(db, `messages/${chatRoomId}/${msgId.key}`), { body: message, id: msgId.key, author, avatar, dateCreated: timeStamp });

      const updates = {};
      updates[`/chatRooms/${chatRoomId}/messages/${msgId.key}`] = true;

      return update(ref(db), updates);
    });
};

export const createMsg = async (input, sender, avatar = null, username, edited, chatRoomId, firstName, lastName, audioUrl, channelId, teamId) => {
  const msgId = push(child(ref(db), '/messages')).key;
  const msgData = {
    msgId: msgId,
    message: input,
    timestamp: Date.now(),
    sender: sender,
    avatar: avatar,
    username: username,
    chatRoomId: chatRoomId,
    firstName: firstName,
    lastName: lastName,
    audioUrl: audioUrl
  };
  const updates = {
    [`/messages/${msgId}`]: msgData,
    [`/chatRooms/${chatRoomId}/messages/${msgId}`]: true
  };
  await update(ref(db), updates);
  await sendNotification(sender, chatRoomId, msgId, username, channelId, teamId);

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

export const deleteMsg = async (msgId, chatRoomId) => {
  const updates = {
    [`/messages/${msgId}`]: null,
    [`/chatRooms/${chatRoomId}/messages/${msgId}`]: null,
  };
  await update(ref(db), updates);
};

/**
Retrieves the chat room id associated with a channel id.
@async
@param {string} channelId - The id of the channel.
@returns {Promise<string>} A promise that resolves with the id of the chat room.
*/
export const getChatRoomIdByChannelId = (channelId) => {
  return get(ref(db, `channels/${channelId}/chatRoom`));
};