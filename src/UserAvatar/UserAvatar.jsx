import { Avatar } from '@chakra-ui/react';
import ProfileStatusIcon from '../components/ProfileInfo/ProfileStatusIcon';
import PropTypes from 'prop-types';

const UserAvatar = ({ avatarSize, user }) => {

    return (<Avatar
        position="relative"
        size={avatarSize}
        name={`${user.firstName} ${user.lastName}`}
        status={user.status}
        src={user.avatar}
        cursor="pointer" >
        <ProfileStatusIcon position="absolute" zIndex="5" right="-0.4em" top="1.5em" status={user.status} />
    </Avatar>);
};

UserAvatar.propTypes = {
    avatarSize: PropTypes.string.isRequired,
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        avatar: PropTypes.string.isRequired,
    }).isRequired,
};
export default UserAvatar;