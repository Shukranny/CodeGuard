import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useScanProgress } from '../../../context/ScanProgressContext';

const UploadSection = ({ uploadProgress }) => {
  const { initiateScan } = useScanProgress();
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');
  const [projectId, setProjectId] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ ACTUAL upload to backend
  const handleFileSubmit = async (file) => {
    const formData = new FormData();
    formData.append('zip_file', file);
    formData.append('name', file.name);

    const res = await fetch('http://127.0.0.1:8000/api/projects/zip-upload/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Backend error:', error);
      throw new Error('Upload failed');
    }

    return await res.json();
  };

  // ✅ File selected → upload triggered
  const handleFileSelection = async (file) => {
    if (!file || !file.name.endsWith('.zip')) {
      alert('Please select a valid ZIP file');
      return;
    }

    setSelectedFile(file);
    setUploadSuccess(false);

    try {
      const response = await handleFileSubmit(file);

      setUploadSuccess(true);
      setBackendMessage(response.message);
      setProjectId(response.project_id);

      initiateScan({
        projectData: {
          type: 'file',
          projectId: response.project_id,
          filename: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.message);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelection(file);
  };

  return (
    <div className="space-y-6">
      {uploadMethod === 'file' && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <Icon name="Upload" size={32} />
            <p className="mt-2">
              {selectedFile ? selectedFile.name : 'Drop ZIP file or click to upload'}
            </p>
          </div>

          {selectedFile && (
            <div className="border rounded-lg p-4">
              <p className="font-medium">
                {uploadSuccess ? '✅ Upload Successful' : 'File Selected'}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>

              {uploadSuccess && (
                <p className="text-success text-sm mt-1">
                  {backendMessage} — Project ID: {projectId}
                </p>
              )}
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <p>Uploading… {uploadProgress}%</p>
              <div className="h-2 bg-muted rounded">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadSection;
