import { FC, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import styles from "./SupportWidget.module.css";

import { validateField, validateForm } from "./validations";
import { TicketForm, SuccessMessage, FormError } from "./types";
import { submitToSalesforce } from "./salesforce";

export const SupportWidget: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [formData, setFormData] = useState<TicketForm>({
    name: "",
    email: "",
    topic: "",
    description: "",
  });
  const [success, setSuccess] = useState<SuccessMessage>({
    isVisible: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    const fieldError = validateField(name, value);
    setErrors((prev) => {
      const otherErrors = prev.filter((error) => error.field !== name);
      return fieldError ? [...otherErrors, fieldError] : otherErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      submitToSalesforce(formData);

      // Reset form and show success message
      setFormData({
        name: "",
        email: "",
        topic: "",
        description: "",
      });

      setSuccess({
        isVisible: true,
        ticketNumber: "TICKET-" + Math.floor(Math.random() * 10000),
      });
      // Clear any existing errors
      setErrors([]);
    } catch (error) {
      // Handle error case
      setErrors((prev) => [
        ...prev,
        {
          field: "submit",
          message: "Failed to submit ticket. Please try again.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset all states when closing widget
      setSuccess({ isVisible: false, ticketNumber: undefined });
      setErrors([]);
      setIsSubmitting(false);
    }
  };

  // Update the success message reset handler
  const handleNewTicket = () => {
    setSuccess({ isVisible: false, ticketNumber: undefined });
    setErrors([]);
    setFormData({
      name: "",
      email: "",
      topic: "",
      description: "",
    });
  };

  return (
    <div className={styles.widgetContainer}>
      {isOpen ? (
        <div className={styles.supportWindow}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <MessageCircle size={20} />
              <span>Support Ticket</span>
            </div>
            <button onClick={toggleWidget} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>

          {success.isVisible ? (
            <div className={styles.successMessage}>
              <h3>Ticket Created Successfully!</h3>
              <p>TThank you for reaching out. We will get back to you soon.</p>
              {success.ticketNumber && (
                <p className={styles.ticketNumber}>
                  Reference Number: {success.ticketNumber}
                </p>
              )}
              <p className={styles.spamNote}>
                Please check your inbox and spam folder for a confirmation
                email.
              </p>
              <button
                onClick={handleNewTicket}
                className={styles.newTicketButton}
              >
                Submit Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.ticketForm}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={styles.input}
                  disabled={isSubmitting}
                />
                {errors.find((e) => e.field === "name") && (
                  <span className={styles.errorText}>
                    {errors.find((e) => e.field === "name")?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className={styles.input}
                  disabled={isSubmitting}
                />
                {errors.find((e) => e.field === "email") && (
                  <span className={styles.errorText}>
                    {errors.find((e) => e.field === "email")?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isSubmitting}
                >
                  <option value="">Select Topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing</option>
                  <option value="feature">Feature Request</option>
                </select>
                {errors.find((e) => e.field === "topic") && (
                  <span className={styles.errorText}>
                    {errors.find((e) => e.field === "topic")?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  className={styles.textarea}
                  rows={4}
                  disabled={isSubmitting}
                />
                {errors.find((e) => e.field === "description") && (
                  <span className={styles.errorText}>
                    {errors.find((e) => e.field === "description")?.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                <Send size={20} />
                <span>{isSubmitting ? "Submitting..." : "Submit Ticket"}</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        <button onClick={toggleWidget} className={styles.floatingButton}>
          <MessageCircle size={24} />
          <span>Support</span>
        </button>
      )}
    </div>
  );
};

export default SupportWidget;
