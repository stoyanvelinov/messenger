import { Drawer, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Flex, DrawerFooter, Button } from '@chakra-ui/react';
import ChatList from '../ChatList/ChatList';
import PropTypes from 'prop-types';

const DirectMessagesSmallerScreen = ({ isOpen, onClose }) => {

    return (
        <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
            <DrawerContent bg="primary">
                <DrawerCloseButton />
                <DrawerHeader bg="primaryLight">Direct&nbsp; Messages</DrawerHeader>
                <DrawerBody>
                    <Flex direction="column" h="100%">
                        <ChatList />
                    </Flex>
                </DrawerBody>
                <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

DirectMessagesSmallerScreen.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DirectMessagesSmallerScreen;