import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../config/firebase.config';
/**
 * Stores an audio file in the Firebase Storage.
 * @param {Blob | Uint8Array} audio - The audio file to be stored.
 * @param {string} target - The chat room ID associated with the audio file.
 * @returns {Promise<string>} A Promise that resolves to the download URL of the stored audio file.
 * @throws {Error} If there is an error during the storage process.
 */
export const storeAudio = async (audio, target) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = `${target}-${uuidv4()}`;
        const storageRef = ref(storage, 'audios/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, audio);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};
