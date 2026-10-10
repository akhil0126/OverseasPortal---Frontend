import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import DocumentUploader from '../../components/student/DocumentUploader'
import Loader from '../../components/common/Loader'
import studentService from '../../services/studentService'
import { formatDate } from '../../utils/validators'
import toast from 'react-hot-toast'
import { File, Trash2, FolderOpen, CheckCircle, Clock } from 'lucide-react'

export default function DocumentsPage() {
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setLoadError(false)
    studentService.getDocuments()
      .then(setDocs)
      .catch(err => {
        setLoadError(true)
        toast.error(err?.response?.data?.message || 'Failed to load documents')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return
    try {
      await studentService.deleteDocument(id)
      toast.success('Document deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  return (
    <DashboardLayout>
      <div className="page-wrapper max-w-4xl">
        <h1 className="page-title mb-2">Documents</h1>
        <p className="page-subtitle mb-8">Upload and manage your application documents</p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Uploader */}
          <div className="card p-6">
            <h2 className="section-title">Upload Document</h2>
            <DocumentUploader onUploaded={load} />
          </div>

          {/* Document list */}
          <div className="card p-6">
            <h2 className="section-title">Uploaded Documents {!loadError && !loading && `(${docs.length})`}</h2>
            {loading ? <Loader size="sm" text="" /> : loadError ? (
              <p className="text-center py-10 text-red-600 text-sm">Documents could not be loaded.</p>
            ) : docs.length === 0 ? (
              <div className="text-center py-10">
                <FolderOpen size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <File size={16} className="text-navy-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{doc.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{doc.documentType?.replace(/_/g,' ')}</span>
                        <span>·</span>
                        <span>{formatDate(doc.createdAt)}</span>
                        {doc.verified && <CheckCircle size={11} className="text-emerald-500" />}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(doc.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
