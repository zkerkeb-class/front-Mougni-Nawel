import { Link } from "react-router-dom"

function ContractCard({ contract }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-lg">{contract.title}</h3>
        <p className="text-sm text-gray-500">{new Date(contract.uploadDate).toLocaleDateString()}</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Status:</span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            {contract.status || "Uploaded"}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Risk Level:</span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              contract.riskLevel === "high"
                ? "bg-red-100 text-red-800"
                : contract.riskLevel === "medium"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {contract.riskLevel || "Pending"}
          </span>
        </div>
        <div className="mt-4">
          <Link
            to={`/contracts/${contract.id}`}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ContractCard
