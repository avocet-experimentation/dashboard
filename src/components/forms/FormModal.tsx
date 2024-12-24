import { IconButton } from '@chakra-ui/react';
import {
  ReactNode, useState, cloneElement, ReactElement,
} from 'react';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface FormModalProps {
  triggerButtonIcon: ReactNode;
  triggerButtonText: string;
  title: string;
  children: ReactElement;
  formId: string;
  confirmButtonText: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormModal({
  triggerButtonIcon,
  triggerButtonText,
  title,
  formId,
  confirmButtonText,
  children,
  open,
  setOpen,
}: FormModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Clone the child element and add the additional props to it
  const childWithProps = cloneElement(children, {
    setIsLoading,
    formId,
    setOpen,
  });

  return (
    <DialogRoot
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      onEscapeKeyDown={(e) => e.preventDefault()}
      placement="center"
      motionPreset="slide-in-bottom"
      size="lg"
    >
      <DialogTrigger asChild color="avocet-text">
        <IconButton variant="outline" size="md" padding="15px">
          {triggerButtonIcon}
          {triggerButtonText}
        </IconButton>
      </DialogTrigger>
      <DialogContent bg="avocet-bg" color="avocet-text" maxHeight="95vh" overflowY="scroll">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{childWithProps}</DialogBody>
        <DialogFooter>
          <Button
            loading={isLoading}
            variant="solid"
            type="submit"
            form={formId}
          >
            {confirmButtonText}
          </Button>
          <DialogActionTrigger asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
