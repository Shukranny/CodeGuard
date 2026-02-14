import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useScanProgress } from '../../../context/ScanProgressContext';

const UploadSection = ({ onFileSelect, onRepositorySubmit, uploadProgress }) => {
  const { initiateScan } = useScanProgress();
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isDragging, setIsDragging] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileSelection(files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file && file?.name?.endsWith('.zip')) {
      setSelectedFile(file);
      onFileSelect(file);
      // Initialize scan progress with file upload data
      initiateScan({
        projectData: {
          type: 'file',
          filename: file?.name,
          size: file?.size,
          uploadDate: new Date().toISOString()
        }
      });
    } else {
      alert('Please select a valid ZIP file');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleRepositorySubmit = () => {
    if (!repoUrl?.trim()) {
      alert('Please enter a valid repository URL');
      return;
    }
    const repoData = { url: repoUrl, token: githubToken };
    onRepositorySubmit(repoData);
    // Initialize scan progress with repository data
    initiateScan({
      projectData: {
        type: 'github',
        url: repoUrl,
        uploadDate: new Date().toISOString()
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
        <button
          onClick={() => setUploadMethod('file')}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
            font-medium text-sm transition-smooth
            ${uploadMethod === 'file' ?'bg-card text-foreground shadow-glow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <Icon name="Upload" size={18} />
          <span>Upload ZIP</span>
        </button>
        <button
          onClick={() => setUploadMethod('github')}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
            font-medium text-sm transition-smooth
            ${uploadMethod === 'github' ?'bg-card text-foreground shadow-glow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <Icon name="Github" size={18} />
          <span>GitHub Repo</span>
        </button>
      </div>
      {uploadMethod === 'file' && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 md:p-12 text-center
              transition-smooth cursor-pointer
              ${isDragging
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
              }
            `}
            onClick={() => fileInputRef?.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Upload" size={32} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
                  {selectedFile ? selectedFile?.name : 'Drop your ZIP file here'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  or click to browse • Maximum size: 500MB
                </p>
              </div>
              {!selectedFile && (
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground mb-1">
                    File Selected
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedFile?.name} • {(selectedFile?.size / 1024 / 1024)?.toFixed(2)} MB
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="text-primary font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {uploadMethod === 'github' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Repository URL <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Icon
                name="Github"
                size={18}
                color="var(--color-muted-foreground)"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e?.target?.value)}
                placeholder="https://github.com/username/repository"
                className="w-full h-12 pl-10 pr-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-smooth"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the full URL of your public or private GitHub repository
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              GitHub Token (Optional)
            </label>
            <div className="relative">
              <Icon
                name="Key"
                size={18}
                color="var(--color-muted-foreground)"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e?.target?.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full h-12 pl-10 pr-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-smooth"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Required for private repositories. Generate token with 'repo' scope
            </p>
          </div>

          <Button
            variant="default"
            fullWidth
            onClick={handleRepositorySubmit}
            iconName="Download"
            iconPosition="left"
            disabled={!repoUrl?.trim()}
          >
            Fetch Repository
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
