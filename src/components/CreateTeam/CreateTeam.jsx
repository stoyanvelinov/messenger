import { Box, IconButton, Tooltip, Input, FormControl, FormLabel, FormHelperText, HStack, Popover, PopoverContent, PopoverTrigger, PopoverArrow, PopoverBody, PopoverHeader, PopoverCloseButton, Button, Portal, useDisclosure } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useContext, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH } from '../../common/constants.js';
import { getTeamByName, createTeam, addMemberToTeam } from '../../services/teams.service';
import { storeImage } from '../../services/image.service';
import { AuthContext } from '../../context/authContext';
import { createGeneralChannel } from '../../services/channels.service';

const CreateTeam = () => {
    const toast = useToast();
    const nameInput = useRef();
    const avatarInput = useRef();
    const [form, setForm] = useState({
        teamName: '',
        teamAvatar: ''
    });
    const { user } = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value });
    };

    const updateAvatar = e => {
        setForm({ ...form, teamAvatar: e.target.files[0] });
    };

    const onCreate = async (e) => {
        try {
            e.preventDefault();
            if (form.teamName.length < TEAM_NAME_MIN_LENGTH || form.teamName.length > TEAM_NAME_MAX_LENGTH) {
                throw new Error(`Team name should be between ${TEAM_NAME_MIN_LENGTH} and ${TEAM_NAME_MAX_LENGTH} symbols!`);
            }
            const teamSnapshot = await getTeamByName(form.teamName);
            if (teamSnapshot.exists())
                throw new Error('Team name is already taken!');

            const imgUrl = form.teamAvatar ? await storeImage(form.teamAvatar, form.teamName) : '';
            const teamId = await createTeam(form.teamName, imgUrl, user.uid);
            await createGeneralChannel(teamId);
            await addMemberToTeam(user.uid, teamId);
            onClose();
            setForm({
                teamName: '',
                teamAvatar: ''
            });

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

    const handleClose = () => {
        setForm({
            teamName: '',
            teamAvatar: '',
        });
        avatarInput.current.value = '';
        onClose();
    };

    return (<Popover initialFocusRef={nameInput} isOpen={isOpen} onClose={handleClose} closeOnBlur>
        <PopoverTrigger >
            <span><Tooltip label="Add Team" placement="right">
                <IconButton
                    onClick={onOpen}
                    icon={<TriangleDownIcon boxSize="2em" />}
                    aria-label='create team'
                    bg='accent'
                    borderRadius="50%"
                    boxSize="5em"
                    _hover={{ bg: 'primaryLight', color: 'primaryDark' }}
                /></Tooltip></span>
        </PopoverTrigger>
        <Portal>
            <PopoverContent textAlign="center" bg='primary' >
                <PopoverArrow />
                <PopoverHeader as="h2" bg="primaryLight" fontWeight="bold" letterSpacing={2}>CREATE&nbsp; A&nbsp; NEW&nbsp; TEAM</PopoverHeader>
                <PopoverCloseButton onClick={handleClose} />
                <PopoverBody>
                    <form onSubmit={onCreate}>
                        <FormControl display="flex" flexDirection="column" gap="1rem">
                            <Box>
                                <FormLabel >Team Name*</FormLabel>
                                <Input
                                    id="team-name"
                                    ref={nameInput}
                                    type="text"
                                    bg="primary"
                                    value={form.teamName}
                                    onChange={updateForm('teamName')}
                                    autoComplete="off"
                                    placeholder="Team Name"
                                    required></Input>
                                <FormHelperText color="primaryLight">Name should be between 3 and 40 symbols</FormHelperText>
                            </Box>
                            <Box>
                                <FormLabel >Team Avatar</FormLabel>
                                <Input
                                    id="team-avatar"
                                    ref={avatarInput}
                                    type="file"
                                    bg="primary"
                                    pt="4px"
                                    borderRadius="md"
                                    onChange={updateAvatar}
                                    autoComplete="off"
                                    accept='.jpg,.png,.jpeg' />
                            </Box>
                            <HStack justify="space-evenly">
                                <Button
                                    w="100%"
                                    border="1px"
                                    borderColor="primaryDark"
                                    bg="accent"
                                    type="submit"
                                    _hover={{ color: 'primaryDark' }}>
                                    CREATE</Button>
                            </HStack>
                        </FormControl>
                    </form>
                </PopoverBody>
            </PopoverContent>
        </Portal>
    </Popover>);
};

export default CreateTeam;