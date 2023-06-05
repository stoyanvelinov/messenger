import { Flex, Text, HStack, useDisclosure } from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';
import { useContext, useEffect, useState } from 'react';
import { getLiveUserData } from '../../services/users.service';
import { FiLoader } from 'react-icons/fi';
import { CloseIcon } from '@chakra-ui/icons';
import './TeamMember.css';
import RemoveMemberDialog from '../RemoveMemberDialog/RemoveMemberDialog';
import PropTypes from 'prop-types';
import UserAvatar from '../../UserAvatar/UserAvatar';


const TeamMember = ({ uid, avatarSize, team }) => {
    const { user } = useContext(AuthContext);
    const [member, setMember] = useState(null);
    const { isOpen, onClose, onOpen } = useDisclosure();
    useEffect(() => {
        const unsubscribe = getLiveUserData(uid, m => setMember(m));
        return () => unsubscribe();
    }, [uid]);

    if (member === null) return <FiLoader />;

    return (<Flex className="team-member" justifyContent="space-between" alignItems="center" gap="0.6rem" px="0.7rem" py="0.2rem" fontSize="1.3rem"
        lineHeight="2.6rem">
        <HStack gap="0.1rem">
            <UserAvatar avatarSize={avatarSize} user={member} />
            <Text as="span">{member.username}</Text>
        </HStack>
        {team.teamOwner === user.uid && team.teamOwner !== uid &&
            <CloseIcon cursor="pointer" className="remove-btn" display="none" onClick={onOpen} />}
        <RemoveMemberDialog isOpen={isOpen} onClose={onClose} uid={uid} teamId={team.teamId}
            heading="Remove Member" message="Are you sure you want to remove the member?" />
    </Flex>
    );
};

export default TeamMember;

TeamMember.propTypes = {
    uid: PropTypes.string.isRequired,
    avatarSize: PropTypes.string.isRequired,
    team: PropTypes.shape({
        teamId: PropTypes.string.isRequired,
        teamOwner: PropTypes.string.isRequired,
    }).isRequired,
};