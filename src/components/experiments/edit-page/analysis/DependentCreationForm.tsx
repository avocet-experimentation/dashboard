import PageSelect from '#/components/forms/PageSelect';
import { Box, HStack, Input } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useExperimentContext } from '../ExperimentContext';
import {
  Metric,
  SchemaParseError,
  flagValueTypeDefArray,
  flagValueTypeDefSchema,
  metricSchema,
} from '@avocet/core';
import { Field } from '#/components/ui/field';
import { Button } from '#/components/ui/button';

/**
 * Mini-form to add dependent variables to an experiment
 *
 * todo:
 * - add sub-types for discrete vs continuous numbers if relevant
 */
export function DependentCreationForm() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();

  const [fieldName, setFieldName] = useState<string>('');
  const [fieldDataType, setFieldDataType] = useState<Metric['type']>('boolean');
  const options = useMemo(
    () =>
      flagValueTypeDefArray.map((valueType) => ({
        label: valueType,
        value: valueType,
      })),
    [],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const safeParseResult = metricSchema.safeParse({
      fieldName,
      type: fieldDataType,
    });
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    mutate({ dependents: [...experiment.dependents, safeParseResult.data] });
  };

  return (
    <Box>
      <form id="add-dependent" onSubmit={handleSubmit}>
        <HStack>
          <PageSelect
            options={options}
            width="250px"
            label="Data Type"
            selected={[fieldDataType]}
            handleValueChange={(selections) =>
              setFieldDataType(flagValueTypeDefSchema.parse(selections[0]))
            }
          />
          <Field label="Field Name">
            <Input
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </Field>
          <Field label="-">
            <Button
              form="add-dependent"
              variant="solid"
              type="submit"
              alignContent={'baseline'}
              bottom={'0'}
            >
              Add
            </Button>
          </Field>
        </HStack>
      </form>
    </Box>
  );
}
