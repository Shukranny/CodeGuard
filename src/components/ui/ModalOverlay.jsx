import React, { useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const ModalOverlay = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-4xl',
  showCloseButton = true 
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      const focusableElements = modalRef?.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabIndex="-1"])'
      );
      if (focusableElements?.length > 0) {
        focusableElements?.[0]?.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
      previousFocusRef?.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const handleModalKeyDown = (e) => {
    if (e?.key === 'Tab') {
      const focusableElements = modalRef?.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabIndex="-1"])'
      );
      
      if (!focusableElements || focusableElements?.length === 0) return;

      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements?.length - 1];

      if (e?.shiftKey && document.activeElement === firstElement) {
        e?.preventDefault();
        lastElement?.focus();
      } else if (!e?.shiftKey && document.activeElement === lastElement) {
        e?.preventDefault();
        firstElement?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`modal-content ${maxWidth} animate-scale-in`}
        onKeyDown={handleModalKeyDown}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          {showCloseButton && (
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              <Icon name="X" size={24} />
            </button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;