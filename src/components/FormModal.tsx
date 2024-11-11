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
} from "./ui/dialog";
import { Button } from "./ui/button";
import { IconButton } from "@chakra-ui/react";
import { ReactNode, useState, cloneElement } from "react";

type FormModal = {
  triggerButtonIcon: ReactNode;
  triggerButtonText: string;
  title: string;
  children: ReactNode;
  formId: string;
  confirmButtonText: string;
};

const FormModalTrigger = ({
  triggerButtonIcon,
  triggerButtonText,
  title,
  formId,
  confirmButtonText,
  children,
}: FormModal) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Clone the child element and add the additional props to it
  const childWithProps = cloneElement(children, {
    setIsLoading: setIsLoading,
    formId: formId,
  });

  return (
    <DialogRoot placement="center" motionPreset="slide-in-bottom">
      <DialogTrigger asChild>
        <IconButton variant="outline" size="md" padding="15px">
          {triggerButtonIcon}
          {triggerButtonText}
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{childWithProps}</DialogBody>
        <DialogFooter>
          <Button
            loading={isLoading}
            variant="solid"
            color="black"
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
};

export default FormModalTrigger;
