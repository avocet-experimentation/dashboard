import { Button, Flex } from '@chakra-ui/react';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export default function FlagCountButtons() {
  const { setValue, watch } = useFormContext();
  const experimentDraft = watch();

  return (
    <Flex
      dir="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Button
        border="0px"
        variant="plain"
        background="transparent"
        _hover={{ backgroundColor: 'transparent', color: 'blue' }}
        onClick={() => {
          Object.keys(experimentDraft.definedTreatments).forEach((id) => {
            const newFlagStates = [
              ...experimentDraft.definedTreatments[id].flagStates,
              {},
            ];
            setValue(`definedTreatments.${id}.flagStates`, newFlagStates);
          });
        }}
      >
        <CirclePlus />
        Add new feature
      </Button>
      <Button
        border="0px"
        variant="plain"
        background="transparent"
        _hover={{ backgroundColor: 'transparent', color: 'blue' }}
        onClick={() => {
          Object.keys(experimentDraft.definedTreatments).forEach((id) => {
            const newFlagStates =
              experimentDraft.definedTreatments[id].flagStates;
            newFlagStates.pop();
            setValue(`definedTreatments.${id}.flagStates`, newFlagStates);
          });
        }}
      >
        <CircleMinus />
        Remove last feature
      </Button>
    </Flex>
  );
}
