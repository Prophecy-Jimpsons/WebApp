import React, { ReactNode, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  preventCloseOnClickOutside?: boolean;
  preventCloseOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerContent?: ReactNode;
  headerContent?: ReactNode;
  closeOnClickOutside?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  onAfterClose?: () => void;
  disableScroll?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  preventCloseOnClickOutside = false,
  preventCloseOnEscape = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerContent,
  headerContent,
  closeOnClickOutside = true,
  initialFocus,
  onAfterClose,
  disableScroll = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
    onAfterClose?.();
  }, [onClose, onAfterClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (!preventCloseOnEscape && event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, preventCloseOnEscape, handleClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !preventCloseOnClickOutside &&
        closeOnClickOutside &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, preventCloseOnClickOutside, closeOnClickOutside, handleClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen && disableScroll) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      if (disableScroll) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };
  }, [isOpen, disableScroll]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;

      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }
  }, [isOpen, initialFocus]);

  // Early return if modal is not open
  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay} role="presentation">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`${styles.modal} ${styles[size]} ${className}`}
        tabIndex={-1}
      >
        {(title || headerContent || showCloseButton) && (
          <div className={`${styles.header} ${headerClassName}`}>
            {headerContent || (
              <>
                {title && (
                  <h2 id="modal-title" className={styles.title}>
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className={`${styles.content} ${contentClassName}`}>
          {children}
        </div>

        {footerContent && <div className={styles.footer}>{footerContent}</div>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
