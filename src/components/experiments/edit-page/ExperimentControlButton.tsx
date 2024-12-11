import { Button } from '#/components/ui/button';
import ExperimentService from '#/services/ExperimentService';
import { Experiment } from '@estuary/types';
import { OctagonX, Power } from 'lucide-react';

export default function ExperimentControlButton({
  experiment,
  experimentService,
}: {
  experiment: Experiment;
  experimentService: ExperimentService;
}) {
  const experimentButtonProperties = (expStatus: string, expId: string) => {
    const active = expStatus === 'active';
    const icon = active ? <OctagonX /> : <Power />;
    const text = active ? 'Stop Experiment' : 'Start Experiment';
    const colorPalette = active ? 'red' : 'green';
    const onClick = active
      ? () => {}
      : () => experimentService.startExperiment(expId);
    return { icon, text, colorPalette, onClick };
  };

  const expButtonProps = experimentButtonProperties(
    experiment.status,
    experiment.id,
  );
  return (
    <Button
      variant="solid"
      colorPalette={expButtonProps.colorPalette}
      onClick={expButtonProps.onClick}
    >
      {expButtonProps.icon}
      {expButtonProps.text}
    </Button>
  );
}
