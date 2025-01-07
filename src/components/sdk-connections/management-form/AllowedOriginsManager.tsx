import { HStack, Input, Text } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field } from '#/components/ui/field';
import {
  ElementListItem,
  ElementListRoot,
} from '#/components/helpers/ElementList';
import { DeleteButton } from '#/components/helpers/DeleteButton';
import { Button } from '#/components/ui/button';
import { useState } from 'react';
import { PageToolTip } from '#/components/helpers/PageToolTip';
import { SDKConnectionDraft } from '@avocet/core';

/**
 * (WIP) Lists set origins and allows users to add or remove them
 * TODO:
 * - Move allowed origins tooltip inline with the field label
 */
export function AllowedOriginsManager() {
  const [originInputValue, setOriginInputValue] = useState<string>('');
  const { setValue, getValues, control, formState } =
    useFormContext<SDKConnectionDraft>();
  const addOrigin = (newOrigin?: string) => {
    if (!newOrigin) return;
    setValue('allowedOrigins', [...getValues('allowedOrigins'), newOrigin]);
    setOriginInputValue('');
  };

  return (
    <HStack>
      <Field label="Allowed origins">
        <Controller
          name="allowedOrigins"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            const allowedOrigins = getValues('allowedOrigins');
            return (
              <>
                {allowedOrigins.length ? (
                  <ElementListRoot>
                    {allowedOrigins.map((origin, i) => (
                      <ElementListItem key={`${origin}-${i}`}>
                        <Text>{origin}</Text>
                        <DeleteButton
                          label={`Delete origin: ${origin}`}
                          onDeleteClick={() =>
                            setValue(
                              'allowedOrigins',
                              allowedOrigins.filter((_, j) => j !== i),
                            )
                          }
                        />
                      </ElementListItem>
                    ))}
                  </ElementListRoot>
                ) : undefined}
                <HStack>
                  <Field
                    invalid={!!formState.errors.allowedOrigins}
                    errorText="At least one origin pattern must be defined."
                  >
                    <Input
                      value={originInputValue}
                      onChange={(e) => setOriginInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addOrigin(originInputValue);
                        }
                      }}
                    />
                  </Field>
                  <Button onClick={() => addOrigin(originInputValue)}>
                    Add
                  </Button>
                </HStack>
              </>
            );
          }}
        />
      </Field>
      <PageToolTip
        content={
          'Requests for flag values will be compared against the allowed origins via prefix matching. "*" matches all origins'
        }
      />
    </HStack>
  );
}
