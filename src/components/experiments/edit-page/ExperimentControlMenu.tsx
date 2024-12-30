import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '#/components/ui/menu';
import { toaster } from '#/components/ui/toaster';
import { DELETE_EXPERIMENT } from '#/lib/experiment-queries';
import { useGQLMutation } from '#/lib/graphql-queries';
import { Box, IconButton } from '@chakra-ui/react';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { navigate } from 'wouter/use-browser-location';

export default function ExperimentControlMenu({
  experimentId,
  disabled,
}: {
  experimentId: string;
  disabled: boolean;
}) {
  const deleteExperiment = useGQLMutation({
    mutation: DELETE_EXPERIMENT,
    cacheKey: ['allExperiments'],
    onSuccess: () => {
      toaster.create({
        description: 'Experiment deleted',
        duration: 6000,
      });
      // navigate('/experiments');
    },
  });

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton size="md">
          <EllipsisVertical color="black" />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          disabled={disabled}
          value="delete"
          valueText="Delete"
          cursor="pointer"
          color="fg.error"
          _hover={{ bg: 'bg.error', color: 'fg.error' }}
          onClick={() => {
            if (disabled) {
              toaster.create({
                title: 'Cannot delete experiment while active.',
                description: 'Stop the experiment before deleting.',
                type: 'error',
              });
            } else {
              deleteExperiment.mutate({ id: experimentId });
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
