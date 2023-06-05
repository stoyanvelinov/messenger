import { useContext, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Text } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Flex, VStack } from '@chakra-ui/layout';
import { AuthContext } from '../../context/authContext';
import PropTypes from 'prop-types';

const MessagePopover = ({ message, reactions, msgId }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { user, currentChatRoomId } = useContext(AuthContext);
    
    const handleEmojiClick = (emojiLabel) => {
        console.log(`${emojiLabel} clicked by ${user.uid} in chatRoom ${currentChatRoomId} with msg id ${msgId}`);
        // add reaction => msg uid

        
    };
    
    return (
        <Popover
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            onOpen={() => setIsPopoverOpen(true)}
            placement='bottom-start'
        >
            <PopoverTrigger>
                <Flex w='30vh'>
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

MessagePopover.propTypes = {
    message: PropTypes.string.isRequired,
    reactions: PropTypes.arrayOf(
        PropTypes.shape({
            reactionType: PropTypes.string.isRequired,
            userId: PropTypes.string.isRequired
        })
        )
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