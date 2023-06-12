import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, DrawerHeader, DrawerCloseButton, DrawerFooter, Input, Button, Flex, Box, FormLabel, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import DeleteTeamAlert from '../DeleteAlert/DeleteAlert';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import { deleteTeam, updateTeam } from '../../services/teams.service';
import PropTypes from 'prop-types';
import { useToast } from '@chakra-ui/react';
import { TEAM_NAME_MIN_LENGTH, TEAM_NAME_MAX_LENGTH } from '../../common/constants.js';
import { useNavigate } from 'react-router-dom';

const TeamUpdate = ({ isDrawerOpen, onDrawerClose, team }) => {
    const { isOpen: isDialogOpen, onClose: onDialogClose, onOpen: onDialogOpen } = useDisclosure();
    const [form, setForm] = useState({
        teamName: team.teamName,
        teamAvatar: team.teamAvatar,
    });
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({
            ...form,
            teamName: e.target.value,

        });
    };
    const updateAvatarState = (newState) => {
        setForm({
            ...form,
            teamAvatar: newState,

        });
    };
    const handleSave = async () => {
        try {
            if (form.teamName.length < TEAM_NAME_MIN_LENGTH || form.teamName.length > TEAM_NAME_MAX_LENGTH) {
                throw new Error(`Team name should be between ${TEAM_NAME_MIN_LENGTH} and ${TEAM_NAME_MAX_LENGTH} symbols!`);
            }
            await updateTeam(team.teamId, form);
            onDrawerClose();
            toast({
                title: 'Team was successfully updated!',
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

    const handleDeleteTeam = () => {
        deleteTeam(team.teamId);
        navigate('/');
    };

    //to reset input fields if text was changed but drawer was closed without clicking Save
    const onHideDrawer = () => {
        onDrawerClose();
        setForm({
            ...form,
            teamName: team.teamName,
        });
    };

    return (
        <Drawer
            isOpen={isDrawerOpen}
            placement="left"
            onClose={onHideDrawer}
        >
            <DrawerOverlay />
            <DrawerContent bg="primary">
                <DrawerCloseButton />
                <DrawerHeader bg="primaryLight" >Team&nbsp; Details</DrawerHeader>
                <DrawerBody>
                    <Flex direction="column" alignItems="center" gap={6}>
                        <ProfileAvatar
                            name={form.teamName}
                            src={form.teamAvatar}
                            target={form.teamName}
                            updateState={updateAvatarState}
                        />
                        <Box>
                            <FormLabel fontSize="sm" opacity="0.5">Team Name</FormLabel>
                            <Input id="teamName" name="teamName" type="text" value={form.teamName} onChange={handleChange} autoComplete="off" />
                        </Box>
                        <Button bg="darkRed" _hover={{ bg: 'red' }} onClick={onDialogOpen} >Delete Team</Button>
                        <DeleteTeamAlert isOpen={isDialogOpen} onClose={onDialogClose} deleteFn={handleDeleteTeam} heading="Delete Team" id={team.teamId} />
                    </Flex>
                </DrawerBody>
                <DrawerFooter>
                    <Button variant="outline" _hover={{ bg: 'primaryMid' }} mr={3} onClick={onHideDrawer}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} colorScheme="blue" _hover={{ bg: 'primaryLight' }}>Save</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default TeamUpdate;

TeamUpdate.propTypes = {
    isDrawerOpen: PropTypes.bool,
    onDrawerClose: PropTypes.func,
    team: PropTypes.shape({
        teamId: PropTypes.string.isRequired,
        teamName: PropTypes.string.isRequired,
        teamAvatar: PropTypes.string.isRequired,
    }),
};