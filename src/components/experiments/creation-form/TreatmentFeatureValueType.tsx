import { useFormContext } from 'react-hook-form';
import { FeatureFlag } from '@avocet/core';
import ControlledSwitch from '#/components/forms/ControlledSwitch';
import ControlledTextInput from '#/components/forms/ControlledTextInput';

interface Props {
  selectedFlag: FeatureFlag;
  featureIdx: number;
  treatmentId: string;
}

export default function TreatmentFeatureValueType({
  selectedFlag,
  featureIdx,
  treatmentId,
}: Props): JSX.Element {
  const { register } = useFormContext();
  const flagStateValueFieldPath: `definedTreatments.${string}` = `definedTreatments.${treatmentId}.flagStates.${featureIdx}.value`;

  if (selectedFlag.value.type === 'boolean') {
    return (
      <ControlledSwitch
        fieldPath={flagStateValueFieldPath}
        label="toggle"
        labelPosition="right"
        switchId={`toggle-boolean-flag-state-${treatmentId}`}
      />
    );
  }

  if (selectedFlag.value.type === 'string') {
    return (
      <ControlledTextInput
        fieldPath={flagStateValueFieldPath}
        label={undefined}
        registerReturn={register(flagStateValueFieldPath, {
          required: 'A string value is required.',
        })}
      />
    );
  }
  if (selectedFlag.value.type === 'number') {
    return (
      <ControlledTextInput
        fieldPath={flagStateValueFieldPath}
        label={undefined}
        registerReturn={register(flagStateValueFieldPath, {
          valueAsNumber: true,
          required: 'A number value is required.',
        })}
      />
    );
  }

  throw new TypeError(
    `Flag type "${selectedFlag['value']['type']}" is not accounted for`,
  );

  // return (
  //   <Controller
  //     name={`definedTreatments.${id}.flagStates.${featureIdx}.value`}
  //     control={control}
  //     render={({ field }) => {
  //         if (selectedFlag && selectedFlag.type === 'string') {
  //           return (
  //             <Input
  //               type="text"
  //               placeholder="A string value"
  //               {...register(
  //                 `definedTreatments.${id}.flagStates.${featureIdx}.value`,
  //                 {
  //                   required: 'A string value is required.',
  //                 },
  //               )}
  //             />
  //           );
  //         }
  //         if (selectedFlag && selectedFlag.type === 'number') {
  //           return (
  //             <Input
  //               type="number"
  //               placeholder="A number value"
  //               {...register(
  //                 `definedTreatments.${id}.flagStates.${featureIdx}.value`,
  //                 {
  //                   valueAsNumber: true,
  //                   required: 'A number value is required.',
  //                 },
  //               )}
  //             />
  //           );
  //         }
  //       }
  //   />
  // );
}
