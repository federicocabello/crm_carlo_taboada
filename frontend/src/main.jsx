import React from "react";
import { createRoot } from "react-dom/client"; // Importa createRoot correctamente
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Asegúrate de envolver App con BrowserRouter
import "./index.css"; // Si tienes un archivo de estilos

// Selecciona el elemento raíz de tu HTML
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró un elemento con id 'root'. Asegúrate de que exista en tu index.html.");
}

// Crea el root y renderiza la aplicación
const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
