import { get, push, ref, child, update, onValue } from 'firebase/database';
import { db } from '../config/firebase.config';

/**
Creates General channel in the specified Team and in channels entity in Firebase Realtime Database
@async
@param {string}teamId the id of the team where the channel is created
@returns {Promise<void>} void
*/
export const createGeneralChannel = (teamId) => {
    const channelId = push(child(ref(db), '/channels')).key;
    const channelData = { channelName: 'General', channelId: channelId, channelTeam: teamId };
    const updates = {};

    updates[`/teams/${teamId}/channels/${channelId}`] = true;
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
export const addNewChannel = (channelName, teamId) => {
    const channelId = push(child(ref(db), '/channels')).key;
    const channelData = { channelName: channelName, channelId: channelId, channelTeam: teamId };
    const updates = {};

    updates[`/teams/${teamId}/channels/${channelId}`] = true;
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