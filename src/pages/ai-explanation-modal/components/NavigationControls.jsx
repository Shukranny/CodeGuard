import React from 'react';
import Button from '../../../components/ui/Button';

const NavigationControls = ({ 
  currentIndex, 
  totalCount, 
  onPrevious, 
  onNext,
  onCopyCode,
  onBookmark,
  onShare,
  isBookmarked
}) => {
  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            iconPosition="left"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-none"
          >
            Previous
          </Button>
          <div className="px-4 py-2 bg-muted rounded-md">
            <span className="text-sm font-medium text-foreground">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            iconPosition="right"
            onClick={onNext}
            disabled={currentIndex === totalCount - 1}
            className="flex-1 sm:flex-none"
          >
            Next
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            onClick={onCopyCode}
            className="flex-1 sm:flex-none"
          >
            Copy Fix
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
            iconPosition="left"
            onClick={onBookmark}
            className="flex-1 sm:flex-none"
          >
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            iconPosition="left"
            onClick={onShare}
            className="flex-1 sm:flex-none"
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationControls;
