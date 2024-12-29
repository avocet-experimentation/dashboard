import { Flex, IconButton } from '@chakra-ui/react';
import { ReactNode, useState, cloneElement, ReactElement } from 'react';
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
  buttons?: ReactElement[];
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
  buttons,
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
      <DialogTrigger asChild>
        <IconButton variant="outline" size="md" padding="15px">
          {triggerButtonIcon}
          {triggerButtonText}
        </IconButton>
      </DialogTrigger>
      <DialogContent maxHeight="95vh" overflowY="scroll">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{childWithProps}</DialogBody>
        <DialogFooter>
          <Flex basis={'auto'} justify="flex-start">
            {buttons}
          </Flex>
          <Button
            loading={isLoading}
            variant="solid"
            type="submit"
            form={formId}
          >
            {confirmButtonText}
          </Button>
          <DialogActionTrigger asChild>
            <Button variant="plain">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
