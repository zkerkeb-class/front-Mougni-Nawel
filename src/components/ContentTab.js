import { FaBalanceScale } from 'react-icons/fa'
import { FiFileText, FiClock } from 'react-icons/fi'

function ContentTab({ contract = {} }) {
  return (
    <div className="flex justify-center py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-4xl bg-white rounded-xl p-10 shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-300 print:border-0 print:shadow-none">
        {/* En-tête avec positionnement précis */}
        <div className="text-center mb-10 pb-6 border-b border-gray-100">
          {/* Titre avec logo au milieu */}
          <div className="flex justify-center items-center space-x-6 mb-4">
            <h1 className="text-3xl font-light uppercase tracking-wider text-gray-900">
              CONTRACT
            </h1>
            
            {/* Logo au milieu */}
            <div className="bg-gray-800 p-2 rounded-full shadow-md flex items-center justify-center w-10 h-10">
              <FaBalanceScale className="text-white text-xl" />
            </div>
            
            <h1 className="text-3xl font-light uppercase tracking-wider text-gray-900">
              DOCUMENT
            </h1>
          </div>
          
          <p className="text-xs text-gray-400 mt-4 tracking-[0.2em] uppercase">
            {contract.reference || "REFERENCE NUMBER"}
          </p>
        </div>

        {/* Contenu du document */}
        <div className="font-serif text-gray-700 leading-relaxed tracking-wide bg-white p-8 rounded-lg border border-gray-100">
          {contract.data?.content ? (
            <div className="prose max-w-none">
              <div className="text-sm text-gray-500 mb-6 border-b pb-4 border-gray-100">
                <p className="uppercase tracking-wider text-xs mb-2">Analyse ContractAI</p>
                <p className="text-gray-400 italic">Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="whitespace-pre-wrap text-gray-800">
                {contract.data.content}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiFileText className="mx-auto text-gray-200 text-4xl mb-4" />
              <p className="text-gray-300 font-light italic tracking-wide">
                Aucun contenu disponible
              </p>
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
              ID: {contract.data?._id?.slice(0, 8).toUpperCase() || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <FiClock className="text-gray-300" />
            <span>
              {contract.data?.createdAt ? new Date(contract.data.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
            </span>
          </div>
          <div className="text-gray-400">
            Page <span className="font-medium">1</span> sur {contract.pageCount || 1}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentTab