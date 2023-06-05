import { Flex, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import fetchInfo from "../../../services/infoBar.service";

const InfoBar = () => {
  const [infoForm, setInfoForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoData = await fetchInfo();
        setInfoForm(infoData);
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  return (
    <Flex
      className="info-bar"
      width="10%"
      height="100%"
      bg="primary"
      justifyContent="flex-end"
      alignItems="center"
      flexDirection="column"
    >
      <Box>
        <Text fontSize="xs" color="white" fontWeight="bold">
          Registered Users: {infoForm.registered}
        </Text>
        <Text fontSize="xs" color="white" fontWeight="bold">
          Created On: {formatDate(infoForm.createdOn)}
        </Text>
        <Text fontSize="xs" color="white" fontWeight="bold">
          Last Registered User: {infoForm.lastRegisteredUser}
        </Text>
      </Box>
    </Flex>
  );
};

export default InfoBar;
