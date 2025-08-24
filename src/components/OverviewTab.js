function OverviewTab({ contract, analysis, result }) {

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contract Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Contract Details</h3>
          <div className="space-y-3">
            <InfoRow label="File Name" value={contract.fileName || "N/A"} />
            <InfoRow
              label="File Type"
              value={contract.fileType?.split("/")[1]?.toUpperCase() || "TXT"}
            />
            <InfoRow
              label="File Size"
              value={contract.fileSize ? (contract.fileSize / 1024).toFixed(2) + " KB" : "N/A"}
            />
            <InfoRow
              label="Upload Date"
              value={formatDate(contract.createdAt)}
            />
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Analysis Summary</h3>
          {analysis ? (
            <div className="space-y-3">
              <InfoRow
                label="Risk Level"
                value={analysis.riskLevel || "Pending"}
                color={analysis.riskLevel}
              />
              <InfoRow
                label="Clause problématique trouvé"
                value={result?.clauses_abusives?.length || 0}
              />
              <InfoRow
                label="Risque trouvé"
                value={result?.risks?.length || 0}
              />
              <InfoRow
                label="Analysis Date"
                value={formatDate(analysis?.analysisDate)}
              />
              {/* ... reste inchangé */}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No analysis data available</p>
          )}

        </div>
      </div>

      {/* Sensitive Data */}
      {contract.sensitiveItems?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Sensitive Data</h3>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="mb-3 font-medium text-amber-800">
              {contract.sensitiveItems.length} Sensitive Items Detected
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {contract.sensitiveItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-100"
                >
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded mr-2">
                      {item.type}
                    </span>
                    <span className="font-mono text-sm">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, color }) {
  const colorMap = {
    high: "text-red-600",
    medium: "text-amber-600",
    low: "text-green-600"
  };
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${color ? colorMap[color] : ""}`}>{value}</span>
    </div>
  );
}

export default OverviewTab;
