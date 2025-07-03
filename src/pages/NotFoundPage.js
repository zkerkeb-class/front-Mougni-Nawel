import { Link } from "react-router-dom"
import Button from "../components/Button"

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-2 text-sm text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
        </div>
        <div className="mt-8">
          <Button variant="primary" size="lg" fullWidth>
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
