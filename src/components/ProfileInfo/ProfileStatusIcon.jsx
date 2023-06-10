import { Icon } from '@chakra-ui/react';
import { STATUS } from '../common/status';
import PropTypes from 'prop-types';


const ProfileStatusIcon = (props) => {
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
        <Icon viewBox='0 0 200 200' color={style} {...props}>
            <path
                fill='currentColor'
                d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
            />
        </Icon>
    );
};

ProfileStatusIcon.propTypes = {
    status: PropTypes.number,
};
export default ProfileStatusIcon;