export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 20;
export const MIN_FIRST_NAME_LENGTH = 3;
export const MAX_FIRST_NAME_LENGTH = 20;
export const MIN_LAST_NAME_LENGTH = 3;
export const MAX_LAST_NAME_LENGTH = 20;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 20;
export const TOAST_DURATION = 2000;
export const TEAM_NAME_MIN_LENGTH = 3;
export const TEAM_NAME_MAX_LENGTH = 40;
export const CHANNEL_NAME_MIN_LENGTH = 3;
export const CHANNEL_NAME_MAX_LENGTH = 40;

export const emojiArr = ['like', 'cry', 'laugh', 'middleFinger', 'heartEyes'];

export const getEmoji = (label) => {
    switch (label) {
        case 'like':
            return '👍';
        case 'cry':
            return '😢';
        case 'laugh':
            return '😄';
        case 'middleFinger':
            return '🖕';
        case 'heartEyes':
            return '😍';
        default:
            return '';
    }
};

export const SPOONACULAR_API_KEY = '4d7c3d46185740e3ac0b77c5ce5ef069'; //150 calls per day

export const LANDING_TEXT = `Enhance your team's communication and collaboration with our powerful messenger platform. 
Stay connected with your colleagues, exchange ideas, share files, and work together seamlessly. 
Our feature-rich messenger provides a streamlined experience designed to boost productivity and foster teamwork.`;