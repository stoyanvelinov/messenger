import { TriangleDownIcon } from '@chakra-ui/icons';
import { Box, useToast, Tooltip, IconButton, Text, Flex, Input, FormControl, FormLabel, FormHelperText, HStack, Avatar, Popover, PopoverContent, PopoverTrigger, PopoverArrow, PopoverBody, PopoverHeader, PopoverCloseButton, Button, Portal } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { storeImage } from '../../services/image.service';
import { createTeam, getLiveTeams, getTeamByName } from '../../services/teams.service';
import { createGeneralChannel } from '../../services/channels.service';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';
import { TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH } from '../../constants/constants';

const SideBar = () => {
    const toast = useToast();
    const { user } = useContext(AuthContext);
    const nameInput = useRef(null);
    const avatarInput = useRef();
    const [form, setForm] = useState({
        teamName: '',
        teamAvatar: '',
    });
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = getLiveTeams(user.uid, (t) => setTeams([...t]));
        return () => unsub();
    }, [user.uid]);

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value });
    };

    const updateAvatar = e => {
        setForm({ ...form, teamAvatar: e.target.files[0] });
    };

    const onCreate = async (e) => {
        e.preventDefault();
        try {
            if (form.teamName.length < TEAM_NAME_MIN_LENGTH || form.teamName.length > TEAM_NAME_MAX_LENGTH) {
                throw new Error('Team name should be between 3 and 40 symbols!');
            }

            const teamSnapshot = await getTeamByName(form.teamName);
            if (teamSnapshot.exists())
                throw new Error('Team name is already taken!');

            const imgUrl = form.teamAvatar ? await storeImage(form.teamAvatar, form.teamName) : '';
            const teamId = await createTeam(form.teamName, imgUrl, user.uid);
            await createGeneralChannel(teamId);

            nameInput.current.value = null;
            avatarInput.current.value = null;

            toast({
                title: 'Team was created!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
        }
    };

    const onOpen = (e) => {
        const teamId = e.target.closest('span').getAttribute('data-team-id');
        navigate(`/teams/${teamId}`);
    };

    return (
        <Box
            bg="primaryDark"
            borderRight="1px"
            borderRightColor="primaryLight"
            display={{ base: 'none', md: 'block' }}
            w={{ md: 20 }}
            pos="fixed"
            h="full"
        // overflowY="scroll"
        // overflowX="hidden"
        >
            <Text
                display="flex"
                fontSize="2xl"
                fontWeight="bold"
                p={4}
            >
                Logo
            </Text>
            <Flex direction="column" p={4} gap="1rem" >
                <Popover initialFocusRef={nameInput} onClose={() => {
                    setForm({
                        teamName: '',
                        teamAvatar: '',
                    });
                    nameInput.current.value = null;
                    avatarInput.current.value = null;
                }} closeOnBlur>
                    <PopoverTrigger>
                        <span><Tooltip label="Add Team" placement="right">
                            <IconButton
                                icon={<TriangleDownIcon />}
                                aria-label='create team'
                                bg='accent'
                                borderRadius="50%"
                                size="lg"
                                _hover={{ bg: 'primaryLight', color: 'primaryDark' }}
                            /></Tooltip></span>
                    </PopoverTrigger>
                    <Portal >
                        <PopoverContent textAlign="center" bg='primaryLight'>
                            <PopoverArrow />
                            <PopoverHeader as="h2" bg="primary" fontWeight="bold" letterSpacing={2}>CREATE&nbsp; A&nbsp; NEW&nbsp; TEAM</PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody>
                                <form onSubmit={onCreate}>
                                    <FormControl display="flex" flexDirection="column" gap="1rem">
                                        <Box>
                                            <FormLabel >Team Name*</FormLabel>
                                            <Input id="team-name" ref={nameInput} type="text" bg="tertiary" value={form.teamName} onChange={updateForm('teamName')} autoComplete="off" placeholder="Team Name" required></Input>
                                            <FormHelperText color="primaryDark">Name should be between 3 and 40 symbols</FormHelperText>
                                        </Box>
                                        <Box>
                                            <FormLabel >Team Avatar</FormLabel>
                                            <Input id="team-avatar" ref={avatarInput} type="file" bg="tertiary" pt="4px" borderRadius="md" onChange={updateAvatar} autoComplete="off" accept='.jpg,.png,.jpeg' />
                                        </Box>
                                        <HStack justify="space-evenly">
                                            <Button w="100%" border="1px" borderColor="primaryDark" bg="accent" type="submit" _hover={{ color: 'primaryDark' }}>CREATE</Button>
                                        </HStack>
                                    </FormControl>
                                </form>
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
                {teams.length > 0 && teams.map(team => {
                    return <span key={team.teamId}><Tooltip label={team.name} placement="right"><Avatar data-team-id={team.teamId} className="team" size="md" name={team.name} src={team.avatar} onClick={onOpen}></Avatar>
                    </Tooltip></span>;
                })}
            </Flex>
        </Box >
    );
};

export default SideBar;