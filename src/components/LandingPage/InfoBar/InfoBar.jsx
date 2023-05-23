import { Flex, Box, Text } from "@chakra-ui/react";

const InfoBar = () => {
  const registeredUsers = 1000; // Replace with the actual number of registered users

  return (
    <Flex
      className='info-bar'
      width="10%"
      height="100%"
      bg="primary"
      justifyContent="flex-end"
      alignItems="center"
      flexDirection="column"
    >
      <Box >
        <Text fontSize="xs" color='white' fontWeight="bold">Registered Users: {registeredUsers}</Text>
      </Box>
    </Flex>
  );
};

export default InfoBar;
