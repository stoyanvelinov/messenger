import {
    MAX_FIRST_NAME_LENGTH,
    MAX_LAST_NAME_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_FIRST_NAME_LENGTH,
    MIN_LAST_NAME_LENGTH,
    MIN_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
} from './constants';

export const validateForm = (form) => {
    const { firstName, lastName, username, password } = form;
    const errors = {};

    if (!firstName) {
        errors.firstName = 'First name is required';
    } else if (firstName.length < MIN_FIRST_NAME_LENGTH || firstName.length > MAX_FIRST_NAME_LENGTH) {
        errors.firstName = `First name must be between ${MIN_LAST_NAME_LENGTH} and ${MAX_LAST_NAME_LENGTH} characters`;
    }

    if (!lastName) {
        errors.lastName = 'Last name is required';
    } else if (lastName.length < MIN_LAST_NAME_LENGTH || lastName.length > MAX_LAST_NAME_LENGTH) {
        errors.lastName = `Last name must be between ${MIN_LAST_NAME_LENGTH} and ${MAX_LAST_NAME_LENGTH} characters`;
    }

    if (!username) {
        errors.username = 'Username is required';
    } else if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
        errors.username = `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`;
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
        errors.password = `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`;
    }

    return errors;
};
