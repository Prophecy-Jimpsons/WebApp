import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { memo } from "react";
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

const ErrorMessage = memo(
  ({ message, size = 16 }: { message: string; size?: number }) => (
    <div className={styles.errorMessage}>
      <AlertCircle size={size} />
      {message}
    </div>
  ),
);

const ButtonContent = memo(({ isLoading }: { isLoading: boolean }) =>
  isLoading ? (
    <>
      <RefreshCw className={styles.spinIcon} size={20} />
      Generating...
    </>
  ) : (
    <>
      <Sparkles className={styles.buttonIcon} size={20} />
      Generate NFT
    </>
  ),
);

const FormSection = ({
  formState,
  validationState,
  handleNameChange,
  handleSubmit,
  connected,
  isLoading,
}: FormSectionProps) => {
  const isFieldInvalid = validationState.nameError && formState.touched;
  const isFieldValid = validationState.nameValid && formState.touched;
  const isButtonDisabled =
    !connected || isLoading || !validationState.nameValid;

  return (
    <div className={styles.inputSection}>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.inputLabel} htmlFor="prediction-input">
            Enter Your Prediction
          </label>
          <input
            id="prediction-input"
            type="text"
            className={`${styles.inputField} 
              ${isFieldInvalid ? styles.error : ""} 
              ${isFieldValid ? styles.valid : ""}`}
            placeholder="Example: Bitcoin will reach $100K by Dec 2024"
            value={formState.name}
            onChange={handleNameChange}
            disabled={!connected || isLoading}
            aria-invalid={isFieldInvalid ? "true" : "false"}
            aria-describedby={isFieldInvalid ? "prediction-error" : undefined}
          />
          {isFieldInvalid && (
            <div id="prediction-error" className={styles.fieldError}>
              <AlertCircle size={12} />
              {validationState.nameError}
            </div>
          )}
        </div>

        {validationState.inputError && formState.touched && (
          <ErrorMessage message={validationState.inputError} />
        )}

        {!connected ? (
          <div className={styles.walletButtonWrapper}>
            <WalletMultiButton>Connect Wallet to Predict</WalletMultiButton>
          </div>
        ) : (
          <button
            className={styles.generateButton}
            type="submit"
            disabled={isButtonDisabled}
            aria-busy={isLoading}
          >
            <ButtonContent isLoading={isLoading} />
          </button>
        )}
      </form>
    </div>
  );
};

export default memo(FormSection);
