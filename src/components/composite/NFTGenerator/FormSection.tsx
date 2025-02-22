import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import styles from "./styles/FormSection.module.css";

interface FormState {
  name: string;
  symbol: string;
  description: string;
  touched: boolean;
  hasAttempted: boolean;
}

interface ValidationState {
  nameValid: boolean;
  symbolValid: boolean;
  descriptionValid: boolean;
  nameError: string;
  symbolError: string;
  descriptionError: string;
  inputError: string;
}

interface FormSectionProps {
  formState: FormState;
  validationState: ValidationState;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSymbolChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  validateInputs: () => string;
  connected: boolean;
  isLoading: boolean;
  generationError: boolean;
}

const FormSection = ({
  formState,
  validationState,
  handleNameChange,
  handleSymbolChange,
  handleDescriptionChange,
  handleSubmit,
  connected,
  isLoading,
}: FormSectionProps) => {
  return (
    <div className={styles.inputSection}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Enter Your Prediction</label>
          <input
            type="text"
            className={`${styles.inputField} 
              ${validationState.nameError && formState.touched ? styles.error : ""} 
              ${validationState.nameValid && formState.touched ? styles.valid : ""}`}
            placeholder="Example: Bitcoin will reach $100K by Dec 2024"
            value={formState.name}
            onChange={handleNameChange}
            disabled={!connected || isLoading}
          />
          {validationState.nameError && formState.touched && (
            <div className={styles.fieldError}>
              <AlertCircle size={12} />
              {validationState.nameError}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Prediction Ticker / Token Symbol</label>
          <input
            type="text"
            className={`${styles.inputField} 
              ${validationState.symbolError && formState.touched ? styles.error : ""} 
              ${validationState.symbolValid && formState.touched ? styles.valid : ""}`}
            placeholder="Example: BTC100K"
            value={formState.symbol}
            onChange={handleSymbolChange}
            maxLength={10}
            disabled={!connected || isLoading}
          />
          {validationState.symbolError && formState.touched && (
            <div className={styles.fieldError}>
              <AlertCircle size={12} />
              {validationState.symbolError}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Brief Description</label>
          <textarea
            className={`${styles.descriptionField} 
              ${validationState.descriptionError && formState.touched ? styles.error : ""} 
              ${validationState.descriptionValid && formState.touched ? styles.valid : ""}`}
            placeholder="Brief details about your prediction"
            value={formState.description}
            onChange={handleDescriptionChange}
            disabled={!connected || isLoading}
          />
          {validationState.descriptionError && formState.touched && (
            <div className={styles.fieldError}>
              <AlertCircle size={12} />
              {validationState.descriptionError}
            </div>
          )}
        </div>

        {validationState.inputError && formState.touched && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} />
            {validationState.inputError}
          </div>
        )}

        <button
          className={styles.generateButton}
          type="submit"
          disabled={
            !connected ||
            isLoading ||
            !validationState.nameValid ||
            !validationState.symbolValid ||
            !validationState.descriptionValid
          }
        >
          {isLoading ? (
            <>
              <RefreshCw className={styles.spinIcon} size={20} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className={styles.buttonIcon} size={20} />
              Generate NFT
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FormSection;
