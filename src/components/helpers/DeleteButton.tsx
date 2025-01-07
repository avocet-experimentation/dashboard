import { IconButton } from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';

export function DeleteButton({
  label,
  onDeleteClick,
}: {
  label: string;
  onDeleteClick: () => void;
}) {
  return (
    <IconButton
      aria-label={label}
      bg="transparent"
      color="avocet-error-fg"
      _hover={{ bg: 'avocet-error-bg', color: 'avocet-error-fg' }}
      marginLeft="auto"
      onClick={(e) => {
        e.preventDefault();
        onDeleteClick();
      }}
    >
      <Trash2 />
    </IconButton>
  );
}
