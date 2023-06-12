import { Grid, Drawer, DrawerContent, DrawerCloseButton, DrawerBody, DrawerHeader, DrawerFooter, Button, Flex, IconButton } from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { getLiveTeams } from '../../services/teams.service';
import { AuthContext } from '../../context/authContext';
import { useParams, useNavigate } from 'react-router-dom';
import ChannelsSideBar from '../ChannelsSideBar/ChannelsSideBar';
import TeamButton from '../TeamButton/TeamButton';
import ChatList from '../ChatList/ChatList';
import './SmallScreenMenu.css';
import CreateTeam from '../CreateTeam/CreateTeam';
import { HiOutlineUserGroup } from 'react-icons/hi';
import PropTypes from 'prop-types';

const SmallScreenMenu = ({ isOpen, onClose }) => {
    const [teamIds, setTeamIds] = useState([]);
    const { user } = useContext(AuthContext);
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('teams');

    useEffect(() => {
        const unsub = getLiveTeams(user.uid, (t) => setTeamIds([...t]));
        return () => unsub();
    }, [user.uid]);

    const onOpenTeam = (e) => {
        const id = e.target.closest('span').getAttribute('data-team-id');
        navigate(`/teams/${id}`);
    };

    const handleClickOnMessages = () => {
        navigate('/messages');
        document.querySelector('#tms').classList.remove('open');
        document.querySelector('#msgs').classList.add('open');
        setActiveTab('messages');
    };
    const handleClickOnTeams = () => {
        navigate('/');
        document.querySelector('#msgs').classList.remove('open');
        document.querySelector('#tms').classList.add('open');
        setActiveTab('teams');
    };

    const showTeamsOrChannels = () => {
        //a team is open, show its channels
        if (teamId) return (
            <Flex direction="column" h="100%">
                <ChannelsSideBar />
            </Flex>
        );
        //no team is open, show all teams
        return <Grid templateColumns="repeat(auto-fit, minmax(calc(5em), 1fr))" justifyItems="start" alignItems="center" gap={6} h="100%" mt="2.5rem">
            <CreateTeam />
            {teamIds.length > 0 && teamIds.map(teamId => {
                return <TeamButton key={teamId} onOpen={onOpenTeam} teamId={teamId} uid={user.uid} />;
            })}
        </Grid>;
    };

    return (
        <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
            <DrawerContent bg="primary" w="inherit">
                <DrawerCloseButton />
                <DrawerHeader>
                    <Flex gap="1rem" justifyContent="center" alignItems="flex-start">
                        <IconButton id="msgs" bg="transparent" _hover={{ bg: 'transparent' }} onClick={handleClickOnMessages} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126
                             2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76
                              3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>}>
                        </IconButton>
                        <IconButton id="tms" bg="transparent" _hover={{ bg: 'transparent' }} onClick={handleClickOnTeams} className="active" icon={<HiOutlineUserGroup size="2.5em" />} />
                    </Flex>
                </DrawerHeader>
                <DrawerBody w="inherit">
                    {activeTab === 'teams' ?
                        showTeamsOrChannels() :
                        <ChatList />}
                </DrawerBody>
                <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >
    );
};

SmallScreenMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SmallScreenMenu;
