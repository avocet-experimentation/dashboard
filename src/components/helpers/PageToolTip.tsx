import { Icon } from '@chakra-ui/react';
import { Tooltip, TooltipProps } from '#/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';

export function PageToolTip({
  content,
  ...toolTipProps
}: { content: string } & TooltipProps) {
  return (
    <Tooltip showArrow openDelay={50} content={content} {...toolTipProps}>
      <Icon size="md">
        <CircleHelp />
      </Icon>
    </Tooltip>
  );
}
