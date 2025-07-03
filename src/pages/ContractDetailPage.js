"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useContract } from "../helpers/useContract"
import Button from "../components/Button"
import { getContract } from "../services/contractService"

function ContractDetailPage() {
  const { id } = useParams()
  const { getAnalysis } = useContract();
  const [contract, setContract] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const contractData = await getContract(id)
        console.log('ete : ', contractData);
        setContract(contractData)

        if (contractData?.analysisId) {
          const analysisData = getAnalysis(contractData.analysisId)
          setAnalysis(analysisData)
        }
      } catch (error) {
        console.error("Error fetching contract:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, getContract, getAnalysis])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="text-xl font-semibold mb-2">Contract Not Found</h2>
        <p className="text-gray-500">The contract you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{contract.title}</h1>
          <p className="text-gray-500 mt-1">Uploaded on {new Date(contract.uploadDate).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${contract.riskLevel === "high"
              ? "bg-red-100 text-red-800"
              : contract.riskLevel === "medium"
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
              }`}
          >
            {contract.riskLevel || "Pending"} Risk
          </span>
          <Button variant="secondary">Download</Button>
          <Button variant="primary">Share</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-100">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === "overview"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === "content"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("content")}
            >
              Content
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === "analysis"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("analysis")}
            >
              AI Analysis
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Contract Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">File Name</span>
                      <span className="text-sm font-medium">{contract.fileName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">File Type</span>
                      <span className="text-sm font-medium">
                        {contract.fileType?.split("/")[1]?.toUpperCase() || "TXT"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">File Size</span>
                      <span className="text-sm font-medium">
                        {contract.fileSize ? (contract.fileSize / 1024).toFixed(2) + " KB" : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Upload Date</span>
                      <span className="text-sm font-medium">{new Date(contract.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Analysis Summary</h3>
                  {contract !== null ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Risk Level</span>
                        <span
                          className={`text-sm font-medium ${contract?.data?.analyses[0]?.riskLevel === "high"
                            ? "text-red-600"
                            : contract?.data?.analyses[0].riskLevel === "medium"
                              ? "text-amber-600"
                              : "text-green-600"
                            }`}
                        >
                          {contract?.data?.analyses[0].riskLevel || "Pending"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Clause problematique trouvé</span>
                        <span className="text-sm font-medium">
                          {
                            (() => {
                              try {
                                const parsed = JSON.parse(contract?.data?.analyses[0].result);

                                return parsed.analysis_summary?.clauses_abusives?.length || 0;
                              } catch {
                                return 0;
                              }
                            })()
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Risque trouvé</span>
                        <span className="text-sm font-medium">
                          {
                            (() => {
                              try {
                                const parsed = JSON.parse(contract?.data?.analyses[0].result);

                                return parsed.analysis_summary?.risks?.length || 0;
                              } catch {
                                return 0;
                              }
                            })()
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Analysis Date</span>
                        <span className="text-sm font-medium">
                          {new Date(contract?.data?.analyses[0].analysisDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* ✅ Show Overview if available */}
                      <div>
                        <span className="text-sm text-gray-600">Overview</span><br />
                        <p className="text-sm font-medium">
                          {
                            (() => {
                              try {
                                return JSON.parse(contract?.data?.analyses[0].result).analysis_summary.overview;
                                // return JSON.stringify(contract.result[0]).analysis_summary?.overview || "No overview found.";
                              } catch (e) {
                                return "Invalid analysis data.";
                              }
                            })()
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No analysis data available</p>
                    </div>
                  )}

                </div>
              </div>

              {contract.sensitiveItems && contract.sensitiveItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Sensitive Data</h3>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <svg
                        className="h-5 w-5 text-amber-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <h4 className="font-medium text-amber-800">
                        {contract.sensitiveItems.length} Sensitive Data Items Detected
                      </h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {contract.sensitiveItems.map((item, index) => (
                        <div
                          key={index}
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
          )}


          {activeTab === "content" && (
            <div className="flex justify-center py-6 bg-white">
              <div className="w-full max-w-3xl border border-gray-200 rounded p-6 print:border-0 print:shadow-none">
                <div className="text-center mb-6 border-b border-gray-200 pb-3">
                  <h1 className="text-2xl font-bold text-gray-900">Contract Document</h1>
                  <p className="text-sm text-gray-600 mt-1">Reference: {contract.reference || "N/A"}</p>
                </div>
                <div className="font-serif text-base text-gray-800 leading-7 whitespace-pre-wrap">
                  {contract.data.content}
                </div>
                <div className="mt-6 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                  <span>Document ID: {contract.id}</span>
                  <span>Page 1 of {contract.pageCount || 1}</span>
                </div>
              </div>
            </div>
          )}


          {activeTab === "analysis" && (
            <div>
              {contract ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-3">AI Analysis Summary</h3>
                    <p className="text-gray-700">{JSON.parse(contract?.data?.analyses[0].result).analysis_summary?.overview || "No summary available."}</p>
                  </div>

                  {JSON.parse(contract?.data?.analyses[0].result).analysis_summary?.risks && JSON.parse(contract?.data?.analyses[0].result).analysis_summary?.risks?.length > 0 ? (
                    <div>
                      <h3 className="font-medium mb-3">Identified Risks</h3>
                      <div className="space-y-4">
                        {JSON.parse(contract?.data?.analyses[0].result).analysis_summary?.risks.map((issue, index) => (
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
                            <p
                              className={`text-sm ${issue.severity === "high"
                                ? "text-red-700"
                                : issue.severity === "medium"
                                  ? "text-amber-700"
                                  : "text-blue-700"
                                }`}
                            >
                              {issue.explanation}
                            </p>
                            {issue.suggested_solution && (
                              <div className="mt-2 text-sm font-medium">Recommendation: {issue.suggested_solution}</div>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Abusive Clauses Section */}
                      {JSON.parse(contract?.data?.analyses[0].result).analysis_summary?.clauses_abusives?.length > 0 && (
                        <div>
                          <br />
                          <h3 className="font-medium mb-3">Abusive Clauses</h3>
                          <div className="space-y-4">
                            {JSON.parse(contract?.data?.analyses[0].result).analysis_summary.clauses_abusives.map((item, index) => (
                              <div key={index} className="p-4 rounded-lg border border-red-200 bg-red-50">
                                <p className="text-sm text-gray-700 mb-2"><strong>Clause:</strong> {item.clause}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Explanation:</strong> {item.explanation}</p>
                                {item.suggested_change && (
                                  <p className="text-sm text-gray-700"><strong>Suggested Change:</strong> {item.suggested_change}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="h-12 w-12 text-green-500 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No issues found</h3>
                      <p className="text-gray-500">This contract appears to be free of significant issues.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No analysis available</h3>
                  <p className="text-gray-500 mb-4">This contract hasn't been analyzed yet.</p>
                  <Button variant="primary">Analyze Now</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContractDetailPage
