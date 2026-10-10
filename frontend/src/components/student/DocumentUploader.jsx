import { useState, useRef } from 'react'
import { Upload, File, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import studentService from '../../services/studentService'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const DOC_TYPES = [
  'PASSPORT', 'TRANSCRIPT', 'IELTS_CERTIFICATE', 'TOEFL_CERTIFICATE',
  'DEGREE_CERTIFICATE', 'RECOMMENDATION_LETTER', 'PERSONAL_STATEMENT',
  'BANK_STATEMENT', 'CV_RESUME', 'PHOTO_ID', 'OTHER',
]

export default function DocumentUploader({ applicationId, onUploaded }) {
  const [docType, setDocType] = useState('PASSPORT')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  const upload = async (file) => {
    if (!file) return
    const MAX = 10 * 1024 * 1024
    if (file.size > MAX) { toast.error('File exceeds 10MB limit'); return }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentType', docType)
    if (applicationId) formData.append('applicationId', applicationId)

    setUploading(true)
    try {
      const doc = await studentService.uploadDocument(formData)
      toast.success('Document uploaded successfully')
      onUploaded?.(doc)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Document Type</label>
        <select className="form-input" value={docType} onChange={e => setDocType(e.target.value)}>
          {DOC_TYPES.map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          dragOver ? 'border-navy-500 bg-navy-50' : 'border-slate-200 hover:border-navy-400 hover:bg-slate-50',
          uploading && 'opacity-50 cursor-wait'
        )}
      >
        <Upload size={28} className={clsx('mx-auto mb-3', dragOver ? 'text-navy-600' : 'text-slate-400')} />
        <p className="text-sm font-medium text-navy-700">
          {uploading ? 'Uploading…' : 'Drop file here or click to browse'}
        </p>
        <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
        <input ref={inputRef} type="file" className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={e => upload(e.target.files?.[0])} />
      </div>
    </div>
  )
}
