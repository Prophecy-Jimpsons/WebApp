import { FC, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import styles from "./SupportWidget.module.css";

interface TicketForm {
  name: string;
  email: string;
  topic: string;
  description: string;
}

interface SuccessMessage {
  isVisible: boolean;
  ticketNumber?: string;
}

export const SupportWidget: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<TicketForm>({
    name: "",
    email: "",
    topic: "",
    description: "",
  });
  const [success, setSuccess] = useState<SuccessMessage>({
    isVisible: false,
  });

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSuccess({ isVisible: false });
    }
  };

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would make your Salesforce API call
      // const response = await createSalesforceTicket(formData);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSuccess({
        isVisible: true,
        ticketNumber: "TICKET-" + Math.floor(Math.random() * 10000),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        topic: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      // Handle error case
    }
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
              <p>Thank you for reaching out. We will get back to you soon.</p>
              {success.ticketNumber && (
                <p className={styles.ticketNumber}>
                  Ticket Number: {success.ticketNumber}
                </p>
              )}
              <button
                onClick={() => setSuccess({ isVisible: false })}
                className={styles.newTicketButton}
              >
                Create New Ticket
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
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  className={styles.textarea}
                  required
                  rows={4}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                <Send size={20} />
                <span>Submit Ticket</span>
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
