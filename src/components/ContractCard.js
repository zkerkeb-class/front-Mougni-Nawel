import { Link } from "react-router-dom"

// function ContractCard({ contract }) {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//       <div className="p-4 border-b border-gray-100">
//         <h3 className="font-medium text-lg">{contract.title}</h3>
//         <p className="text-sm text-gray-500">{new Date(contract.uploadDate).toLocaleDateString()}</p>
//       </div>
//       <div className="p-4">
//         <div className="flex justify-between items-center mb-3">
//           <span className="text-sm text-gray-500">Status:</span>
//           <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
//             {contract.status || "Uploaded"}
//           </span>
//         </div>
//         <div className="flex justify-between items-center mb-3">
//           <span className="text-sm text-gray-500">Risk Level:</span>
//           <span
//             className={`px-2 py-1 text-xs font-medium rounded-full ${
//               contract.riskLevel === "high"
//                 ? "bg-red-100 text-red-800"
//                 : contract.riskLevel === "medium"
//                   ? "bg-amber-100 text-amber-800"
//                   : "bg-green-100 text-green-800"
//             }`}
//           >
//             {contract.riskLevel || "Pending"}
//           </span>
//         </div>
//         <div className="mt-4">
//           <Link
//             to={`/contracts/${contract.id}`}
//             className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

function ContractCard({ contract }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 hover:shadow-card transition-smooth cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 bg-gray-50 p-3 rounded-lg">
          <DocumentIcon className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 mb-1">
            {contract.title || `Contrat #${contract._id.slice(-6)}`}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {contract.description || 'Aucune description disponible'}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
              {contract.status === 'analyzed' ? 'Analysé' : 'En attente'}
            </span>
            {contract.riskLevel && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                contract.riskLevel === 'high' ? 'bg-red-50 text-red-600' :
                contract.riskLevel === 'medium' ? 'bg-amber-50 text-amber-600' :
                'bg-green-50 text-green-600'
              }`}>
                {contract.riskLevel === 'high' ? 'Risque élevé' : 
                 contract.riskLevel === 'medium' ? 'Risque modéré' : 'Faible risque'}
              </span>
            )}
          </div>
        </div>
        
        <ChevronRightIcon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
      </div>
    </div>
  )
}

export default ContractCard
