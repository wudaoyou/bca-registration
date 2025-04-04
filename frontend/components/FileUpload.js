import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isTest, setIsTest] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('No file selected.');
      return;
    }

    try {
      const query = isTest ? '?test=true' : '';
      const url = `http://localhost:8080/api/register${query}`;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'registration_result.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed.');
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex items-center space-x-2 text-base">
        <input type="file" onChange={handleFileChange} />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-3 py-1 rounded text-base"
        >
          Upload
        </button>
        <label className="inline-flex items-center space-x-1 text-base">
          <input
            type="checkbox"
            checked={isTest}
            onChange={(e) => setIsTest(e.target.checked)}
          />
          <span>Test run</span>
        </label>
      </div>
    </div>
  );
}
