import { useState } from 'react';
import HealthCheck from '../components/HealthCheck';
import LogsButton from '../components/LogsButton';
import CsvToJsonUploader from '../components/CsvToJsonUploader';

export default function Home() {
  return (
    <div className="flex flex-col items-start p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">BCA Registration Portal</h1>

      <div className="flex flex-wrap items-start gap-6 text-lg w-full">
        {/* Health Check button */}
        <HealthCheck />

        {/* Logs toggle button */}
        <LogsButton />

        {/* CSV -> JSON in-browser, then optional backend submission */}
        <CsvToJsonUploader />
      </div>
    </div>
  );
}
