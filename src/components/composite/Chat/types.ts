export interface TicketForm {
    name: string;
    email: string;
    topic: string;
    description: string;
  }
  
  export interface SuccessMessage {
    isVisible: boolean;
    ticketNumber?: string;
  }
  
  export interface FormError {
    field: string;
    message: string;
  }
  