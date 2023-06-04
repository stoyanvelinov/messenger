import { Box, Flex } from '@chakra-ui/react';
import './MainContent.css';
import { useParams } from 'react-router-dom';
import ChannelsSideBar from '../../routes/ChannelsSideBar/ChannelsSideBar';
import ChatList from '../ChatList/ChatList';
// import ChatRoom from '../ChatRoom/Chatroom';

import ChatRoom from '../ChatRoom/ChatRoom';

const MainContent = () => {
    const { teamId, chatRoomId } = useParams();

    return (
        <Flex className="main-content-box" h="100%" bg="primaryMid"  >
            <Flex bg="primary" direction="column" display={{ base: 'none', lg: 'flex' }} minW="250px" flexBasis={{ md: '250px', lg: '15%' }} gap={2}>
               
                { !teamId && <ChatList /> }
                { teamId && <ChannelsSideBar /> }
            </Flex>
            <Box flexGrow={1} h={{ base: '100%' }} borderRight="1px"
                borderRightColor="primaryLight" borderLeft="1px" borderLeftColor="primaryLight">
                    <ChatRoom chatRoomId={chatRoomId} />
            </Box>
            <Box bg="primary" display={{ base: 'none', xl: 'flex' }} minW="250px" flexBasis={{ md: '250px', lg: '15%' }}>Some text</Box>
        </Flex>
    );
};

export default MainContent;


//in main flex direction={{ base: 'column', md: 'row' }}
