import { Popover, PopoverTrigger, Portal, PopoverContent, PopoverCloseButton, PopoverArrow, HStack, IconButton, Flex, Text, useDisclosure, useOutsideClick } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { HiDotsVertical } from 'react-icons/hi';
import './ChannelUpdate.css';
import DeleteAlert from '../DeleteAlert/DeleteAlert';
import { deleteChannel } from '../../services/channels.service';
import PropTypes from 'prop-types';

const ChannelUpdate = ({ channelId, setIsEditing }) => {
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const setEditMode = () => {
        setIsEditing(true);
    };

    const handleClick = (e) => {
        e.stopPropagation();
    };

    return (<Popover variant="responsive" >
        <PopoverTrigger >
            <IconButton bg="transparent" _hover={{ bg: 'transparent' }} size="sm" onClick={handleClick} icon={<HiDotsVertical />} />
        </PopoverTrigger>
        <Portal w="3rem">
            <PopoverContent textAlign="center" bg="primary" overflow='hidden' onClick={handleClick}>
                <PopoverArrow bg="primary" />
                <PopoverCloseButton size="sm" />
                <Flex direction="column" >
                    <HStack className="active-channel-action" _hover={{ bg: 'primaryMid' }} onClick={setEditMode}>
                        <IconButton variant="default" size="xs" icon={<EditIcon />} />
                        <Text>Edit</Text>
                    </HStack>
                    <HStack w="100%" className="active-channel-action" _hover={{ bg: 'primaryMid' }} onClick={onDialogOpen}>
                        <IconButton variant="default" size="xs" icon={<DeleteIcon />} />
                        <Text>Delete</Text>
                        <DeleteAlert isOpen={isDialogOpen} onClose={onDialogClose}
                            deleteFn={deleteChannel} heading="Delete Channel" id={channelId} />
                    </HStack>
                </Flex>
            </PopoverContent>
        </Portal>
    </Popover>);
};

ChannelUpdate.propTypes = {
    channelId: PropTypes.string.isRequired,
    setIsEditing: PropTypes.func.isRequired
};

export default ChannelUpdate;