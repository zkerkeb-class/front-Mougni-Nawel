"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useContract } from "../helpers/useContract"
import Button from "../components/Button"
import Input from "../components/Input"
import Stepper from "../components/Stepper"
import ContractPreview from "../components/ContractPreview"
import { detectSensitiveData } from "../utils/textProcessing"
import mammoth from "mammoth"
import { analyzeContract, saveContract } from "../services/contractService"

function UploadPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [contractData, setContractData] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const [isParsing, setIsParsing] = useState(false)
  const [parsingProgress, setParsingProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate()

  const steps = [
    {
      title: "Upload",
      description: "Select your contract",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
    },
    {
      title: "Review",
      description: "Remove sensitive data",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },

    {
      title: "Submit",
      description: "Send for analysis",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
  ]

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    setError(null)
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (selectedFile) => {
    const isPDF = selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")
    const isDOCX =
      selectedFile.type === "application/msword" ||
      selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      selectedFile.name.endsWith(".docx") ||
      selectedFile.name.endsWith(".doc")
    const isTXT = selectedFile.type === "text/plain" || selectedFile.name.endsWith(".txt")

    if (!isPDF && !isDOCX && !isTXT) {
      setError("Invalid file type. Please upload a PDF, DOCX, or TXT file.")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.")
      return
    }

    setFile(selectedFile)
    setError(null)

    const fileName = selectedFile.name
    const titleFromName = fileName.split(".").slice(0, -1).join(".")
    setTitle(titleFromName)

    if (isTXT) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          const fileContent = e.target.result
          setContent(fileContent)
        }
      }
      reader.readAsText(selectedFile)
      return
    }

    setIsParsing(true)
    setParsingProgress(0)

    const totalSteps = 10
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setParsingProgress(Math.round((currentStep / totalSteps) * 100))

      if (currentStep >= totalSteps) {
        clearInterval(interval)
        setIsParsing(false)

        if (isDOCX) {
          const reader = new FileReader()
          reader.onload = async (e) => {
            const arrayBuffer = e.target.result
            const result = await mammoth.extractRawText({ arrayBuffer })
            setContent(result.value)
            setIsParsing(false)
          }
          reader.readAsArrayBuffer(selectedFile)
          return
        }
      }
    }, 300)
  }


  const handleContinue = () => {
    if (currentStep === 0) {
      if (!title.trim()) {
        setError("Please enter a title for your document.")
        return
      }

      if (!content.trim() && !file) {
        setError("Please enter or upload contract text.")
        return
      }

      const sensitiveItems = detectSensitiveData(content)

      const contractData = {
        title,
        content,
        originalContent: content,
        fileName: file?.name,
        fileType: file?.type || "text/plain",
        fileSize: file?.size || content.length,
        uploadDate: new Date(),
        sensitiveDataCount: sensitiveItems.length,
        sensitiveItems,
      }

      setContractData(contractData)
    }

    setCurrentStep(currentStep + 1)
  }

  const handleContentEdit = useCallback((updatedData) => {
    setContractData(updatedData)
  }, [])

  const handleSubmitToAI = useCallback(async () => {
    if (isSubmitting) {
      console.log("Soumission déjà en cours, ignorée");
      return;
    }

    setIsSubmitting(true);
    setUploadStatus("uploading");

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStatus("analyzing");

            setTimeout(async () => {
              try {
                const resContract = await saveContract({
                  text: contractData.content,
                  title: contractData.title,
                });


                if (resContract.success && resContract.data) {
                  setUploadStatus("success");
                  setTimeout(() => {
                    navigate(`/contracts/${resContract.data._id}`);
                  }, 1500);
                } else {
                  throw new Error("Failed to save contract");
                }
              } catch (error) {
                console.error("Error saving contract:", error);
                setUploadStatus("error");
                setError(error.message);
              } finally {
                setIsSubmitting(false);
              }
            }, 1000);

            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } catch (error) {
      console.error("Error in handleSubmitToAI:", error);
      setUploadStatus("error");
      setError(error.message);
      setIsSubmitting(false);
    }
  }, [contractData, navigate, isSubmitting]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-gray-900 bg-gray-50" : "border-gray-200"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <svg
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">Drag and drop your contract here</h3>
              <p className="text-sm text-gray-500 mb-6">Supports PDF, DOCX, and TXT files up to 10MB</p>
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Select File
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            {file && (
              <div className="mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "Unknown type"}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  </div>
                </div>

                {isParsing ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-gray-400 border-t-gray-600 rounded-full mb-4"></div>
                    <p className="text-gray-600 font-medium">Extraction du texte en cours...</p>
                    <div className="w-full max-w-xs mt-4 bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-gray-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${parsingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{parsingProgress}% complété</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <Input
                      id="document-title"
                      label="Document Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for this contract"
                      fullWidth
                    />


                  </div>

                )}
              </div>
            )}
          </div>
        )

      case 1:
        return <ContractPreview contractData={contractData} onEdit={handleContentEdit} onSubmit={handleContinue} />

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Submit for AI Analysis</h2>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-blue-800">Privacy Confirmation</p>
                  <p className="text-sm text-blue-700 mt-1">
                    You've reviewed your contract and had the opportunity to remove any sensitive information. Your
                    privacy is important to us.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-4">Document Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title</span>
                  <span className="font-medium">{contractData?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Type</span>
                  <span className="font-medium">{contractData?.fileType?.split("/")[1]?.toUpperCase() || "TXT"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Content Length</span>
                  <span className="font-medium">{contractData?.content.length.toLocaleString()} characters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sensitive Data</span>
                  <span
                    className={`font-medium ${contractData?.sensitiveItems?.length > 0 ? "text-amber-600" : "text-green-600"
                      }`}
                  >
                    {contractData?.sensitiveItems?.length || 0} items{" "}
                    {contractData?.sensitiveItems?.length > 0 ? "manually reviewed" : "detected"}
                  </span>
                </div>
              </div>
            </div>

            {uploadStatus === "uploading" && (
              <div className="mb-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="text-gray-900 font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-gray-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadStatus === "analyzing" && (
              <div className="p-4 bg-amber-50 rounded-lg flex items-center mb-8">
                <svg className="animate-spin h-5 w-5 text-amber-500 mr-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-amber-800">Analyzing contract with AI. This may take a minute...</span>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="p-4 bg-green-50 rounded-lg flex items-center mb-8">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800">Analysis complete! Redirecting to results...</span>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Upload Contract</h1>
        <p className="text-gray-500 mt-1">Upload your contract for AI analysis</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="mb-8">
            <Stepper steps={steps} currentStep={currentStep} onChange={(step) => setCurrentStep(step)} />
          </div>

          {renderStepContent()}

          <div className="mt-8 flex justify-end gap-4">
            {currentStep > 0 && (
              <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                Back
              </Button>
            )}

            {currentStep < 3 ? (
              <Button variant="primary" onClick={handleContinue}>
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmitToAI}
                disabled={uploadStatus !== "idle" || isSubmitting}
                isLoading={uploadStatus !== "idle" || isSubmitting}
                loadingText={
                  uploadStatus === "uploading"
                    ? "Uploading..."
                    : uploadStatus === "analyzing"
                      ? "Analyzing..."
                      : "Processing..."
                }
              >
                Submit for Analysis
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
