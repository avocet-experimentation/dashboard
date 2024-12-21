import { CirclePlus, CircleEllipsis } from 'lucide-react';
import { useState } from 'react';
import { Environment, SDKConnection } from '@avocet/core';
import FormModal from '../../forms/FormModal';
import SDKConnectionManagementForm from './SDKConnectionManagementForm';

const SDK_CONNECTION_MANAGEMENT_FORM_ID = 'sdk-connection-management-form';

interface SDKConnectionManagementModalProps {
  // formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sdkConnection?: SDKConnection;
  // setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  updateSDKConnection: (updated: SDKConnection) => void;
}

export default function SDKConnectionManagementModal({
  sdkConnection,
  // setEnvironments,
  updateSDKConnection,
  setIsLoading,
}: SDKConnectionManagementModalProps) {
  const [open, setOpen] = useState(false);

  const formModalProps = sdkConnection
    ? {
        title: `Modify "${sdkConnection?.name}" Connection`,
        confirmButtonText: 'Update',
        triggerButtonText: sdkConnection?.name,
        triggerButtonIcon: <CircleEllipsis />,
      }
    : {
        title: 'Create a New SDK Connection',
        confirmButtonText: 'Create',
        triggerButtonText: 'Add Connection',
        triggerButtonIcon: <CirclePlus />,
      };

  return (
    <FormModal
      formId={SDK_CONNECTION_MANAGEMENT_FORM_ID}
      open={open}
      setOpen={setOpen}
      {...formModalProps}
    >
      <SDKConnectionManagementForm
        formId={SDK_CONNECTION_MANAGEMENT_FORM_ID}
        setIsLoading={setIsLoading}
        // setEnvironments={setEnvironments}
        updateConnection={updateSDKConnection}
        sdkConnection={sdkConnection}
        setOpen={setOpen}
      />
    </FormModal>
  );
}
