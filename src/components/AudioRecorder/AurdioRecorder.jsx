import { useState, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const AudioRecorder = ({ setAudioFile, setIsTextAreaHidden, setAudioBlob, audioBlob }) => {
    const [recording, setRecording] = useState(false);
    
    const mediaRecorderRef = useRef(null);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();

                const audioChunks = [];
                mediaRecorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });

                setRecording(true);
                setIsTextAreaHidden(true);

                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    setAudioBlob(audioBlob);
                    setAudioFile(audioBlob);
                   
                });
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <Box>
        <div>
            {recording ? (
                <button onClick={stopRecording}>Stop</button>
            ) : (
                <button onClick={startRecording}>Start</button>
            )}
            {audioBlob && (
                <audio controls src={URL.createObjectURL(audioBlob)} />
            )}
        </div>
            <Box mt='5px' border='solid' cursor='pointer' onClick={() => { setAudioFile(null); setAudioBlob(null); setIsTextAreaHidden(false); }}></Box>
        </Box>
        
    );
};

export default AudioRecorder;
