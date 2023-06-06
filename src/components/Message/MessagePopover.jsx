import { useContext, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Text } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Flex, VStack } from '@chakra-ui/layout';
import { AuthContext } from '../../context/authContext';
import { createReaction, deleteReaction } from '../../services/reactions.service';

const MessagePopover = ({ message, reactions = {}, msgId }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { user, currentChatRoomId } = useContext(AuthContext);
    
    const handleEmojiClick = async (emojiLabel) => {
        const found = Object.values(reactions).find(e => e.reactedUserId === user.uid);
        const alreadyReacted = Object.values(reactions).find(e => e.emojiLabel === emojiLabel);
        console.log(found, 'found');
        console.log('logvamtuka',alreadyReacted);
        console.log(`${emojiLabel} clicked by ${user.uid} in chatRoom ${currentChatRoomId} with msg id ${msgId}`);
        if (!found) {
            console.log('in here55555');
            await createReaction(user.uid, currentChatRoomId, emojiLabel, msgId);
            
        } else if (alreadyReacted) {
            console.log('in here');
            await deleteReaction(found.reactionId, msgId, currentChatRoomId);
        } else {
            console.log('in here2222');
            await deleteReaction(found.reactionId, msgId);
            await createReaction(user.uid, currentChatRoomId, emojiLabel, msgId);
        }
        //if reactionId already in chatroom, delete reactionId, delete the reaction object
        //add reaction=>reaction id to chat room
        //create reaction => {date,user,reactionType,msgId}
        // if (false//reaction in chatroom){
        };
 //ako nqmash found => create reaction}else{ found.emojilabel=== current emojilabel delete reaction, else delete reaction,create reaction
    
    console.log('reactions', Object.values(reactions).map(e => e.emojiLabel));
    return (
        <Popover
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            onOpen={() => setIsPopoverOpen(true)}
            placement='bottom-start'
        >
            <PopoverTrigger>
                <Flex w='30vh' direction='column'>
                    <Box
                        borderRadius='0.2rem'
                        ml='4rem'
                        _hover={{ bg: 'primaryLight' }}
                        transition='background-color 0.5s'
                        cursor='pointer'
                        w='100%'
                    >
                        {message}
                    </Box>
                    <Box
                        borderRadius='0.2rem'
                        ml='4rem'
                        _hover={{ bg: 'primaryLight' }}
                        transition='background-color 0.5s'
                        cursor='pointer'
                        w='100%'
                    >
                        {Object.values(reactions).map(e => { return getEmoji(e.emojiLabel); })}
                    </Box>
                </Flex>
            </PopoverTrigger>
            <PopoverContent w='10rem' bg='primaryDark' border='none' borderRadius='0.4rem'>
                <PopoverBody>
                    <Flex justifyContent='space-around' p='0.1rem'>
                        {['like', 'dislike', 'cry', 'laugh'].map((emojiLabel) => (
                            <Text
                                key={emojiLabel}
                                cursor='pointer'
                                _hover={{ bg: 'primaryLight' }}
                                role='img'
                                borderRadius='0.2rem'
                                aria-label={emojiLabel}
                                onClick={() => handleEmojiClick(emojiLabel)}
                                >
                                {getEmoji(emojiLabel)}
                            </Text>
                        ))}
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
        case 'dislike':
            return '👎';
        case 'cry':
            return '😢';
        case 'laugh':
            return '😄';
        default:
            return '';
    }
};