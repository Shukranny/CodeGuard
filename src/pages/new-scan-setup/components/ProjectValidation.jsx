import React from 'react';
import Icon from '../../../components/AppIcon';

const ProjectValidation = ({ validationData }) => {
  if (!validationData) return null;

  const { isValid, languages, fileCount, totalSize, errors, warnings } = validationData;
  const [showAllLanguages, setShowAllLanguages] = React.useState(false);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024)?.toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024)?.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isValid ? 'bg-success/10' : 'bg-error/10'
        }`}>
          <Icon
            name={isValid ? 'CheckCircle' : 'AlertCircle'}
            size={24}
            color={isValid ? 'var(--color-success)' : 'var(--color-error)'}
          />
        </div>
        <div>
          <h3 className="text-base font-heading font-semibold text-foreground">
            {isValid ? 'Project Validated' : 'Validation Failed'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isValid ? 'Ready for security analysis' : 'Please fix the issues below'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Code" size={16} color="var(--color-primary)" />
            <span className="text-xs text-muted-foreground">Languages</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {languages?.length || 0}
          </div>
          {languages && languages?.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {(showAllLanguages ? languages : languages.slice(0, 3)).map(lang => (
                <span
                  key={lang}
                  className='px-1 py-0.5 rounded-full text-xs font-medium text-blue-600'>
                  {lang}
                </span>
              ))}
              {languages?.length > 3 && (
                <span
                  style={{ cursor: "pointer", fontWeight: "bold"}}
                  onClick={() => setShowAllLanguages(!showAllLanguages)}
                  className='px-2 py-0.5 rounded-full bg-gray-300 text-xs font-medium cursor-pointer hover:bg-muted/80 transition'
                >
                  {showAllLanguages
                    ? '-' :
                    `+${languages.length - 3}`}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="FileCode" size={16} color="var(--color-primary)" />
            <span className="text-xs text-muted-foreground">Files</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {fileCount?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="HardDrive" size={16} color="var(--color-primary)" />
            <span className="text-xs text-muted-foreground">Size</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {formatSize(totalSize || 0)}
          </div>
        </div>
      </div>
      {errors && errors?.length > 0 && (
        <div className="space-y-2">
          {errors?.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-error/10 border border-error/20 rounded-lg"
            >
              <Icon name="XCircle" size={18} color="var(--color-error)" className="mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-error">{error?.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{error?.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {warnings && warnings?.length > 0 && (
        <div className="space-y-2">
          {warnings?.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg"
            >
              <Icon name="AlertTriangle" size={18} color="var(--color-warning)" className="mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-warning">{warning?.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{warning?.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectValidation;
