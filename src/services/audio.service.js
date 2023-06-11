import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../config/firebase.config';

export const storeAudio = async (audio, target) => {
    // console.log(audio,'ko ima tuka');
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
