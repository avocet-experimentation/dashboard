import { useState, useEffect } from 'react';
import { Event, Span } from '#/types';
import Table from './Table';

export default function EventTable({ data }: { data: Span[] }) {
  return (
    <div className='event-table-container'>
      <Table data={data} />
    </div>
  );
}
