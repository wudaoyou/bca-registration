import { useState } from 'react';
import HealthCheck from '../components/HealthCheck';
import FileUpload from '../components/FileUpload';
import LogsButton from '../components/LogsButton';

export default function Home() {
  return (
    <div className="flex flex-col items-start p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">BCA Registration Portal</h1>
      
      <div className="flex flex-wrap items-center gap-4 text-lg">
        {/* HealthCheck is now a single button. We'll style it with Tailwind inside that component. */}
        <HealthCheck />

        {/* FileUpload contains file input, upload button, and checkbox */}
        <FileUpload />

        {/* Show logs is a toggle button */}
        <LogsButton />
      </div>
    </div>
  );
}
