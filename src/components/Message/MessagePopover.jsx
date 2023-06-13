import { useContext, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, Tooltip, Input } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/layout';
import { AuthContext } from '../../context/authContext';
import { createReaction, deleteReaction } from '../../services/reactions.service';
import { DeleteIcon } from '@chakra-ui/icons';
import { emojiArr, getEmoji } from '../../common/constants.js';
import { deleteMsg } from '../../services/chat.service';
import '../AudioRecorder/AudioRecorder.css'; 

const MessagePopover = ({ message, reactions = {}, msgId, timestamp, audioUrl, sender }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { user, userData, currentChatRoomId } = useContext(AuthContext);
    const [isMyMsg, setIsMyMsg] = useState(false);

    const handleEmojiClick = async (emojiLabel) => {
        const found = Object.values(reactions).find(e => e.reactedUserId === user.uid);
        const alreadyReacted = Object.values(reactions).find(e => e.emojiLabel === emojiLabel);
        if (!found) {
            await createReaction(user.uid, currentChatRoomId, emojiLabel, msgId, userData.username);

        } else if (alreadyReacted) {
            await deleteReaction(found.reactionId, msgId, currentChatRoomId);
        } else {
            await deleteReaction(found.reactionId, msgId, currentChatRoomId);
            await createReaction(user.uid, currentChatRoomId, emojiLabel, msgId, userData.username);
        }
    };
    const handlePopoverClick = () => {
        if (sender === user.uid) {
            setIsMyMsg(true);
        }
    };

    const handleDeleteMsg = async () => {
        await deleteMsg(msgId, currentChatRoomId);
    };


    return (
        <div onScroll={() => setIsPopoverOpen(false)}>
        <Popover
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            onOpen={() => setIsPopoverOpen(true)}
            placement='top-start'
        >
            <PopoverTrigger>
                <Flex w='30vh' direction='column'>
                    <Box
                        borderRadius='0.2rem'
                        ml='4rem'
                        _hover={{ bg: 'primary' }}
                        transition='background-color 0.5s'
                        cursor='pointer'
                        w='100%'
                        onClick={handlePopoverClick}
                    >
                        <Tooltip
                            backgroundColor={'primaryLight'}
                            label={new Date(parseInt(timestamp)).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            placement='left'
                        >
                            {message ? (
                                <Text opacity={0.8}>{message} </Text>
                            ) : (
                                <audio controls id='audio-controls'>
                                    <source src={audioUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </Tooltip>
                        <Flex direction='row'>
                            {Object.values(reactions).map((e) => (
                                <Tooltip
                                    key={e.reactionId}
                                    fontSize='1.2rem'
                                    label={e.username}
                                    backgroundColor={'primary'}
                                    placement='bottom'
                                >
                                    <Text fontSize='1.2rem'>{getEmoji(e.emojiLabel)}</Text>
                                </Tooltip>
                            ))}
                        </Flex>
                    </Box>
                </Flex>
            </PopoverTrigger>
            <PopoverContent w='10rem' bg='primaryDark' border='none' borderRadius='0.4rem'>
                <PopoverBody>
                    {isMyMsg ? (
                        <Flex justifyContent='space-around' p='0.1rem'>
                            <DeleteIcon boxSize='1.4rem' cursor='pointer' onClick={handleDeleteMsg} />
                            {/* <EditIcon boxSize='1.4rem' cursor='pointer' onClick={()=>setEditMode(true)} /> */}
                        </Flex>
                    ) : (
                        <Flex justifyContent='space-around' p='0.1rem'>
                            {emojiArr.map((emojiLabel) => (
                                <Text
                                    key={emojiLabel}
                                    cursor='pointer'
                                    _hover={{ bg: 'primaryLight' }}
                                    role='img'
                                    borderRadius='0.2rem'
                                    fontSize='1.3rem'
                                    aria-label={emojiLabel}
                                    onClick={() => handleEmojiClick(emojiLabel)}
                                >
                                    {getEmoji(emojiLabel)}
                                </Text>
                            ))}
                        </Flex>
                    )}
                </PopoverBody>
            </PopoverContent>
            </Popover>
        </div>
    );
};


export default MessagePopover;

