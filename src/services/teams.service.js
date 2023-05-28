import { db } from '../config/firebase.config';
import { ref, push, child, update, get, query, orderByChild, equalTo, onValue } from 'firebase/database';

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
        name: teamName,
        owner: uid,
        avatar: avatarUrl,
        teamId: teamId
    };
    const updates = {};

    updates[`/teams/${teamId}`] = teamData;
    updates[`/users/${uid}/teams/${teamId}`] = true;
    await update(ref(db), updates);

    return teamId;
};

/**
Fetches the team object using the team's name
@param {string}name the name of the team to fetch
@returns {Promise<Object>} A Promise that resolves to the team object
 */
export const getTeamByName = (name) => {
    return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));
};

/**
Fetches the team object using the team's id
@param {string}teamId the id of the team to fetch
@returns {Promise<Object>} A Promise that resolves to the team object
 */
export const getTeamById = (teamId) => {
    return get((ref(db, `teams/${teamId}`)));
};

/**
Fetches all teams in which the logged user is a member
@param {string}uid the id of the logged user
@param {function}listener a callback function that will use the array of team objects
@returns {Promise<void>}void
 */
export const getLiveTeams = (uid, listener) => {
    return onValue(ref(db, `users/${uid}/teams`), snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        const teamIds = Object.keys(data);
        const myTeamsPromises = teamIds.map(id => getTeamById(id));
        Promise.all(myTeamsPromises).then(snapshot => {
            const teams = snapshot.map(team => team.val());
            listener(teams);
        });
    });
};