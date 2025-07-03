import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./styles/global.css" // Make sure this path is correct
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { ContractProvider } from "./context/ContractContext"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContractProvider>
          <App />
        </ContractProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
