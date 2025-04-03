import { useEffect, useState } from 'react';

export default function HealthCheck() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then(res => res.text())
      .then(text => setStatus(text === 'OK' ? '✅ API Healthy' : '❌ API Unhealthy'))
      .catch(() => setStatus('❌ API Unreachable'));
  }, []);

  return <p className="mb-4 font-semibold">API Status: {status}</p>;
}