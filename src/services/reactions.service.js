import { child, get, onValue, push, ref, update } from '@firebase/database';
import { db } from '../config/firebase.config';

/**
 * Creates a new reaction for a message and stores it in the Firebase Realtime Database.
 * @param {string} user - The ID of the user who reacted.
 * @param {string} chatRoomId - The ID of the chat room where the message is reacted to.
 * @param {string} emojiLabel - The label of the reacted emoji.
 * @param {string} messageId - The ID of the reacted message.
 * @param {string} username - The username of the user who reacted.
 * @returns {Promise<string>} A Promise that resolves to the ID of the created reaction.
 */
export const createReaction = async (user, chatRoomId, emojiLabel, messageId, username) => {
    const reactionId = push(child(ref(db), '/reactions')).key;
    const reactionData = {
        reactionId: reactionId,
        reactedUserId: user,
        chatRoomId: chatRoomId,
        timestamp: Date.now(),
        emojiLabel: emojiLabel,
        messageId: messageId,
        username: username
    };
    const updates = {
        [`/messages/${messageId}/reactions/${reactionId}`]: reactionData,
        [`/chatRooms/${chatRoomId}/messages/${messageId}/reactions/${reactionId}`]: true
    };
    await update(ref(db), updates);
    return reactionId;
};
/**
 * Retrieves live reactions for a chat room from the Firebase Realtime Database and listens for updates.
 * @param {string} chatRoomId - The ID of the chat room to retrieve reactions for.
 * @param {function} listener - The listener function to be called when reactions are retrieved or updated.
 * @returns {function} A function that can be used to unsubscribe from the listener.
 */
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
/**
 * Retrieves a reaction by its ID from the Firebase Realtime Database.
 * @param {string} id - The ID of the reaction to retrieve.
 * @returns {Promise<DataSnapshot>} A Promise that resolves to the DataSnapshot of the reaction.
 */
export const getReactionById = (id) => {
    return get(ref(db, `messages/reactions/${id}`));
};

/**
 * Deletes a reaction from the Firebase Realtime Database.
 * @param {string} reactionId - The ID of the reaction to delete.
 * @param {string} msgId - The ID of the message where the reaction is stored.
 * @param {string} chatRoomId - The ID of the chat room where the message is located.
 * @returns {Promise<void>} A Promise that resolves when the deletion is complete.
 */
export const deleteReaction = (reactionId, msgId, chatRoomId) => {
    const updates = {};
    updates[`/chatRooms/${chatRoomId}/messages/${msgId}/reactions/${reactionId}`] = null;
    updates[`messages/${msgId}/reactions/${reactionId}`] = null;

    return update(ref(db), updates);
};

