import { PrimitiveTypeLabel } from '@avocet/core';
import { ALargeSmall, Hash, ToggleLeft } from 'lucide-react';

export default function ValueTypeIcon({ type }: { type: PrimitiveTypeLabel }) {
  switch (type) {
    case 'string':
      return <ALargeSmall />;
    case 'number':
      return <Hash />;
    case 'boolean':
      return <ToggleLeft />;
    // default:
    //   return <></>;
  }
}
