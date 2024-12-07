import { Controller, useFormContext } from 'react-hook-form';
import { Field } from '../ui/field';
import { Slider } from '../ui/slider';

function ExperimentTotalTrafficSlider() {
  const { control } = useFormContext();
  return (
    <Controller
      name="enrollment.proportion"
      control={control}
      render={({ field }) => (
        <Field label={`Traffic included in this experiment: ${field.value[0]}`}>
          <Slider
            cursor="grab"
            width="full"
            onFocusChange={({ focusedIndex }) => {
              if (focusedIndex !== -1) return;
              field.onBlur();
            }}
            name={field.name}
            value={[field.value]}
            onValueChange={({ value }) => {
              field.onChange(value);
            }}
          />
        </Field>
      )}
    />
  );
}

export default ExperimentTotalTrafficSlider;
