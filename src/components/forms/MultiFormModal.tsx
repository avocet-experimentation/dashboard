import { Group, IconButton, StepsTitle } from '@chakra-ui/react';
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
import { StepsRoot, StepsPrevTrigger, StepsNextTrigger } from '../ui/steps';
import { Button } from '../ui/button';

interface FormModalProps {
  triggerButtonIcon: ReactNode;
  triggerButtonText: string;
  children: ReactElement;
  title: string;
  formId: string;
  confirmButtonText: string;
  numberOfSteps: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MultiFormModal({
  triggerButtonIcon,
  triggerButtonText,
  title,
  formId,
  confirmButtonText,
  children,
  numberOfSteps,
  open,
  setOpen,
}: FormModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(0);

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
      onOpenChange={(e) => {
        setCurrentStepNumber(0);
        setOpen(e.open);
      }}
      onEscapeKeyDown={(e) => e.preventDefault()}
      placement="center"
      motionPreset="slide-in-bottom"
      size="xl"
    >
      <DialogTrigger asChild>
        <IconButton variant="outline" size="md" padding="15px">
          {triggerButtonIcon}
          {triggerButtonText}
        </IconButton>
      </DialogTrigger>
      <DialogContent maxHeight="95vh" overflowY="scroll" maxWidth="90vw">
        <StepsRoot
          size="sm"
          variant="solid"
          onStepChange={({ step }) => setCurrentStepNumber(step + 1)}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogBody>{childWithProps}</DialogBody>
          <DialogFooter>
            {currentStepNumber !== 0 && (
              <StepsPrevTrigger asChild>
                <Button variant="outline" size="sm">
                  Prev
                </Button>
              </StepsPrevTrigger>
            )}
            {currentStepNumber === numberOfSteps ? (
              <Button
                loading={isLoading}
                variant="solid"
                type="submit"
                form={formId}
              >
                {confirmButtonText}
              </Button>
            ) : (
              <StepsNextTrigger asChild>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </StepsNextTrigger>
            )}

            <DialogActionTrigger asChild>
              <Button variant="plain">Cancel</Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </StepsRoot>
      </DialogContent>
    </DialogRoot>
  );
}
