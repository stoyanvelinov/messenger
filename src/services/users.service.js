import {
  get,
  set,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  update,
  push,
  child,
} from 'firebase/database';
import { db } from '../config/firebase.config';
import { Timestamp } from 'firebase/firestore';

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

export const getUserByEmail = (email) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(email)));
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
  const status = 'offline';

  return set(ref(db, `users/${username}`), {
    uid,
    email,
    firstName,
    lastName,
    isAdmin,
    status: status,
    createdOn: createdOn,
    avatar: avatar,
    phone: phone,
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
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


export const updateUserCanPost = (name,status) => {
  return update(ref(db, `users/${name}`), {
    canPost:status
  });
};
