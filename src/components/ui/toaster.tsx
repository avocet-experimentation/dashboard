'use client';

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react';

type ToasterTypes = 'success' | 'error' | 'warning' | 'info';

const toaster = createToaster({
  max: 3,
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

const duration: number = 6000; // in MS (equivalent to 6 seconds)

export const toastGeneral = (type: ToasterTypes, message: string) => {
  return toaster.create({
    description: message,
    type: type,
    duration: duration,
  });
};

export const toastSuccess = (message: string) =>
  toastGeneral('success', message);

export const toastWarning = (message: string) =>
  toastGeneral('warning', message);

export const toastError = (message: string) => toastGeneral('error', message);

export const toastInfo = (message: string) => toastGeneral('info', message);

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
