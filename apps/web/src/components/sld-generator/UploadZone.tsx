import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import {
  Upload, FileImage, FileText, File, X, CheckCircle2,
  Loader2, Image, FileType, ZoomIn,
} from 'lucide-react';
import clsx from 'clsx';

interface UploadedFile {
  file: File;
  preview: string | null;
  status: 'uploading' | 'processing' | 'done' | 'error';
  progress: number;
}

interface Props {
  onFileUploaded: (file: File) => void;
}

const ACCEPTED_TYPES = [
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/bmp', 'image/tiff',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_SIZE_MB = 50;

export default function UploadZone({ onFileUploaded }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragOut = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const processFile = useCallback((file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(png|jpe?g|webp|bmp|tiff?|pdf|docx?|dwg|dxf)$/i)) {
      setError('Unsupported file type. Please upload an image, PDF, or document file.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Create preview for images
    let preview: string | null = null;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    const uploaded: UploadedFile = { file, preview, status: 'uploading', progress: 0 };
    setUploadedFile(uploaded);

    // Simulate upload + processing
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        setUploadedFile((prev) => prev ? { ...prev, status: 'processing', progress: 100 } : null);

        // Simulate processing
        setTimeout(() => {
          setUploadedFile((prev) => prev ? { ...prev, status: 'done' } : null);
          onFileUploaded(file);
        }, 2500);
      } else {
        setUploadedFile((prev) => prev ? { ...prev, progress } : null);
      }
    }, 200);
  }, [onFileUploaded]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const removeFile = () => {
    if (uploadedFile?.preview) URL.revokeObjectURL(uploadedFile.preview);
    setUploadedFile(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload area */}
      {!uploadedFile ? (
        <div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            'relative cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300',
            dragOver
              ? 'border-cyan-400 bg-cyan-400/5 scale-[1.02] shadow-lg shadow-cyan-500/10'
              : 'border-gray-600 bg-white/[0.02] hover:border-blue-500/50 hover:bg-blue-500/[0.03]',
          )}
        >
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/40 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/40 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/40 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/40 rounded-br-lg" />

          <div className="flex flex-col items-center text-center">
            {/* Icon cluster */}
            <div className="relative mb-6">
              <div className={clsx(
                'w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300',
                dragOver
                  ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                  : 'bg-blue-500/10',
              )}>
                <Upload className={clsx(
                  'w-8 h-8 transition-all duration-300',
                  dragOver ? 'text-cyan-400 scale-110' : 'text-blue-400',
                )} />
              </div>
              {/* Floating file type icons */}
              <div className="absolute -top-2 -right-6 bg-gray-800 rounded-lg p-1.5 border border-gray-700 shadow-lg animate-float-1">
                <FileImage className="w-4 h-4 text-green-400" />
              </div>
              <div className="absolute -bottom-1 -left-6 bg-gray-800 rounded-lg p-1.5 border border-gray-700 shadow-lg animate-float-2">
                <FileText className="w-4 h-4 text-red-400" />
              </div>
              <div className="absolute -top-4 -left-3 bg-gray-800 rounded-lg p-1.5 border border-gray-700 shadow-lg animate-float-3">
                <Image className="w-4 h-4 text-purple-400" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {dragOver ? 'Drop your diagram here' : 'Upload your SLD diagram'}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Drag & drop your hand-drawn diagram, photograph, scanned document, or digital file here
            </p>

            {/* File type badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[
                { icon: FileImage, label: 'PNG / JPG', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
                { icon: FileText, label: 'PDF', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
                { icon: FileType, label: 'DOC / DOCX', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
                { icon: Image, label: 'TIFF / BMP', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className={clsx('flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border', color)}>
                  <Icon className="w-3 h-3" />
                  {label}
                </span>
              ))}
            </div>

            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Browse Files
            </button>
            <p className="text-xs text-gray-600 mt-3">Maximum file size: {MAX_SIZE_MB}MB</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.pdf,.doc,.docx,.dwg,.dxf"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        /* File preview card */
        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm overflow-hidden">
          {/* Preview header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <FileIcon filename={uploadedFile.file.name} />
              <div>
                <p className="text-sm font-medium text-white truncate max-w-xs">{uploadedFile.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadedFile.status === 'done' && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready
                </span>
              )}
              {uploadedFile.status === 'processing' && (
                <span className="flex items-center gap-1 text-xs text-cyan-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </span>
              )}
              <button onClick={removeFile} className="p-1 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image preview */}
          {uploadedFile.preview && (
            <div className="relative group">
              <img
                src={uploadedFile.preview}
                alt="Uploaded diagram"
                className="w-full max-h-96 object-contain bg-gray-900/50 p-4"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
              {/* Processing overlay */}
              {uploadedFile.status === 'processing' && (
                <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                      <Zap className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
                    </div>
                    <p className="text-sm text-cyan-300 font-medium">Analyzing diagram structure...</p>
                    <p className="text-xs text-gray-400 mt-1">Detecting equipment, connections & labels</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Non-image file preview */}
          {!uploadedFile.preview && (
            <div className="flex items-center justify-center py-16 bg-gray-900/30">
              <div className="text-center">
                <File className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Document uploaded</p>
                <p className="text-xs text-gray-600">{uploadedFile.file.name}</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {uploadedFile.status === 'uploading' && (
            <div className="px-5 py-3 border-t border-gray-700/50">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span>Uploading...</span>
                <span>{Math.round(uploadedFile.progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadedFile.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success state */}
          {uploadedFile.status === 'done' && (
            <div className="px-5 py-4 border-t border-gray-700/50 bg-emerald-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-emerald-300">Diagram analyzed successfully</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium text-sm rounded-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
                  Generate SLD
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-red-900/20 border border-red-800/50 text-red-300 text-sm flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'tif'].includes(ext || ''))
    return <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><FileImage className="w-5 h-5 text-green-400" /></div>;
  if (ext === 'pdf')
    return <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-red-400" /></div>;
  return <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><File className="w-5 h-5 text-blue-400" /></div>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
