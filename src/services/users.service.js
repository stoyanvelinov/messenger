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
import { STATUS } from '../common/status';

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

/**
 * Creates a new user in the Firebase Realtime Database.
 * @param {string} username - The username of the user.
 * @param {string} uid - The ID of the user.
 * @param {string} email - The email address of the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} avatar - The URL of the user's avatar.
 * @param {string} phone - The phone number of the user.
 * @returns {Promise<void>} A Promise that resolves when the user creation is complete.
 */
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

/**
 * Retrieves live users for a chat room from the Firebase Realtime Database and listens for updates.
 * @param {string} chatRoomId - The ID of the chat room to retrieve users for.
 * @param {function} listener - The listener function to be called when users are retrieved or updated.
 * @returns {function} A function that can be used to unsubscribe from the listener.
 */
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

/**
 * Updates the notification status for a user in the Firebase Realtime Database.
 * @param {string} userId - The ID of the user to update.
 * @param {string} chatRoomId - The ID of the chat room associated with the notification.
 * @returns {Promise<void>} A Promise that resolves when the update is complete.
 */
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

/**
 * Updates the avatar URL of a user in the Firebase Realtime Database.
 * @param {string} uid - The UID of the user to update.
 * @param {string} avatarUrl - The new avatar URL to set for the user.
 * @returns {Promise<void>} A Promise that resolves when the update is complete.
 */
export const updateUserAvatarUrl = (uid, avatarUrl) => {
  return update(ref(db, `users/${uid}`), {
    avatar: avatarUrl
  });
};



