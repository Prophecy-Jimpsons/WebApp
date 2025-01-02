/// <reference types="vite/client" />

// Declaratoin for CSS Modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
