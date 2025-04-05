import React, { useState } from 'react';
import Papa from 'papaparse';
import { DataGrid } from '@mui/x-data-grid';

export default function CsvToJsonUploader() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [isTest, setIsTest] = useState(false); // Test mode checkbox

  // Parse CSV file in the browser
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data; // array of objects
        setParsedData(data);

        if (data.length > 0) {
          // Build columns from CSV keys (first row)
          const sample = data[0];
          const generatedCols = Object.keys(sample).map((key) => ({
            field: key,
            headerName: key,
            flex: 1,
          }));
          setColumns(generatedCols);

          // Each row must have a unique ID for DataGrid
          const withIds = data.map((item, idx) => ({ id: idx, ...item }));
          setRows(withIds);
        } else {
          setColumns([]);
          setRows([]);
        }
      },
      error: (err) => {
        console.error('Papa Parse Error:', err);
        alert('Failed to parse CSV.');
      },
    });
  };

  // Submit parsed JSON to the backend
  const handleSubmitToBackend = async () => {
    if (parsedData.length === 0) {
      alert('No data to submit!');
      return;
    }
    try {
      // If test mode is checked, append ?test=true
      const query = isTest ? '?test=true' : '';
      const url = `http://localhost:8080/api/registerJson${query}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
      const result = await response.json();
      console.log('Backend response:', result);
      alert('Data processed successfully! Check console for details.');
    } catch (error) {
      alert(`Submission failed: ${error.message}`);
      console.error('Error:', error);
    }
  };

  // Dev button: export parsed JSON to local file
  const handleExportJson = () => {
    if (parsedData.length === 0) {
      alert('No parsed data to export!');
      return;
    }
    try {
      const blob = new Blob([JSON.stringify(parsedData, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export JSON error:', error);
      alert('Failed to export JSON.');
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      {/* CSV File Input */}
      <div className="flex items-center space-x-2">
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      {/* Data Grid showing the parsed CSV */}
      <div style={{ width: '600px', height: '400px' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>

      {/* Test Mode Checkbox */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isTest}
          onChange={(e) => setIsTest(e.target.checked)}
        />
        <span>Test Mode</span>
      </label>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleSubmitToBackend}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
        <button
          onClick={handleExportJson}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Export JSON (Dev)
        </button>
      </div>
    </div>
  );
}
