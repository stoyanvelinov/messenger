import { get, ref, update } from "@firebase/database";
import { db } from "../config/firebase.config";
import { serverTimestamp } from "@firebase/database";

/**
 * Updates the information in the Firebase Realtime Database.
 *
 * @param {string} username - The username of the last registered user.
 * @returns {Promise<void>} A Promise that resolves once the update is completed.
 */
export const updateInfo = async (username) => {
    try {
        const infoRef = ref(db, 'info');
        const snapshot = await get(infoRef);
        const currentInfo = snapshot.val();

        const createdOn = serverTimestamp();
        const registeredCount = currentInfo.registered + 1;

        return update(infoRef, {
            registered: registeredCount,
            createdOn: createdOn,
            lastRegisteredUser: username
        });
    } catch (error) {
        console.error('Error updating info:', error);
    }
};

export const fetchInfo = async () => {
    try {
        const snapshot = await get(ref(db, 'info'));
        const infoData = snapshot.val();
        return infoData;
    } catch (error) {
        console.error('Error fetching info:', error);
        return null;
    }
};

export default fetchInfo;
