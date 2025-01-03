import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '#/components/ui/menu';
import { toastError, toastSuccess } from '#/components/ui/toaster';
import { DELETE_EXPERIMENT } from '#/lib/experiment-queries';
import { gqlRequest } from '#/lib/graphql-queries';
import { Box, IconButton } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { navigate } from 'wouter/use-browser-location';

export default function ExperimentControlMenu({
  experimentId,
  disabled,
}: {
  experimentId: string;
  disabled: boolean;
}) {
  const deleteExperiment = useMutation({
    mutationKey: ['experiment', experimentId],
    mutationFn: async () => gqlRequest(DELETE_EXPERIMENT, { id: experimentId }),
    onSuccess: () => {
      navigate('/experiments');
      toastSuccess('Experiment deleted successfully.');
    },
  });

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton
          _open={{ bg: 'avocet-hover' }}
          _hover={{ bg: 'avocet-hover' }}
          bg="avocet-section"
          color="avocet-text"
          size="md"
        >
          <EllipsisVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent bg="avocet-section">
        <MenuItem
          disabled={disabled}
          value="delete"
          valueText="Delete"
          cursor="pointer"
          color="avocet-error-fg"
          _hover={{ bg: 'avocet-error-bg', color: 'avocet-error-fg' }}
          onClick={() => {
            if (disabled) {
              toastError('Cannot delete experiment while active or paused.');
            } else {
              deleteExperiment.mutate();
            }
          }}
        >
          <Trash2 />
          <Box flex="1">Delete</Box>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
