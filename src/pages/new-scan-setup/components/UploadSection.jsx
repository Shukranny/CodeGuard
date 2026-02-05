import React, { useState, useRef } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useScanProgress } from '../../../context/ScanProgressContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const UploadSection = ({ uploadProgress, setUploadProgress }) => {
  const { initiateScan } = useScanProgress();
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isDragging, setIsDragging] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  /**
   * ZIP FILE UPLOAD + SCAN START
   */
  const handleFileSelection = async (file) => {
    if (!file || !file.name.endsWith('.zip')) {
      alert('Please select a valid ZIP file');
      return;
    }

    setSelectedFile(file);

    initiateScan({
      projectData: {
        type: 'file',
        filename: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
      },
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await axios.post(
        `${API_BASE_URL}/projects/upload-zip/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress?.(percent);
          },
        }
      );

      const projectId = uploadResponse.data.project_id;

      await axios.post(`${API_BASE_URL}/scans/start/`, {
        project_id: projectId,
      });

    } catch (error) {
      console.error('ZIP upload failed:', error);
      alert('ZIP upload failed. Check backend logs.');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelection(file);
  };

  /**
   * GITHUB REPO SUBMIT + SCAN START
   */
  const handleRepositorySubmit = async () => {
    if (!repoUrl.trim()) {
      alert('Please enter a valid repository URL');
      return;
    }

    initiateScan({
      projectData: {
        type: 'github',
        url: repoUrl,
        uploadDate: new Date().toISOString(),
      },
    });

    try {
      const repoResponse = await axios.post(
        `${API_BASE_URL}/projects/github/`,
        {
          url: repoUrl,
          token: githubToken,
        }
      );

      const projectId = repoResponse.data.project_id;

      await axios.post(`${API_BASE_URL}/scans/start/`, {
        project_id: projectId,
      });

    } catch (error) {
      console.error('GitHub repo fetch failed:', error);
      alert('Failed to fetch GitHub repository');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload method switch */}
      <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
        <button
          onClick={() => setUploadMethod('file')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
          font-medium text-sm transition-smooth
          ${uploadMethod === 'file'
            ? 'bg-card text-foreground shadow-glow-sm'
            : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Upload" size={18} />
          <span>Upload ZIP</span>
        </button>

        <button
          onClick={() => setUploadMethod('github')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
          font-medium text-sm transition-smooth
          ${uploadMethod === 'github'
            ? 'bg-card text-foreground shadow-glow-sm'
            : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Github" size={18} />
          <span>GitHub Repo</span>
        </button>
      </div>

      {/* ZIP Upload */}
      {uploadMethod === 'file' && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center
            transition-smooth cursor-pointer
            ${isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <Icon name="Upload" size={32} />
              <h3 className="font-semibold">
                {selectedFile ? selectedFile.name : 'Drop your ZIP file here'}
              </h3>
              <p className="text-sm text-muted-foreground">
                or click to browse • Maximum size: 500MB
              </p>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <div className="flex justify-between text-sm">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* GitHub Repo */}
      {uploadMethod === 'github' && (
        <div className="space-y-4">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full h-12 px-4 border rounded-lg"
          />

          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="GitHub token (optional)"
            className="w-full h-12 px-4 border rounded-lg"
          />

          <Button fullWidth onClick={handleRepositorySubmit}>
            Fetch Repository
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
