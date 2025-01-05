// validations.ts
import { FormError, TicketForm } from "./types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateField = (
  name: string,
  value: string,
): FormError | null => {
  switch (name) {
    case "name":
      if (!value.trim()) {
        return { field: name, message: "Name is required" };
      }
      break;
    case "email":
      if (!value.trim() || !validateEmail(value)) {
        return { field: name, message: "Valid email is required" };
      }
      break;
    case "topic":
      if (!value) {
        return { field: name, message: "Please select a topic" };
      }
      break;
    case "description":
      if (value.length < 5) {
        return {
          field: name,
          message: "Description must be at least 5 characters",
        };
      }
      break;
  }
  return null;
};

export const validateForm = (formData: TicketForm): FormError[] => {
  const errors: FormError[] = [];
  const fields: (keyof TicketForm)[] = [
    "name",
    "email",
    "topic",
    "description",
  ];

  fields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors.push(error);
    }
  });

  return errors;
};
