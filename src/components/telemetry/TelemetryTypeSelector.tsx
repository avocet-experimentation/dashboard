import { useContext, useMemo } from 'react';
import {
  SelectValueChangeDetails,
  createListCollection,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '#/components/ui/select';
import { TelemetryContext } from './TelemetryContext';
import { useQuery } from '@tanstack/react-query';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';

interface SpanTypeListItem {
  label: string;
  value: string | null;
}

export default function TelemetryTypeSelector() {
  const { telemetryService, selectedType, setSelectedType } =
    useContext(TelemetryContext);

  const { isPending, isError, error, data } = useQuery({
    queryKey: ['allTelemetry'],
    queryFn: async () => telemetryService.getAllSpanTypes(),
  });

  const allSpanTypes = useMemo(() => {
    const items =
      data && data.body
        ? [
            { label: 'all', value: null },
            ...data.body.map((type) => ({ label: type, value: type })),
          ]
        : [];

    return createListCollection<SpanTypeListItem>({
      items,
    });
  }, [data]);

  if (isPending) return <Loader />;
  if (isError) return <ErrorBox error={error} />;

  return (
    <SelectRoot
      collection={allSpanTypes}
      bg={'white'}
      color={'black'}
      value={selectedType ? [selectedType] : undefined}
      onValueChange={(e: SelectValueChangeDetails<SpanTypeListItem>) => {
        setSelectedType(e.value[0]);
      }}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Filter by attribute..." />
      </SelectTrigger>
      <SelectContent>
        {allSpanTypes.items.map((type) => (
          <SelectItem item={type} key={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
