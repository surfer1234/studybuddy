import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScanProps {
  setScans: (scans: string[]) => void;
}

const Scan: React.FC<ScanProps> = ({ setScans }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Geef cameratoegang om te scannen.");
      }
    }
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      setFlash(true);
      setTimeout(() => setFlash(false), 100);

      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImages(prev => [...prev, dataUrl]);
      }
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const finishScanning = () => {
    if (capturedImages.length > 0) {
      setScans(capturedImages);
      navigate('/processing');
    }
  };

  return (
    <div className="bg-black h-full flex flex-col overflow-hidden relative">
      <div className="flex-1 relative overflow-hidden bg-black">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {flash && (
          <div className="absolute inset-0 bg-white z-50"></div>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-96 border-2 border-white/20 rounded-3xl relative">
             <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 -ml-1 -mt-1 rounded-tl-xl"></div>
             <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 -mr-1 -mt-1 rounded-tr-xl"></div>
             <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 -ml-1 -mb-1 rounded-bl-xl"></div>
             <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 -mr-1 -mb-1 rounded-br-xl"></div>
          </div>
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center text-white border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="bg-blue-600 px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-xl flex items-center space-x-2">
            <span>{capturedImages.length} {capturedImages.length === 1 ? 'Pagina' : 'Pagina\'s'}</span>
          </div>
        </div>

        {capturedImages.length === 0 && (
          <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
            <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-md inline-block px-4 py-2 rounded-full border border-white/10">
              Maak een foto van je studiemateriaal
            </p>
          </div>
        )}
      </div>

      <div className={`bg-gray-900 transition-all duration-300 ${capturedImages.length > 0 ? 'h-28 py-4 opacity-100' : 'h-0 opacity-0'} px-6 flex space-x-3 overflow-x-auto shrink-0 border-t border-white/5`}>
        {capturedImages.map((img, idx) => (
          <div key={idx} className="relative shrink-0 group">
            <img src={img} className="w-16 h-20 object-cover rounded-lg border-2 border-blue-500/50" alt={`Scan ${idx}`} />
            <button 
              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-gray-900 active:scale-90"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-[9px] text-center py-0.5 rounded-b-lg font-black uppercase tracking-tighter">
              Blad {idx + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-950 p-8 flex justify-between items-center shrink-0 border-t border-white/5">
        <div className="w-12 h-12"></div>
        <div className="relative">
          <button 
            onClick={captureFrame}
            disabled={!isCameraReady}
            className="w-20 h-20 bg-white rounded-full p-1.5 flex items-center justify-center group active:scale-90 transition-all disabled:opacity-30 shadow-lg"
          >
            <div className="w-full h-full border-[4px] border-gray-950 rounded-full flex items-center justify-center bg-white">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-inner">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                 </svg>
              </div>
            </div>
          </button>
        </div>

        <button 
          onClick={finishScanning}
          disabled={capturedImages.length === 0}
          className={`flex flex-col items-center group transition-all ${capturedImages.length > 0 ? 'opacity-100 scale-100' : 'opacity-30 scale-90 pointer-events-none'}`}
        >
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-1 shadow-lg group-active:scale-90 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Gereed</span>
        </button>
      </div>
    </div>
  );
};

export default Scan;