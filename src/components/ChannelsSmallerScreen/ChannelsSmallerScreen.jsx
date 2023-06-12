import {
    Drawer,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    DrawerHeader,
    DrawerFooter,
    IconButton,
    useDisclosure,
    Flex,
    Button
} from '@chakra-ui/react';
import { HiOutlineUserGroup } from 'react-icons/hi';
import ChannelsSideBar from '../ChannelsSideBar/ChannelsSideBar';


const ChannelsSmallerScreen = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (<><IconButton
        bg="transparent"
        size="md"
        _hover={{ color: 'white', bg: 'primaryMid' }}
        onClick={onOpen}
        display={{ base: 'none', md: 'flex', lg: 'none', xl: 'none', '2xl': 'none' }}
        icon={<HiOutlineUserGroup size="1.3em" />}></IconButton >
        <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
            <DrawerContent bg="primary">
                <DrawerCloseButton />
                <DrawerHeader></DrawerHeader>
                <DrawerBody>
                    <Flex direction="column" h="100%">
                        <ChannelsSideBar />
                    </Flex>
                </DrawerBody>
                <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>);
};

export default ChannelsSmallerScreen;