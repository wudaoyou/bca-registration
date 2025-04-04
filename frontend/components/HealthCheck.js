import { useState } from 'react';

export default function HealthCheck() {
  const [status, setStatus] = useState('Not Checked');

  const handleCheck = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/health');
      const text = await res.text();
      setStatus(text === 'OK' ? '✅ API Healthy' : '❌ API Unhealthy');
    } catch (err) {
      setStatus('❌ API Unreachable');
    }
  };

  return (
    <div className="flex flex-col items-start space-y-1">
      <p className="font-semibold text-lg">
        API Status: {status}
      </p>
      <button
        onClick={handleCheck}
        className="bg-green-500 text-white px-3 py-1 rounded text-base"
      >
        Check Health
      </button>
    </div>
  );
}
