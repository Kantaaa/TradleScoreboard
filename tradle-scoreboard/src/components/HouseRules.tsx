import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Link as CLink,
  Text,
  ListItem,
  UnorderedList,
  Box,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface HouseRulesProps {
  isOpen: boolean;
  onClose: () => void;
}

const HouseRules = ({ isOpen, onClose }: HouseRulesProps) => {
  const renderPointSystem = () => {
    const points = [7, 6, 5, 4, 3, 2, 0];
    return points.map((point, index) => (
      <ListItem key={index}>{`${point} poeng = ${index + 1}. forsøk`}</ListItem>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>House Rules</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            <Heading size="md">Regler</Heading>
            <Box pl={4}>
              <Text>
                1: Spill{" "}
                <CLink
                  href="https://chakra-ui.com"
                  isExternal
                  textColor={"blue"}
                >
                  Tradle her!
                </CLink>
              </Text>
              <Text>
                2: Under spillet er{" "}
                <CLink
                  href="https://www.google.com/maps/@50.0784563,9.1151992,4.02z?entry=ttu"
                  isExternal
                  textColor={"blue"}
                >
                  Google Maps
                </CLink>{" "}
                det eneste tillatte hjelpemiddelet.{" "}
                <Text as="i">
                  Funksjon til å måle avstand er desverre ikke lov (blir litt
                  for lett).
                </Text>
                <Text as="b"> Kunn øyemål :)</Text>
              </Text>
              <Text>3: Good luck, have fun!</Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalBody>
          <VStack spacing={4} align="start">
            <Heading size="md">Poeng System</Heading>
            <Box pl={4}>
              <Text>
                Poengene teller kun fra ukedager, den med høyeste poeng i
                måneden vinner Vandrepokalen🏆
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalBody>
          <Box pl={4}>
            <UnorderedList>{renderPointSystem()}</UnorderedList>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HouseRules;
