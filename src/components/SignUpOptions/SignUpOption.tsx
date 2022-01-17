import React from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface IProps {
  icon: string;
  title: string;
  body: string;
  to: string;
}

const SignUpOptions: React.FC<IProps> = ({ icon, to, title, body }) => {
  return (
    <Box
      my={"2"}
      cursor="pointer"
      width={["auto", "auto", "50%"]}
      mx={[0, "3", "5"]}
      ml={[0, 0, 0]}
      maxWidth="1xs"
    >
      <Link to={to}>
        <Flex
          px="2"
          height="5.625rem"
          w="min-content"
          width="100%"
          alignItems="center"
          shadow="0px 5px 10px #410E501A"
          justifyContent="space-between"
        >
          <Image
            boxSize="1.875rem"
            mr="2"
            fontSize={4}
            src={icon}
          />
          <Text
            fontFamily="Bahnschrift !important"
            whiteSpace="nowrap"
            textTransform="capitalize"
            textStyle="h6"
          >
            {title}
          </Text>
        </Flex>
        <Text
          fontFamily="MontserratRegular !important"
          textAlign={["center", "left"] }
          mt={3}
          opacity={0.8}
        >
          {body}
        </Text>
      </Link>
    </Box>
  );
};

export default SignUpOptions;
