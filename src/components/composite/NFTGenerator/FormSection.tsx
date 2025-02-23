import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import styles from "./styles/FormSection.module.css";

interface FormState {
  name: string;
  touched: boolean;
  hasAttempted: boolean;
}

interface ValidationState {
  nameValid: boolean;
  nameError: string;
  inputError: string;
}

interface FormSectionProps {
  formState: FormState;
  validationState: ValidationState;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
            !validationState.nameValid
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
