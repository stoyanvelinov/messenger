import { Avatar, Input } from '@chakra-ui/react';
import { storeImage } from '../../services/image.service';
import PropTypes from 'prop-types';

const ProfileAvatar = ({ name, src, target, updateState }) => {

  const handleUploadImg = async (e) => {
    const img = await storeImage(e.target.files[0], target);
    updateState(img);
  };

  return (
    <label htmlFor='avatar-img'>
      <Avatar
        name={name}
        src={src}
        cursor="pointer"
        size="2xl"
      />
      <Input id='avatar-img' type='file' accept='.jpg,.png,.jpeg' display='none' onChange={(e) => handleUploadImg(e)} />
    </label>
  );
};

ProfileAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string,
  target: PropTypes.string.isRequired,
  updateState: PropTypes.func.isRequired,
};

export default ProfileAvatar;
