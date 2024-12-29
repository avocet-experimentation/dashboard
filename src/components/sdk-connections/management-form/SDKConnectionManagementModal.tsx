import { CirclePlus, CircleEllipsis, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SDKConnection, stripKeysWithValues } from '@avocet/core';
import FormModal from '../../forms/FormModal';
import SDKConnectionManagementForm from './SDKConnectionManagementForm';
import { Button } from '#/components/ui/button';
import { Box } from '@chakra-ui/react';
import { DELETE_SDK_CONNECTION } from '#/lib/sdk-connection-queries';
import { useGQLMutation } from '#/lib/graphql-queries';

const SDK_CONNECTION_MANAGEMENT_FORM_ID = 'sdk-connection-management-form';

interface SDKConnectionManagementModalProps {
  sdkConnection?: SDKConnection;
}

export default function SDKConnectionManagementModal({
  sdkConnection,
}: SDKConnectionManagementModalProps) {
  const [open, setOpen] = useState(false);

  const deleteSDKConnection = useGQLMutation({
    mutation: DELETE_SDK_CONNECTION,
    cacheKey: ['allSDKConnections'],
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const formModalProps = sdkConnection
    ? {
        title: `Modify "${sdkConnection?.name}" Connection`,
        confirmButtonText: 'Update',
        triggerButtonText: sdkConnection?.name,
        triggerButtonIcon: <CircleEllipsis />,
        buttons: [
          <Button
            colorPalette="fg.error"
            onClick={(e) => {
              console.log(stripKeysWithValues(e, undefined, null));
              deleteSDKConnection.mutate({ id: sdkConnection.id });
            }}
          >
            <Trash2 />
            <Box flex="1">Delete</Box>
          </Button>,
        ],
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
        sdkConnection={sdkConnection}
        setOpen={setOpen}
      />
    </FormModal>
  );
}
