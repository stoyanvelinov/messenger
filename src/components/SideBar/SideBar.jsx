import { Tooltip, Text, Flex, Divider, Image, useDisclosure } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getLiveTeams } from '../../services/teams.service';
import './SideBar.css';
import messageIcon from '../../assets/icons/icon-msg.png';
import messageIconHover from '../../assets/icons/icon-msg-hover.png';
import { useNavigate } from 'react-router-dom';
import TeamButton from '../TeamButton/TeamButton';
import CreateTeam from '../CreateTeam/CreateTeam';
import { useMediaQuery } from '@chakra-ui/react';
import DirectMessagesSmallerScreen from '../DirectMessagesSmallerScreen/DirectMessagesSmallerScreen';

const SideBar = () => {
    const { user, setUser } = useContext(AuthContext);
    const [teamIds, setTeamIds] = useState([]);
    const [iconMsg, setIconMsg] = useState(messageIcon);
    const navigate = useNavigate();
    const [isSmallerThan991] = useMediaQuery('(max-width: 991px)');
    const { isOpen, onClose, onOpen } = useDisclosure();


    useEffect(() => {
        const unsub = getLiveTeams(user.uid, (t) => setTeamIds([...t]));
        return () => unsub();
    }, [user.uid]);

    const onOpenTeam = (e) => {
        const teamId = e.target.closest('span').getAttribute('data-team-id');
        navigate(`/teams/${teamId}`);
    };

    const onOpenDirectMessages = () => {
        navigate('/messages/');
        setUser((prev) => ({
            ...prev,
            currentChatRoomId: null
        }));

        if (isSmallerThan991) onOpen();
    };

    return (
        <Flex
            bg="primaryDark"
            borderRight="1px"
            borderRightColor="primaryLight"
            display={{ base: 'none', md: 'block' }}
            w={{ md: '7rem' }}
            overflowY="hidden"
            overflowX="hidden"
        >
            <Text
                display="flex"
                fontSize="2xl"
                fontWeight="bold"
                p={4}
            >
                Logo
            </Text>
            <Flex direction="column" p={2} gap="1rem" >
                <span>
                    <Tooltip label='Direct Messages' openDelay={300} placement="right">
                        <Image src={iconMsg}
                            boxSize='5em'
                            cursor="pointer"
                            onMouseEnter={() => setIconMsg(messageIconHover)}
                            onMouseOut={() => setIconMsg(messageIcon)}
                            onClick={onOpenDirectMessages}
                            alt='message icon' />
                    </Tooltip>
                </span>
                <DirectMessagesSmallerScreen isOpen={isOpen} onClose={onClose} />
                <span>
                    <Divider />
                </span>
                <CreateTeam />
            </Flex>
            <Flex id="teams" p={2} direction="column" gap="1rem" overflowY="auto" overflowX="hidden">
                {teamIds.length > 0 && teamIds.map(teamId => {
                    return <TeamButton key={teamId} onOpen={onOpenTeam} teamId={teamId} uid={user.uid} />;
                })}
            </Flex>
        </ Flex>
    );
};

export default SideBar;