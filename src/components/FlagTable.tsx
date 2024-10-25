import { useState, useEffect } from 'react';
import { Flag } from '#/lib/types';
import Table from './Table';

interface FlagTableProps {
  data: Flag[],
}

export default function FlagTable({ data }: FlagTableProps) {
  return (
    <div className='flag-table-container'>
      <Table data={data} />
    </div>
  );
}
