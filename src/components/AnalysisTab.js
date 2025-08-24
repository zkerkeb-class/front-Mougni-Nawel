function AnalysisTab({ contract, analysis, result }) {
  const risks = result?.risks || [];
  const clauses = result?.clauses_abusives || [];

  const hasIssues = risks.length > 0 || clauses.length > 0;

  return (
    <div>
      {analysis ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">AI Analysis Summary</h3>
            <p className="text-gray-700">
              {result?.overview || "No summary available."}
            </p>
          </div>

          {/* Risks */}
          {risks.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Identified Risks</h3>
              <div className="space-y-4">
                {risks.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${issue.risk === "high"
                        ? "bg-red-50 border-red-100"
                        : issue.risk === "medium"
                          ? "bg-amber-50 border-amber-100"
                          : "bg-blue-50 border-blue-100"
                      }`}
                  >
                    <div className="flex items-center mb-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${issue.risk === "high"
                            ? "bg-red-500"
                            : issue.risk === "medium"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                      ></span>
                      <h4
                        className={`font-medium ${issue.risk === "high"
                            ? "text-red-800"
                            : issue.risk === "medium"
                              ? "text-amber-800"
                              : "text-blue-800"
                          }`}
                      >
                        {issue.risk}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700">{issue.explanation}</p>
                    {issue.suggested_solution && (
                      <div className="mt-2 text-sm font-medium">
                        Recommendation: {issue.suggested_solution}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Abusive Clauses */}
          {clauses.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Abusive Clauses</h3>
              <div className="space-y-4">
                {clauses.map((clause, index) => (
                  <div key={index} className="p-4 rounded-lg border border-red-200 bg-red-50">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Clause:</strong> {clause.clause}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Explanation:</strong> {clause.explanation}
                    </p>
                    {clause.suggested_change && (
                      <p className="text-sm text-gray-700">
                        <strong>Suggested Change:</strong> {clause.suggested_change}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasIssues && (
            <div className="text-center py-8">
              <svg
                className="h-12 w-12 text-green-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-700">No significant risks or abusive clauses found.</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No analysis available for this contract.</p>
      )}
    </div>
  );
}

export default AnalysisTab;
