import { Link } from "react-router-dom"

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
