import { ref, onValue } from '@firebase/database';
import { db } from '../config/firebase.config';
import { getMsgById } from './chat.service';

// export const getLiveUserNotification = (userUid, listener) => {
//     return onValue(ref(db, `/users${userUid}/notifications`), snapshot => {
//         const msgId = Object.keys(data);
//         console.log(msgId,'msgIds');
//         const msgPromises = msgId.map(id => getMsgById(id));
//         Promise.all(msgPromises).then(msgSnapshot => {
//             const messages = msgSnapshot.map(msg => msg.val());
//             listener(messages);
//         });
//     });
// };

export const getLiveUserNotification = (userUid, listener) => {
    const userNotificationsRef = ref(db, `users/${userUid}/notifications`);

    return onValue(userNotificationsRef, snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const notifications = Object.values(data);
        listener(notifications);
    });
};

// export const getLiveMsgByChatRoomId = (chatRoomId, listener) => {
//     return onValue(ref(db, `/chatRooms/${chatRoomId}/messages`), snapshot => {
//         const data = snapshot.exists() ? snapshot.val() : {};
//         const msgId = Object.keys(data);
//         const msgPromises = msgId.map(id => getMsgById(id));
//         Promise.all(msgPromises).then(msgSnapshot => {
//             const messages = msgSnapshot.map(msg => msg.val());
//             listener(messages);
//         });
//     });
// };