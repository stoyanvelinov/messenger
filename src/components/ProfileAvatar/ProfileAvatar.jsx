import { Avatar, Input } from '@chakra-ui/react';
import { storeImage } from '../../services/image.service';

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
        size="xl"
      />
      <Input id='avatar-img' type='file' accept='.jpg,.png,.jpeg' display='none' onChange={(e) => handleUploadImg(e)} />
    </label>
    // <Avatar {...props} cursor="pointer" />

  );
};

export default ProfileAvatar;
{/* <AvatarBadge boxSize='15px' border='none' bg={`${style}`} onClick={e=>openChangeStatus(e)} /> */ }
