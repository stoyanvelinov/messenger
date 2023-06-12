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
