import { Button } from '#/components/ui/button';
import { ServicesContext } from '#/services/ServiceContext';
import { OctagonX, Power } from 'lucide-react';
import { useContext } from 'react';

export function StartExperimentButton({
  experimentId,
  disabled,
}: {
  experimentId: string;
  disabled: boolean;
}) {
  const services = useContext(ServicesContext);

  return (
    <Button
      variant="solid"
      disabled={disabled}
      colorPalette="green"
      onClick={() => services.experiment.start(experimentId)}
    >
      <Power />
      Start Experiment
    </Button>
  );
}

export function PauseExperimentButton({
  experimentId,
}: {
  experimentId: string;
}) {
  const services = useContext(ServicesContext);

  return (
    <Button
      variant="solid"
      colorPalette="red"
      onClick={() => services.experiment.pause(experimentId)}
    >
      <OctagonX />
      Stop Experiment
    </Button>
  );
}
