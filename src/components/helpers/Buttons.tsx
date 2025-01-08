import { IconButton } from '@chakra-ui/react';
import { Trash2, Pencil, MinusCircle } from 'lucide-react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function DeleteButton({ label, onClick }: ButtonProps) {
  return (
    <IconButton
      aria-label={label}
      bg="transparent"
      color="avocet-error-fg"
      _hover={{ bg: 'avocet-error-bg', color: 'avocet-error-fg' }}
      marginLeft="auto"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <Trash2 />
    </IconButton>
  );
}

/**
 * For removing references, rather than deleting the referenced item
 */
export function RemoveButton({ label, onClick }: ButtonProps) {
  return (
    <IconButton
      aria-label={label}
      bg="transparent"
      color="avocet-error-fg"
      _hover={{ bg: 'avocet-error-bg', color: 'avocet-error-fg' }}
      marginLeft="auto"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <MinusCircle />
    </IconButton>
  );
}

/**
 * Button for triggering edit modals
 */
export function EditButton({ label, onClick }: ButtonProps) {
  return (
    <IconButton
      aria-label={label}
      bg="transparent"
      color="avocet-edit-fg"
      _hover={{ bg: 'avocet-edit-bg', color: 'avocet-edit-fg' }}
      marginLeft="auto"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <Pencil />
    </IconButton>
  );
}
