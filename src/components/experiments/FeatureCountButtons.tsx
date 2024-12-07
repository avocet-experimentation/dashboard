import { Button, Flex } from '@chakra-ui/react';
import { Treatment } from '@estuary/types';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

type DefinedTreatments = {
  [id: string]: Treatment;
};

export default function FeatureCountButtons({
  definedTreatments,
}: {
  definedTreatments: DefinedTreatments;
}) {
  const { setValue } = useFormContext();

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
          Object.keys(definedTreatments).forEach((id) => {
            const newFlagStates = [...definedTreatments[id].flagStates, {}];
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
          Object.keys(definedTreatments).forEach((id) => {
            const newFlagStates = definedTreatments[id].flagStates;
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
