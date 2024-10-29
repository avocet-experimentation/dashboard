import { FeatureFlag } from '#/lib/types';
import { useState, useEffect } from 'react';

const defaults = {
  name: '',
  description: '',
  metrics: {
    primary: '',
    secondary: '',
  },
  state: ''
}
export default function FlagManagementForm({ flag }: { flag?: FeatureFlag }) {
  // populate fields with the flag object if passed

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metrics, setMetrics] = useState();
  const [status, setStatus] = useState('');
  const [targetingRules, setTargetingRules] = useState([]);
  const [environments, setEnvironments] = useState('');
  const [name, setName] = useState('');
  
  return (
    <div>
      <form id='flag-management-form'>
        <input type='text' value={name}>
        
        </input>
      </form>
    </div>
  );
}
