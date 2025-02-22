import { useState, useCallback } from "react";

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

const useFormHandling = () => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    symbol: "",
    description: "",
    touched: false,
    hasAttempted: false,
  });

  const [validationState, setValidationState] = useState<ValidationState>({
    nameValid: false,
    symbolValid: false,
    descriptionValid: false,
    nameError: "",
    symbolError: "",
    descriptionError: "",
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

  const handleSymbolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toUpperCase();
    const symbolPattern = /^[A-Z0-9]{1,10}$/;
    
    setFormState(prev => ({
      ...prev,
      symbol: value,
      touched: true
    }));

    let isValid = false;
    let error = "";
    
    if (!value) {
      error = "Ticker cannot be empty";
    } else if (!symbolPattern.test(value)) {
      error = "Ticker must be 1-10 letters/numbers, no spaces";
    } else {
      isValid = true;
    }

    setValidationState(prev => ({
      ...prev,
      symbolValid: isValid,
      symbolError: error,
      inputError: prev.inputError === error ? prev.inputError : ""
    }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trimStart();
    setFormState(prev => ({
      ...prev,
      description: value,
      touched: true
    }));

    let isValid = false;
    let error = "";
    
    if (!value.trim()) {
      error = "Description cannot be empty";
    } else if (value.length > 200) {
      error = "Must be less than 200 characters";
    } else {
      isValid = true;
    }

    setValidationState(prev => ({
      ...prev,
      descriptionValid: isValid,
      descriptionError: error,
      inputError: prev.inputError === error ? prev.inputError : ""
    }));
  }, []);

  const validateInputs = useCallback((): string => {
    const errors = [];
    
    if (!formState.name.trim()) {
      errors.push("Prediction cannot be empty");
    }
    
    if (!formState.symbol.trim()) {
      errors.push("Ticker cannot be empty");
    } else if (!/^[A-Z0-9]{1,10}$/.test(formState.symbol)) {
      errors.push("Ticker must be 1-10 letters/numbers, no spaces");
    }
    
    if (!formState.description.trim()) {
      errors.push("Description cannot be empty");
    } else if (formState.description.length > 200) {
      errors.push("Description must be less than 200 characters");
    }

    const errorMessage = errors[0] || "";
    setValidationState(prev => ({
      ...prev,
      inputError: errorMessage,
      nameError: !formState.name.trim() ? "Prediction cannot be empty" : prev.nameError,
      symbolError: !formState.symbol.trim() ? "Ticker cannot be empty" : prev.symbolError,
      descriptionError: !formState.description.trim() ? "Description cannot be empty" : prev.descriptionError
    }));

    setFormState(prev => ({ ...prev, hasAttempted: true }));
    return errorMessage;
  }, [formState.name, formState.symbol, formState.description]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateInputs();
    
    if (error) return; // Stop if validation fails

    // Construct prompt from current form state
    const prompt = `${formState.name} | ${formState.symbol} | ${formState.description}`;
    
    // Return the validated prompt for NFT generation
    return prompt;
  }, [formState.name, formState.symbol, formState.description, validateInputs]);

  return {
    formState,
    validationState,
    handleNameChange,
    handleSymbolChange,
    handleDescriptionChange,
    validateInputs,
    handleSubmit,
    setFormState
  };
};

export default useFormHandling;
