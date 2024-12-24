import { useState, useEffect, useContext } from 'react';
import {
  Button,
  SelectValueChangeDetails,
  Stack,
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
import { LoaderWrapper } from '#/components/helpers/LoaderWrapper';

// interface TelemetryTypeSelectorProps {
//   selectedType: string | null;
//   setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
// }

interface SpanTypeListItem {
  label: string;
  value: string | null;
}

export default function TelemetryTypeSelector() {
  const [allSpanTypes, setAllSpanTypes] = useState(
    createListCollection<SpanTypeListItem>({ items: [] }),
  );
  const [value, setValue] = useState<string[]>([]);
  const {
    telemetryService,
    selectedType,
    setSelectedType,
    isLoading,
    setIsLoading,
  } = useContext(TelemetryContext);

  const fetchSpanTypes = async () => {
    const response = await telemetryService.getAllSpanTypes();
    if (response.ok) {
      const spanTypeCollection = createListCollection<SpanTypeListItem>({
        items: [
          { label: 'all', value: null },
          ...response.body.map((type) => ({ label: type, value: type })),
        ],
      });

      setAllSpanTypes(spanTypeCollection);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSpanTypes().finally(() => setIsLoading(false));

    return () => setIsLoading(false);
  }, []);

  const handleValueChange = (e: SelectValueChangeDetails<SpanTypeListItem>) => {
    console.log({ selection: e.value });
    setValue(e.value);
    setSelectedType(e.value[0]);
  };

  return (
    <LoaderWrapper isLoading={isLoading}>
      <SelectRoot
        collection={allSpanTypes}
        bg="avocet-bg"
        color="avocet-text"
        value={value}
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValueText placeholder="Span type" />
        </SelectTrigger>
        <SelectContent bg="avocet-bg">
          {allSpanTypes.items.map((type) => (
            <SelectItem item={type} key={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </LoaderWrapper>
  );
}
