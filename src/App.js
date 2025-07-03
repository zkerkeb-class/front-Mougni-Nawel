"use client"
import { useRoutes } from "react-router-dom"
import { routes } from "./routes"
import { useAuth } from "./helpers/useAuth"
import LoadingScreen from "./components/LoadingScreen"

function App() {
  const { isLoading } = useAuth()
  const routeElements = useRoutes(routes)

  if (isLoading) {
    return <LoadingScreen />
  }

  return routeElements
}

export default App
