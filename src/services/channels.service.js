import { get, push, ref, child, update, onValue } from 'firebase/database';
import { db } from '../config/firebase.config';
import { addMultipleChatRoomMembers, createChatRoom } from './chat.service';
import { getTeamById } from './teams.service';

/**
Creates General channel in the specified Team and in channels entity in Firebase Realtime Database
@async
@param {string}teamId the id of the team where the channel is created
@returns {Promise<void>} void
*/
export const createGeneralChannel = async (teamId) => {
    const channelId = push(child(ref(db), '/channels')).key;
    const team = await getTeamById(teamId);
    const teamOwner = team.val().teamOwner;
    const chatRoomId = await createChatRoom(teamOwner);
    const channelData = { channelName: 'General', channelId: channelId, channelTeam: teamId, chatRoom: chatRoomId };
    const updates = {};

    updates[`/teams/${teamId}/channels/${channelId}`] = true;
    updates[`/teams/${teamId}/chatRooms/${chatRoomId}`] = true;
    updates[`/channels/${channelId}`] = channelData;

    return update(ref(db), updates);
};

/**
Creates a new channel with the specified name in the specified Team
@async
@param {string}channelName the name of the new channel
@param {string}teamId the id of the team where the channel is added
@returns {Promise<void>} void
*/
export const addNewChannel = async (channelName, teamId) => {
    const channelId = push(child(ref(db), '/channels')).key;
    const team = await getTeamById(teamId);
    const teamOwner = team.val().teamOwner;
    const teamMembers = Object.keys(team.val().members);
    const chatRoomId = await createChatRoom(teamOwner);
    await addMultipleChatRoomMembers(teamMembers, chatRoomId);
    const channelData = { channelName: channelName, channelId: channelId, channelTeam: teamId, chatRoom: chatRoomId };
    const updates = {};

    updates[`/teams/${teamId}/channels/${channelId}`] = true;
    updates[`/teams/${teamId}/chatRooms/${chatRoomId}`] = true;
    updates[`/channels/${channelId}`] = channelData;

    return update(ref(db), updates);
};

/**
Fetches the channel object using the channel's id
@param {string} channelId the id of the channel to fetch
@returns {Promise<Object>} A Promise that resolves to the channel object
 */
export const getChannelById = (channelId) => {
    return get(ref(db, `channels/${channelId}`));
};

/**
 Updates the channel name in the database.
 @async
 @param {string} channelId - The id of the channel to be updated.
 @param {object} form - The new channel name to be saved. It should be an object containing the property to be updated.
 @returns {Promise} - A Promise that resolves when the channel data is successfully updated in the database.
 */
export const updateChannel = (channelId, form) => {
    return update(ref(db, `channels/${channelId}`), {
        ...form
    });
};

/**
Deletes the channel with the specified id within the team that owns it and from the channels entity in Firebase Realtime Database
@async
@param {string}channelId the id of the channel to delete
@param {string}teamId the id of the team from where the channel is deleted
@returns {Promise<void>} void
*/
export const deleteChannel = async (channelId) => {
    try {
        const channelSnapshot = await getChannelById(channelId);
        const channel = channelSnapshot.val();
        const teamId = channel.channelTeam;
        const updates = {};

        updates[`/teams/${teamId}/channels/${channelId}`] = null;
        updates[`/channels/${channelId}`] = null;

        return update(ref(db), updates);
    } catch (e) {
        console.log(e.message);
        throw new Error('Unexpected issue occurred!');
    }
};

/**
 * Retrieves the channel data from the database and invokes a listener function whenever the data changes.
 *
 * @param {string} channelId - The id of the channel whose information is to be retrieved
 * @param {function} listener - The listener function to be invoked when the channel data changes. It receives the updated channel data as an argument.
 * @returns {function} - A function that can be called to unsubscribe the listener.
 */
export const getLiveChannelInfo = (channelId, listener) => {
    // console.log("live info");
    return onValue(
        ref(db, `channels/${channelId}`), snapshot => {
            const data = snapshot.exists() ? snapshot.val() : null;
            listener(data);
        });
};

/**
Fetches all channels that belong to the team with the give id
@param {string}teamId the id of the team
@param {function}listener a callback function that will use the array of channels objects
@returns {function} - A function that can be called to unsubscribe the listener.
 */
export const getLiveChannelsByTeamId = (teamId, listener) => {
    return onValue(ref(db, `/teams/${teamId}/channels`), snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const channelIds = Object.keys(data);
        const channelsPromises = channelIds.map(id => getChannelById(id));
        Promise.all(channelsPromises)
            .then(channelsSnapshot => {
                const channels = channelsSnapshot.map(channel => channel.val());
                listener(channels);
            })
            .catch(e => console.log(e.message));
    });
};