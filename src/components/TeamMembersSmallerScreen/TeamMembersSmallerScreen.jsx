import {
    IconButton,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverBody,
    PopoverCloseButton,
} from '@chakra-ui/react';
import { HiOutlineUserAdd } from 'react-icons/hi';
import TeamMembers from '../TeamMembers/TeamMembers';

const TeamMembersSmallerScreen = () => {

    return (<Popover closeOnBlur>
        <PopoverTrigger>
            <IconButton
                icon={<HiOutlineUserAdd />}
                bg="transparent"
                _hover={{ color: 'white', bg: 'primaryMid' }}
                border="none"
                aria-label="Options"
                size="md"
                display={{ base: 'flex', xl: 'none' }}
            />
        </PopoverTrigger>
        <Portal>
            <PopoverContent h="12rem" bg='primary' w="15rem">
                <PopoverCloseButton />
                <PopoverBody h="8rem">
                    <TeamMembers />
                </PopoverBody>
            </PopoverContent>
        </Portal>
    </Popover>);
};

export default TeamMembersSmallerScreen;