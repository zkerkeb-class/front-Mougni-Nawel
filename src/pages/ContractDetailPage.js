import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContract } from "../helpers/useContract";
import Button from "../components/Button";
import { getContract } from "../services/contractService";
import OverviewTab from "../components/OverviewTab";
import ContentTab from "../components/ContentTab";
import AnalysisTab from "../components/AnalysisTab";

function ContractDetailPage() {
  const { id } = useParams();
  const { getAnalysis } = useContract();
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const contractData = await getContract(id);
        setContract(contractData);
      } catch (error) {
        console.error("Error fetching contract:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
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
    );
  }

  const parseResult = () => {
    try {
      const analysisData = contract.data?.analyses?.[0];
      return analysisData?.result || {};
    } catch (e) {
      console.error("Error parsing result:", e);
      return {};
    }
  };

  const activeAnalysis = contract.data?.analyses?.[0];
  const result = parseResult();


  return (
    <div className="px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{contract.title}</h1>
          <p className="text-gray-500 mt-1">
            Uploaded on {new Date(contract.data.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${activeAnalysis?.riskLevel === "high"
              ? "bg-red-100 text-red-800"
              : activeAnalysis?.riskLevel === "medium"
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {activeAnalysis?.riskLevel || "Pending"} Risk
          </span>
          <Button variant="secondary">Download</Button>
          <Button variant="primary">Share</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-100">
          <nav className="flex">
            {["overview", "content", "analysis"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === tab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <OverviewTab contract={contract.data} analysis={activeAnalysis} result={result} />
          )}

          {activeTab === "content" && (
            <ContentTab contract={contract} />
          )}

          {activeTab === "analysis" && (
            <AnalysisTab contract={contract.data} analysis={activeAnalysis} result={result} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractDetailPage;
