import { IconButton } from '@chakra-ui/react';
import { Pencil } from 'lucide-react';

/**
 * Button for triggering edit modals
 */
export function EditButton({
  label,
  onEditClick,
}: {
  label: string;
  onEditClick: () => void;
}) {
  return (
    <IconButton
      aria-label={label}
      bg="transparent"
      color="avocet-edit-fg"
      _hover={{ bg: 'avocet-edit-bg', color: 'avocet-edit-fg' }}
      marginLeft="auto"
      onClick={(e) => {
        e.preventDefault();
        onEditClick();
      }}
    >
      <Pencil />
    </IconButton>
  );
}
