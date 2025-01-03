import { toastError, toastSuccess } from '#/components/ui/toaster';
import { getRequestFunc, UPDATE_EXPERIMENT } from '#/lib/graphql-queries';
import { Experiment, ExperimentGroup } from '@avocet/core';
import { Box, Flex, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Treatment {
  id: string;
  name: string;
}

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

// Draggable List Item Component
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
      bg={isDragging ? 'gray.200' : 'whitesmoke'}
      p={4}
      mb={2}
      borderRadius="5px"
      cursor="grab"
      opacity={isDragging ? 0.5 : 1}
    >
      <Flex
        bg="white"
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
        color="red"
        marginLeft="auto"
        onClick={() => deleteItem(index)}
      >
        <Trash2 />
      </IconButton>
    </HStack>
  );
}

// Main Sortable List Component
export default function SortableTreatmentList({
  experiment,
  group,
  idx,
}: {
  experiment: Experiment;
  group: ExperimentGroup;
  idx: number;
}) {
  const { mutate } = useMutation({
    mutationFn: async (groups: ExperimentGroup[]) => {
      getRequestFunc(UPDATE_EXPERIMENT, {
        partialEntry: {
          groups: groups,
          id: experiment.id,
        },
      })();
    },
    mutationKey: ['experiment', experiment.id],
    onSuccess: () => {
      toastSuccess(`${group.name}'s treatments reordered successfully.`);
    },
    onError: () => {
      toastError('Could not update the experiment at this time.');
    },
  });

  const [treatmentSequence, setTreatmentSequence] = useState(
    group.sequence.map((treatmentId) => ({
      id: treatmentId,
      name: experiment.definedTreatments[treatmentId].name,
    })),
  );

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedSequence = [...treatmentSequence];
    const [movedSequence] = updatedSequence.splice(fromIndex, 1);
    updatedSequence.splice(toIndex, 0, movedSequence);
    setTreatmentSequence(updatedSequence);
  };

  const deleteItem = (itemIndex: number) => {
    setTreatmentSequence((prevSequence) => [
      ...prevSequence.slice(0, itemIndex),
      ...prevSequence.slice(itemIndex + 1),
    ]);
  };

  useEffect(() => {
    const currentSequence = experiment.groups[idx].sequence;
    const mutatedSequence = treatmentSequence.map(({ id }) => id);
    if (currentSequence != mutatedSequence) {
      experiment.groups[idx].sequence = mutatedSequence;
      mutate(experiment.groups);
    }
  }, [treatmentSequence]);

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
