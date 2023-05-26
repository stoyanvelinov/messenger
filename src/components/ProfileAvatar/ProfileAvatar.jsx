import { Avatar, AvatarBadge } from '@chakra-ui/react';
import { STATUS } from '../common/status';

const ProfileAvatar = (props) => {

    let style;

    switch (props.status) {
    case STATUS.ONLINE:
    style = 'green';
    break;
    case STATUS.DO_NOT_DISTURB:
    style = 'red';
    break;
    default:
    style = 'gray';
    }
    return (
    <Avatar {...props} style={{ cursor: 'pointer' }}>
      <AvatarBadge boxSize='10px' border='none' style={{ backgroundColor: `${style}` }} />
    </Avatar>
    );
};

export default ProfileAvatar;