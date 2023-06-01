import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, DrawerHeader, DrawerCloseButton, DrawerFooter, Input, Button, Flex, Box, FormLabel, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import DeleteTeamAlert from '../DeleteAlert/DeleteAlert';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import { deleteTeam, updateTeam } from '../../services/teams.service';
import PropTypes from 'prop-types';

const TeamUpdate = ({ isDrawerOpen, onDrawerClose, team }) => {
    const { isOpen: isDialogOpen, onClose: onDialogClose, onOpen: onDialogOpen } = useDisclosure();
    const [form, setForm] = useState({
        teamName: team.teamName,
        teamAvatar: team.teamAvatar,
    });

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
            await updateTeam(team.teamId, form);
            onDrawerClose();
        } catch (e) { console.log(e); }
    };

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
                            <Input id="teamName" name="teamName" type="text" value={form.teamName} onChange={handleChange} />
                        </Box>
                        <Button bg="darkRed" _hover={{ bg: 'red' }} onClick={onDialogOpen} >Delete Team</Button>
                        <DeleteTeamAlert isOpen={isDialogOpen} onClose={onDialogClose} deleteFn={deleteTeam} heading="Delete Team" id={team.teamId} />
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