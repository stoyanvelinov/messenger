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
    <Avatar {...props} cursor="pointer" >
      {/* <AvatarBadge boxSize='15px' border='none' bg={`${style}`} onClick={e=>openChangeStatus(e)} /> */}
    </Avatar>
  );
};

export default ProfileAvatar;
