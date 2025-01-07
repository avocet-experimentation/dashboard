import { ExperimentGroup } from '@avocet/core';
import { Flex, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useExperimentContext } from './ExperimentContext';

interface DragTreatment {
  id: string;
  index: number;
}

interface SortableTreatmentProp {
  id: string;
  name: string;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  deleteItem: (itemIndex: number) => void;
}

const ItemType = 'LIST_ITEM';

function SortableTreatmentCard({
  id,
  name,
  index,
  moveItem,
  deleteItem,
}: SortableTreatmentProp) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragTreatment>({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <HStack
      alignItems="center"
      ref={ref}
      bg={isDragging ? 'avocet-dragging' : 'avocet-section'}
      p={4}
      mb={2}
      borderRadius="5px"
      cursor="grab"
      opacity={isDragging ? 0.5 : 1}
    >
      <Flex
        bg="avocet-bg"
        color="avocet-text"
        width="20px"
        height="20px"
        padding="2.5px"
        border="1px solid"
        borderRadius="5px"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="0.75rem">{index + 1}</Text>{' '}
      </Flex>
      <Text>{name}</Text>
      <IconButton
        aria-label={`Delete treatment: ${name}`}
        bg="transparent"
        color="avocet-error-fg"
        _hover={{ bg: 'avocet-error-bg', color: 'avocet-error-fg' }}
        marginLeft="auto"
        onClick={() => deleteItem(index)}
      >
        <Trash2 />
      </IconButton>
    </HStack>
  );
}

export default function SortableTreatmentList({
  group,
}: {
  group: ExperimentGroup;
}) {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();

  const treatmentSequence = group.sequence.map((treatmentId) => ({
    id: treatmentId,
    name: experiment?.definedTreatments[treatmentId].name,
  }));

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedSequence = [...group.sequence];
    const [movedSequence] = updatedSequence.splice(fromIndex, 1);
    updatedSequence.splice(toIndex, 0, movedSequence);
    group.sequence = updatedSequence;
    mutate({ groups: experiment.groups });
  };

  const deleteItem = (itemIndex: number) => {
    const currentSequence = group.sequence;
    const mutatedSequence = [
      ...currentSequence.slice(0, itemIndex),
      ...currentSequence.slice(itemIndex + 1),
    ];
    group.sequence = mutatedSequence;
    mutate({ groups: experiment.groups });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <VStack gap={2.5} align="stretch">
        {treatmentSequence.map((treatment, index) => (
          <SortableTreatmentCard
            key={treatment.id}
            id={treatment.id}
            name={treatment.name}
            index={index}
            moveItem={moveItem}
            deleteItem={deleteItem}
          />
        ))}
      </VStack>
    </DndProvider>
  );
}
