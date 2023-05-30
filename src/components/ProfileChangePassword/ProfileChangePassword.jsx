import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ProfileChangePassword = ({ setPassForm }) => {
    const handleChange = (e) => {
        setPassForm((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    return (
        <Flex mt="1rem" alignContent="center" justify="center" flexDirection="column">
            <FormControl>
                <FormLabel fontSize="sm" opacity="0.5">
                    Current Password
                </FormLabel>
                <Input name="currentPass" id="currentPass" type="password" onChange={(e) => handleChange(e)} />
                <FormLabel fontSize="sm" mt="0.2rem" opacity="0.5">
                    New Password
                </FormLabel>
                <Input name="newPass" id="newPass" type="password" onChange={(e) => handleChange(e)} />
                <FormLabel fontSize="sm" mt="0.2rem" opacity="0.5">
                    Confirm Password
                </FormLabel>
                <Input name="confirmPass" id="confirmPass" type="password" onChange={(e) => handleChange(e)} />
            </FormControl>
        </Flex>
    );
};

ProfileChangePassword.propTypes = {
    setPassForm: PropTypes.func.isRequired,
};

export default ProfileChangePassword;
