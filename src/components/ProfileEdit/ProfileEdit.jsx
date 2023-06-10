import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ProfileEdit = ({ form, setForm }) => {
  
  const handleChange = (e) => {
    setForm(prev => {
    
      return {
        ...prev,
        [e.target.name]: e.target.value
      };
    });
  };

  return (
    <Flex mt='1rem' alignContent='center' justify='center' flexDirection='column' >
      <FormControl>
        <FormLabel fontSize='sm' mt='0.2rem' opacity='0.5'>First name</FormLabel>
        <Input name='firstName' type='text' value={form.firstName} onChange={(e) => handleChange(e)} />
        <FormLabel fontSize='sm' mt='0.2rem' opacity='0.5'>Last name</FormLabel>
        <Input name='lastName' type='text' value={form.lastName} onChange={(e) => handleChange(e)} />
        <FormLabel fontSize='sm' mt='0.2rem' opacity='0.5'>Username</FormLabel>
        <Input name='username' type='text' value={form.username} onChange={(e) => handleChange(e)} />
        <FormLabel fontSize='sm' mt='0.2rem' opacity='0.5'>Phone</FormLabel>
        <Input name='phone' type='tel' value={form.phone} onChange={(e) => handleChange(e)} />
      </FormControl>
    </Flex>
  );
};

ProfileEdit.propTypes = {
  form: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
};

export default ProfileEdit;