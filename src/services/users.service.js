import {
  get,
  set,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  update,
  onValue,
} from 'firebase/database';
import { db } from '../config/firebase.config';
import { Timestamp } from 'firebase/firestore';
import { STATUS } from '../components/common/status';

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const getAllUsers = () => {
  return get(query(ref(db, 'users'))).then((snapshot) => {
    if (!snapshot.exists()) return [];
    const usersObj = snapshot.val();
    const users = Object.values(usersObj);
    return users;
  });
};

export const getUserById = (uid) => {
  return get(ref(db, `users/${uid}`));
};

export const getUserValueByUsername = (username) => {
  return get(query(ref(db, 'users'), orderByChild('username'), equalTo(username)))
          .then((snapshot) => { 
            if (snapshot.exists()) {
              return Object.keys(snapshot.val())[0];
            }
            return null;
          })
          .catch(error => {
            console.error('Error getting user:', error);
            return null; // Return null in case of an error
          });
};

export const getUserByEmail = (email) => {
  return get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
};
export const getUserByUsername = (username) => {
  return get(query(ref(db, 'users'), orderByChild('username'), equalTo(username)));
};

export const createUser = (
  username,
  uid,
  email,
  firstName,
  lastName,
  avatar,
  phone
) => {
  const createdOn = Timestamp.fromDate(new Date()).seconds;
  const isAdmin = false;

  return set(ref(db, `users/${uid}`), {
    uid,
    username,
    email,
    firstName,
    lastName,
    isAdmin,
    status: STATUS.ONLINE,
    createdOn: createdOn,
    avatar: avatar,
    phone: phone,
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getLiveUserData = (uid, listener) => {
  return onValue(ref(db, `users/${uid}`), snapshot => {
    const data = snapshot.val();
    listener(data);
  });
};

/**
Fetches the total count of all users from the Firebase Realtime Database.
@returns {Promise<number>} A Promise that resolves with the total count of users as a number, or 0 if there was an error.
*/
export const getAllUsersCount = async () => {
  try {
    const usersSnapshot = await get(ref(db, 'users'));
    const users = usersSnapshot.val();
    return Object.keys(users).length;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

/**
Get the last registered user from the database
@async
@function
@returns {Promise<Object>} - The user object representing the last registered user
@throws {Error} - Error getting last registered user
*/
export const getLastRegisteredUser = async () => {
  try {
    const queryRef = query(
      ref(db, 'users'),
      orderByChild('createdOn'),
      limitToLast(1)
    );
    const snapshot = await get(queryRef);
    const lastRegisteredUser = snapshot.val();
    return lastRegisteredUser;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting last registered user');
  }
};

export const updateUserStatus = (uid, status = STATUS.ONLINE) => {
  return update(ref(db, `users/${uid}`), {
    status
  });
};

export const updateUserProfile = (uid, form) => {
  return update(ref(db, `users/${uid}`), {
    ...form
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

export const updateUserNotification = async (userId, chatRoomId) => {
  if (chatRoomId === null) {
    return;
  }
  const userNotificationsRef = ref(db, `users/${userId}/notifications/${chatRoomId}`);
  const snapshot = await get(userNotificationsRef);

  if (snapshot.exists()) {
    const notificationToUpdate = snapshot.val();
    const updatedNotification = { ...notificationToUpdate, isSeen: true };
    await set(userNotificationsRef, updatedNotification);
  }
};


export const updateUserAvatarUrl = (uid, avatarUrl) => {
  return update(ref(db, `users/${uid}`), {
    avatar: avatarUrl
  });
};



