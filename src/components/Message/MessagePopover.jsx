import { useContext, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, Tooltip, HStack } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/layout';
import { AuthContext } from '../../context/authContext';
import { createReaction, deleteReaction } from '../../services/reactions.service';
import { DeleteIcon, EditIcon, StarIcon } from '@chakra-ui/icons';

const MessagePopover = ({ message, reactions = {}, msgId, timestamp, audioUrl }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { user, userData, currentChatRoomId } = useContext(AuthContext);
    const [isReacting, setIsReacting] = useState(false);

    const handleEmojiClick = async (emojiLabel) => {
        const found = Object.values(reactions).find(e => e.reactedUserId === user.uid);
        const alreadyReacted = Object.values(reactions).find(e => e.emojiLabel === emojiLabel);
        console.log(`${emojiLabel} clicked by ${user.uid} in chatRoom ${currentChatRoomId} on msg with id ${msgId}`);
        if (!found) {
            await createReaction(user.uid, currentChatRoomId, emojiLabel, msgId, userData.username);

        } else if (alreadyReacted) {
            await deleteReaction(found.reactionId, msgId, currentChatRoomId);
        } else {
            await deleteReaction(found.reactionId, msgId, currentChatRoomId);
            await createReaction(user.uid, currentChatRoomId, emojiLabel, msgId, userData.username);
        }
    };





    const renderContent = () => {
        if (message) {
            return (
                <Text opacity={0.8}>{message}</Text>
            );
        }
            return (
                <audio controls>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            );
    };

    return (
        <Popover
            isOpen={isPopoverOpen}
            onClose={() => {setIsPopoverOpen(false); setIsReacting(false)}}
            onOpen={() => setIsPopoverOpen(true)}
            placement='bottom-start'
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
                    >
                        <Tooltip
                            backgroundColor={'primaryLight'}
                            label={new Date(parseInt(timestamp)).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            placement='left'
                        >
                            {renderContent()}
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
                    <Flex justifyContent='space-around' p='0.1rem'>
                        {isReacting && ['like', 'cry', 'laugh', 'middleFinger', 'heartEyes'].map((emojiLabel) => (
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
                        {!isReacting && (
                            <HStack spacing='1.2rem'>
                                    <EditIcon boxSize='1.4rem' cursor='pointer' />
                                <DeleteIcon boxSize='1.4rem' cursor='pointer' />
                                <StarIcon boxSize='1.4rem' cursor='pointer' onClick={() => setIsReacting(true)} />
                            </HStack>
                        )}
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};


export default MessagePopover;

const getEmoji = (label) => {
    switch (label) {
        case 'like':
            return '👍';
        case 'cry':
            return '😢';
        case 'laugh':
            return '😄';
        case 'middleFinger':
            return '🖕';
        case 'heartEyes':
            return '😍';
        default:
            return '';
    }
};