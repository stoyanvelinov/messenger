import { Popover, PopoverTrigger, Portal, PopoverContent, PopoverCloseButton, PopoverArrow, HStack, IconButton, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { HiDotsVertical } from 'react-icons/hi';
import './ChannelUpdate.css';
import DeleteTeamAlert from '../DeleteAlert/DeleteAlert';
import { deleteChannel } from '../../services/channels.service';
import PropTypes from 'prop-types';

const ChannelUpdate = ({ channelId }) => {
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();

    return (<Popover variant="responsive">
        <PopoverTrigger>
            <IconButton bg="transparent" _hover={{ bg: 'transparent' }} size="sm" icon={<HiDotsVertical />}></IconButton>
        </PopoverTrigger>
        <Portal w="3rem">
            <PopoverContent textAlign="center" bg="primary" overflow='hidden'>
                <PopoverArrow bg="primary" />
                <PopoverCloseButton size="sm" />
                <Flex direction="column" >
                    <HStack className="active-channel-action" _hover={{ bg: 'primaryMid' }}>
                        <IconButton variant="default" size="xs" icon={<EditIcon />} />
                        <Text>Edit</Text>
                    </HStack>
                    <HStack w="100%" className="active-channel-action" _hover={{ bg: 'primaryMid' }} onClick={onDialogOpen}>
                        <IconButton variant="default" size="xs" icon={<DeleteIcon />} />
                        <Text>Delete</Text>
                        <DeleteTeamAlert isOpen={isDialogOpen} onClose={onDialogClose} deleteFn={deleteChannel} heading="Delete Channel" id={channelId} />
                    </HStack>
                </Flex>
            </PopoverContent>
        </Portal>
    </Popover>);
};

ChannelUpdate.propTypes = {
    channelId: PropTypes.string.isRequired,
};

export default ChannelUpdate;