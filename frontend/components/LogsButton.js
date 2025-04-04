import { useState } from 'react';

export default function LogsButton() {
  const [logs, setLogs] = useState('');
  const [isShowing, setIsShowing] = useState(false);

  const handleToggleLogs = async () => {
    if (!isShowing) {
      // fetch logs
      try {
        const res = await fetch('http://localhost:8080/api/logs');
        const text = await res.text();
        setLogs(text);
      } catch (error) {
        setLogs('Unable to fetch logs.');
      }
    } else {
      // hide logs
      setLogs('');
    }
    setIsShowing(!isShowing);
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <button
        onClick={handleToggleLogs}
        className="bg-purple-500 text-white px-3 py-1 rounded text-base"
      >
        {isShowing ? 'Hide Logs' : 'Show Backend Logs'}
      </button>
      {isShowing && (
        <pre className="bg-gray-100 p-4 rounded h-64 w-full overflow-auto whitespace-pre-wrap text-sm">
          {logs}
        </pre>
      )}
    </div>
  );
}
