import { useState, useCallback } from "react";

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

const useFormHandling = () => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    touched: false,
    hasAttempted: false,
  });

  const [validationState, setValidationState] = useState<ValidationState>({
    nameValid: false,
    nameError: "",
    inputError: "",
  });

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    setFormState(prev => ({
      ...prev,
      name: value,
      touched: true
    }));

    setValidationState(prev => ({
      ...prev,
      nameValid: value.trim().length > 0,
      nameError: value.trim() ? "" : "Prediction cannot be empty",
      inputError: ""
    }));
  }, []);

  const validateInputs = useCallback((): string => {
    const errors = [];
    
    if (!formState.name.trim()) {
      errors.push("Prediction cannot be empty");
    }

    const errorMessage = errors[0] || "";
    setValidationState(prev => ({
      ...prev,
      inputError: errorMessage,
      nameError: !formState.name.trim() ? "Prediction cannot be empty" : prev.nameError,
    }));

    setFormState(prev => ({ ...prev, hasAttempted: true }));
    return errorMessage;
  }, [formState.name]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateInputs();
    
    if (error) return null;

    // Static values for ticker and description
    const prompt = `${formState.name} | PREDICT | AI-generated prediction NFT`;
    return prompt;
  }, [formState.name, validateInputs]);

  return {
    formState,
    validationState,
    handleNameChange,
    validateInputs,
    handleSubmit
  };
};

export default useFormHandling;
