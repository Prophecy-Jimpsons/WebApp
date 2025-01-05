import { TicketForm } from "./types";

export const submitToSalesforce = (formData: TicketForm) => {
  // Create hidden iframe
  const iframe = document.createElement("iframe");
  iframe.name = "hidden_iframe";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  // Create form
  const form = document.createElement("form");
  form.method = "POST";
  form.action =
    "https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8";
  form.target = "hidden_iframe";

  // Add required fields
  const fields = {
    orgid: "00Daj00000K8g09",
    name: formData.name,
    email: formData.email,
    subject: formData.topic,
    description: formData.description,
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  // Submit and cleanup
  document.body.appendChild(form);
  form.submit();

  setTimeout(() => {
    document.body.removeChild(form);
    document.body.removeChild(iframe);
  }, 1000);
};
