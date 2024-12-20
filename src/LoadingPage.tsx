import { HStack, Text, VStack } from "@chakra-ui/react";
import { ProgressCircleRing, ProgressCircleRoot } from "./components/ui/progress-circle";
import LogoBox from "./components/LogoBox";


export default function LoadingPage({message}: {message: string}) {
  return (
    <VStack height="100vh" width="100vw" alignItems="center" justifyContent="center">
      <LogoBox withLine={false} withTitle={false} logoSize="100px"/>
      <HStack>
        <ProgressCircleRoot value={null} size="sm">
          <ProgressCircleRing cap="round" />
        </ProgressCircleRoot>
        <Text fontSize="2xl">{message}</Text> 
      </HStack>
    </VStack>
        
  );
}