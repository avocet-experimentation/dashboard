import { Controller, useFormContext } from 'react-hook-form';
import { Input, ListCollection } from '@chakra-ui/react';
import { Treatment } from '@estuary/types';
import { Switch } from '../../ui/switch';
import { FeatureCollection } from './ExperimentTreatmentField';

interface Props {
  definedTreatments: { [id: string]: Treatment };
  featuresCollection: ListCollection<FeatureCollection>;
  featureIdx: number;
  id: string;
}

function TreatmentFeatureValueType({
  definedTreatments,
  featuresCollection,
  featureIdx,
  id,
}: Props) {
  const { control, register } = useFormContext();

  return (
    <Controller
      name={`definedTreatments.${id}.flagStates.${featureIdx}.value`}
      control={control}
      render={({ field }) => {
        const selectedFeatureId = definedTreatments[id].flagStates[featureIdx].id;
        if (selectedFeatureId) {
          const selectedFeature = featuresCollection.items.find(
            (featObj) => featObj.value === selectedFeatureId,
          );
          if (selectedFeature && selectedFeature.type === 'boolean') {
            return (
              <Switch
                name={field.name}
                checked={!!field.value}
                // onCheckedChange={({ checked }) => {
                //   console.log(treatmentFeatureObj.id);
                //   field.onChange(!!checked);
                // }}
                onChange={(e) => {
                  console.log(e.target);
                  field.onChange(e.target.checked);
                }}
                onBlur={field.onBlur}
              >
                {field.value ? 'on' : 'off'}
              </Switch>
            );
          }
          if (selectedFeature && selectedFeature.type === 'string') {
            return (
              <Input
                type="text"
                placeholder="A string value"
                {...register(
                  `definedTreatments.${id}.flagStates.${featureIdx}.value`,
                  {
                    required: 'A string value is required.',
                  },
                )}
              />
            );
          }
          if (selectedFeature && selectedFeature.type === 'number') {
            return (
              <Input
                type="number"
                placeholder="A number value"
                {...register(
                  `definedTreatments.${id}.flagStates.${featureIdx}.value`,
                  {
                    valueAsNumber: true,
                    required: 'A number value is required.',
                  },
                )}
              />
            );
          }
        }
      }}
    />
  );
}

export default TreatmentFeatureValueType;
