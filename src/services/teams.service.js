import { db } from '../config/firebase.config';
import { ref, push, child, update, get, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { deleteChannel } from './channels.service';
import { removeChatRoom, removeChatRoomMember } from './chat.service';

/**
Creates a new team and adds its id to the teams of the logged user and in teams entity in Firebase Realtime Database
@async
@param {string}teamName the name of the new team
@param {string}avatarUrl the image url provided by Firebase Storage or an empty string
@param {string}uid the uid of the logged user
@returns {Promise<string>} A Promise that resolves to the id of the new team
*/
export const createTeam = async (teamName, avatarUrl, uid) => {
    const teamId = push(child(ref(db), '/teams')).key;
    const teamData = {
        teamName: teamName,
        teamOwner: uid,
        teamAvatar: avatarUrl,
        teamId: teamId,
    };
    const updates = {};

    updates[`/teams/${teamId}`] = teamData;
    await update(ref(db), updates);

    return teamId;
};

/**
Deletes team from database along with its channels
@async
@param {string}teamId the id of the team to be deleted
@returns {Promise} - A Promise that resolves when the team is successfully deleted
@throws {Error} - Error deleting team or any of its channels
 */
export const deleteTeam = async (teamId) => {
    try {
        // remove all team's chatRooms
        const teamChatRoomsSnapshot = await getTeamChatRooms(teamId);
        const teamChatRooms = Object.keys(teamChatRoomsSnapshot.val());
        const removeChatRoomsPromises = teamChatRooms.map((chatRoomId)=>{
            removeChatRoom(chatRoomId);
        });
        await Promise.all(removeChatRoomsPromises);

        // remove all team's channels
        const teamSnapshot = await getTeamById(teamId);
        const team = teamSnapshot.val();
        const owner = team.teamOwner;
        const channelIds = Object.keys(team.channels);
        const channels = channelIds.map(channelId => {
            deleteChannel(channelId, teamId);
        });
        await Promise.all(channels);

        // remove team from members records
        const memberIds = Object.keys(team.members);
        const members = memberIds.map(uid => {
            removeMemberFromTeam(uid, teamId);
        });
        await Promise.all(members);

        const updates = {};
        updates[`/teams/${teamId}`] = null;
        updates[`/users/${owner}/teams/${teamId}`] = null;

        return update(ref(db), updates);
    } catch (e) {
        console.log(e.message);
        throw new Error('Unexpected error!');
    }

};

/**
 Updates the team data in the database.
 @async
 @param {string} teamId - The id of the team to be updated.
 @param {object} form - The updated team data to be saved. It should be an object containing the properties to be updated.
 @returns {Promise} - A Promise that resolves when the team data is successfully updated in the database.
 */
export const updateTeam = (teamId, form) => {
    return update(ref(db, `teams/${teamId}`), {
        ...form
    });
};

/**
Fetches the team object using the team's name
@async
@param {string}teamName the name of the team to fetch
@returns {Promise<Object>} A Promise that resolves to the team object
 */
export const getTeamByName = (teamName) => {
    return get(query(ref(db, 'teams'), orderByChild('teamName'), equalTo(teamName)));
};

/**
Fetches the team object using the team's id
@async
@param {string}teamId the id of the team to fetch
@returns {Promise<Object>} A Promise that resolves to the team object
 */
export const getTeamById = (teamId) => {
    return get((ref(db, `teams/${teamId}`)));
};

/**
 Adds a member to a team.
 @async
 @param {string} uid - The id of the member to add.
 @param {string} teamId - The id of the team to which the member should be added.
 @returns {Promise} A Promise that resolves when the member is successfully added to the team.
 */
export const addMemberToTeam = (uid, teamId) => {
    const updates = {};
    updates[`/users/${uid}/teams/${teamId}`] = true;
    updates[`teams/${teamId}/members/${uid}`] = true;

    return update(ref(db), updates);
};

/**
 Removes a member from a team
 @async
 @param {string} uid - The id of the member to remove
 @param {string} teamId - The id of the team from which to remove the member
 @returns {Promise} A Promise that resolves when the member is successfully removed from the team
 */
export const removeMemberFromTeam = async (uid, teamId) => {
    const teamChatRoomsSnapshot = await getTeamChatRooms(teamId);
    const teamChatRooms = Object.keys(teamChatRoomsSnapshot.val());
    const removeMemberPromises = teamChatRooms.map((chatRoomId)=>{
        removeChatRoomMember(uid, chatRoomId);
    });
    await Promise.all(removeMemberPromises);

    const updates = {};
    updates[`/users/${uid}/teams/${teamId}`] = null;
    updates[`teams/${teamId}/members/${uid}`] = null;

    return update(ref(db), updates);
};

/**
Fetches all teams in which the logged user is a member
@async
@param {string}uid the id of the logged user
@param {function}listener a callback function that will use the array of team objects
@returns {function} - A function that can be called to unsubscribe the listener.
 */
export const getLiveTeams = (uid, listener) => {

    return onValue(ref(db, `users/${uid}/teams`), snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const teamIds = Object.keys(data);
        listener(teamIds);
    });

};

/**
 * Retrieves the team information from the database and invokes a listener function whenever the data changes.
 @async
 @param {string} teamId - The id of the team whose information is to be retrieved
 @param {function} listener - The listener function to be invoked when the team data changes. It receives the updated team data as an argument.
 @returns {function} - A function that can be called to unsubscribe the listener.
 */
export const getLiveTeamInfo = (teamId, listener) => {
    return onValue(ref(db, `teams/${teamId}`), snapshot => {
        const data = snapshot.exists() ? snapshot.val() : null;
        listener(data);
    });
};

/**
Retrieves live team member ids for a given team id.
@async
@param {string} teamId - The id of the team.
@param {function} listener - The callback function to handle the retrieved member ids. It receives an array of member ids as the argument.
@returns {function} - A function that can be called to unsubscribe the listener.
*/
export const getLiveTeamMemberIds = (teamId, listener) => {
    return onValue(ref(db, `teams/${teamId}/members`), snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const memberIds = Object.keys(data);
        listener(memberIds);
    });
};

export const getTeamChatRooms = (teamId) => {
    return get((ref(db, `teams/${teamId}/chatRooms/`)));
};

