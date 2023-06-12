import { IconButton, Box, Input, useOutsideClick, useToast, PopoverTrigger, PopoverBody, PopoverContent, Portal, PopoverHeader, PopoverCloseButton, FormControl, FormHelperText, Popover, Tooltip } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_NAME_MIN_LENGTH } from '../../common/constants.js';
import { addNewChannel } from '../../services/channels.service';
import { useParams } from 'react-router-dom';


const CreateNewChannel = () => {
    const newChannelInput = useRef();
    const [channelName, setChannelName] = useState('');
    const toast = useToast();
    const { teamId } = useParams();

    useOutsideClick({
        ref: newChannelInput,
        handler: () => {
            setChannelName('');
            newChannelInput.current.value = '';
        },
    });

    const handleChange = (e) => {
        //prevents creation of channel with no name after having input, deleting it and hitting Enter
        if (e.target.value.length > 0) {
            setChannelName(e.target.value);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            try {
                e.preventDefault();
                if (channelName && (channelName.length < CHANNEL_NAME_MIN_LENGTH || channelName.length > CHANNEL_NAME_MAX_LENGTH)) {
                    throw new Error(`Channel name should be between ${CHANNEL_NAME_MIN_LENGTH} and ${CHANNEL_NAME_MAX_LENGTH} symbols!`);
                }
                await addNewChannel(channelName, teamId);
            } catch (error) {
                toast({
                    title: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-left'
                });
            }
        }
    };

    return (<Popover>
        <PopoverTrigger>
            <span><Tooltip label="create channel">
                <IconButton
                    bg="accent"
                    size="xs"
                    _hover={{ bg: 'primaryLight', color: 'primaryDark' }}
                    onClick={() => { }}
                    icon={<AddIcon />} />
            </Tooltip>
            </span>
        </PopoverTrigger>
        <Portal>
            <PopoverContent textAlign="center" w="250px">
                <PopoverCloseButton />
                <PopoverHeader as="h2" bg="primaryLight" fontWeight="bold" letterSpacing={2}>CREATE&nbsp; CHANNEL</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody bg='primary'>
                    <form onSubmit={handleKeyDown}>
                        <FormControl display="flex" flexDirection="column" gap="1rem">
                            <Box>
                                <Input
                                    w="90%"
                                    placeholder="Channel Name"
                                    ref={newChannelInput}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="off" />
                                <FormHelperText color="primaryLight">between 3 and 40 symbols</FormHelperText>
                            </Box>
                        </FormControl>
                    </form>
                </PopoverBody>
            </PopoverContent>
        </Portal>
    </Popover>);
};

export default CreateNewChannel;