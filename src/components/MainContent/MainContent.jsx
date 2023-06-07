import { Box, Flex } from '@chakra-ui/react';
import './MainContent.css';
import { useParams } from 'react-router-dom';
import ChannelsSideBar from '../../routes/ChannelsSideBar/ChannelsSideBar';
import TeamMembers from '../TeamMembers/TeamMembers';
import ChatList from '../ChatList/ChatList';

import ChatRoom from '../ChatRoom/ChatRoom';

const MainContent = () => {
    const { teamId, chatRoomId } = useParams();

    return (
        <Flex className="main-content-box" h="100%" bg="primaryMid">
            <Flex bg="primaryMid" direction="column" display={{ base: 'none', lg: 'flex' }} minW="270px" flexBasis={{ md: '270px', lg: '15%' }} gap="0.8rem">

                {!teamId && <ChatList />}
                {teamId && <ChannelsSideBar />}
            </Flex>
            <Box flexGrow={1} h={{ base: '100%' }} borderRight="1px"
                borderRightColor="primaryLight" borderLeft="1px" borderLeftColor="primaryLight">
                <ChatRoom chatRoomId={chatRoomId} />
            </Box>
            <Box bg="primary" display={{ base: 'none', xl: 'flex' }} minW="200px" flexBasis={{ md: '200px', lg: '10%' }}>
                {teamId && <TeamMembers teamId={teamId} />}
            </Box>
        </Flex>
    );
};

export default MainContent;


//in main flex direction={{ base: 'column', md: 'row' }}
