import React from 'react';

import Button from '../../../components/ui/Button';

const ModalFooter = ({ onClose, onMarkFalsePositive, onExport, onShare }) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 md:p-6 border-t border-border bg-surface">
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkFalsePositive}
          iconName="XCircle"
          iconPosition="left"
          fullWidth
          className="sm:w-auto"
        >
          Mark as False Positive
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          iconName="Share2"
          iconPosition="left"
          fullWidth
          className="sm:w-auto"
        >
          Share with Team
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          iconName="Download"
          iconPosition="left"
          fullWidth
          className="sm:w-auto"
        >
          Export Finding
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onClose}
          iconName="CheckCircle"
          iconPosition="left"
          fullWidth
          className="sm:w-auto"
        >
          Mark as Resolved
        </Button>
      </div>
    </div>
  );
};

export default ModalFooter;