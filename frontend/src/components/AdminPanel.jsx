import React, { useState, useEffect } from "react";

function AdminPanel() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [rebuildStatus, setRebuildStatus] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch("http://localhost:8000/api/admin/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingDocs(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setUploading(true);
    setUploadStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus(`File "${data.filename}" uploaded successfully! Remember to Rebuild Index.`);
        setFile(null);
        document.getElementById("admin-file-input").value = "";
        fetchDocuments();
      } else {
        setUploadStatus(data.detail || "Upload failed.");
      }
    } catch (err) {
      setUploadStatus("Connection error.");
    }
    setUploading(false);
  };

  const handleRebuild = async () => {
    setRebuilding(true);
    setRebuildStatus("Rebuilding vector database, please wait...");
    try {
      const res = await fetch("http://localhost:8000/api/admin/rebuild-index", {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok) {
        setRebuildStatus(data.message || "Vector database rebuilt successfully.");
        fetchDocuments();
      } else {
        setRebuildStatus(data.detail || "Index rebuild failed.");
      }
    } catch (err) {
      setRebuildStatus("Connection error.");
    }
    setRebuilding(false);
  };

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white dark:bg-brand-darkCard p-6 rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-brand-darkBorder rounded-lg p-4 text-center cursor-pointer hover:border-brand-green transition-colors">
              <input
                id="admin-file-input"
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="admin-file-input" className="cursor-pointer flex flex-col items-center justify-center">
                <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {file ? file.name : "Choose PDF, TXT or MD File"}
                </span>
                <span className="text-xxs text-slate-400 mt-1">Maximum size: 10MB</span>
              </label>
            </div>
            {uploadStatus && (
              <p className={`text-xxs font-semibold ${uploadStatus.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
                {uploadStatus}
              </p>
            )}
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-2 bg-brand-green hover:bg-emerald-700 text-white text-xs font-bold rounded shadow transition-all disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-brand-darkCard p-6 rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-2">Vector Index Manager</h2>
          <p className="text-xs text-slate-500 mb-4">Rebuild the FAISS index to process newly uploaded documents into vector embeddings.</p>
          {rebuildStatus && (
            <p className={`text-xxs font-semibold mb-3 ${rebuildStatus.includes("successfully") ? "text-green-600" : "text-amber-500"}`}>
              {rebuildStatus}
            </p>
          )}
          <button
            onClick={handleRebuild}
            disabled={rebuilding}
            className="w-full py-2 bg-brand-orange hover:bg-orange-700 text-white text-xs font-bold rounded shadow transition-all disabled:opacity-50"
          >
            {rebuilding ? "Rebuilding..." : "Rebuild FAISS Index"}
          </button>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white dark:bg-brand-darkCard p-6 rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-base text-slate-800 dark:text-slate-200">Knowledge Base Directory</h2>
            <button
              onClick={fetchDocuments}
              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBg dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Refresh Documents List"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-x-auto">
            {loadingDocs ? (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                <svg className="w-10 h-10 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs">No documents uploaded yet.</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-brand-darkBorder text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Filename</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Uploaded</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-100 dark:border-brand-darkBorder/50 hover:bg-slate-50 dark:hover:bg-brand-darkBg/30">
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs">{doc.filename}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-xxs font-bold bg-slate-100 text-slate-600 dark:bg-brand-darkBg dark:text-slate-400">
                          {doc.file_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${
                          doc.status === "Indexed"
                            ? "bg-green-100 text-green-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
