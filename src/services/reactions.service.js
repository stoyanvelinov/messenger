import { child, get, onValue, push, ref, update } from '@firebase/database';
import { db } from '../config/firebase.config';

export const createReaction = async (user, chatRoomId, emojiLabel, messageId) => {
    const reactionId = push(child(ref(db), '/reactions')).key;
    const reactionData = {
        reactionId: reactionId,
        reactedUserId: user,
        chatRoomId: chatRoomId,
        timestamp: Date.now(),
        emojiLabel: emojiLabel,
        messageId: messageId
    };
    const updates = {
        [`/messages/${messageId}/reactions/${reactionId}`]: reactionData,
        [`/chatRooms/${chatRoomId}/messages/${messageId}/reactions/${reactionId}`]: true
    };
    await update(ref(db), updates);
    return reactionId;
};

export const getLiveReactionsByChatRoomId = (chatRoomId, listener) => {
    return onValue(ref(db, `/chatRooms/${chatRoomId}/reactions`), snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const reactionId = Object.keys(data);
        const reactionsPromises = reactionId.map(id => getReactionById(id));
        Promise.all(reactionsPromises).then(reactionSnapshot => {
            const reactions = reactionSnapshot.map(reaction => reaction.val());
            console.log(reactions, 'reas');
            listener(reactions);
        });
    });
};

export const getReactionById = (id) => {
    return get(ref(db, `messages/reactions/${id}`));
};


export const deleteReaction = (reactionId, msgId, chatRoomId) => {
    const updates = {};
    updates[`/chatRooms/${chatRoomId}/messages/${msgId}/reactions/${reactionId}`] = null;
    updates[`messages/${msgId}/reactions/${reactionId}`] = null;

    return update(ref(db), updates);
};

