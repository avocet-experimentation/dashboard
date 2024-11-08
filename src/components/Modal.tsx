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
import { ReactNode } from "react";

type FormModal = {
  triggerButtonIcon: ReactNode;
  triggerButtonText: string;
  title: string;
  form: ReactNode;
  formId: string;
  confirmButtonText: string;
};

const FormModalTrigger = ({
  triggerButtonIcon,
  triggerButtonText,
  title,
  form,
  formId,
  confirmButtonText,
}: FormModal) => {
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
        <DialogBody>{form}</DialogBody>
        <DialogFooter>
          <Button variant="solid" color="black" type="submit" form={formId}>
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
