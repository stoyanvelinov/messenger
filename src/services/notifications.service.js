import {
    get,
    set,
    ref,
    update,
    onValue,
    child,
} from 'firebase/database';
import { db } from '../config/firebase.config';

export const getLiveUserNotification = (userUid, listener) => {
    const userNotificationsRef = ref(db, `users/${userUid}/notifications`);

    return onValue(userNotificationsRef, snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const notifications = Object.values(data);
        listener(notifications);
    });
};

export const sendNotification = async (sender, chatRoomId, msgId, username) => {
    const chatRoomMembersSnapshot = await get(ref(db, `/chatRooms/${chatRoomId}/members`));
    const chatRoomMembers = chatRoomMembersSnapshot.exists() ? chatRoomMembersSnapshot.val() : {};

    await Promise.all(Object.keys(chatRoomMembers).map(async memberUid => {
        if (memberUid !== sender) {
            const notificationRef = ref(db, `/users/${memberUid}/notifications`);
            const existingNotificationSnapshot = await get(child(notificationRef, chatRoomId));

            if (existingNotificationSnapshot.exists() && !existingNotificationSnapshot.val().isSeen) {
                // Update the existing notification if it exists and is not seen
                await update(notificationRef, {
                    [chatRoomId]: {
                        ...existingNotificationSnapshot.val(),
                        timeStamp: Date.now(),
                    },
                });
            } else {
                // Create a new notification if the existing one doesn't exist or is already seen
                await set(child(notificationRef, chatRoomId), {
                    isSeen: false,
                    timeStamp: Date.now(),
                    sender: sender,
                    chatRoomId: chatRoomId,
                    msgId: msgId,
                    username: username
                });
            }
        }
    }));
};