import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Loader2, RefreshCcw, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectedEmotion } from '@/pages/Index';

interface EmotionDetectorProps {
  mode: 'camera' | 'upload';
  onEmotionDetected: (emotion: DetectedEmotion) => void;
  onAnalysisStart: () => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({
  mode,
  onEmotionDetected,
  onAnalysisStart
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Emotion mapping with emojis
  const emotionMap: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    fear: '😨',
    disgusted: '🤢',
    neutral: '😐'
  };

  // Mock emotion detection (replace with actual AI model)
  const analyzeEmotion = async (imageData: string): Promise<DetectedEmotion> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock emotions for demo - in production, use actual AI model
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'fear', 'neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.7 + Math.random() * 0.3; // Random confidence between 70-100%
    
    return {
      emotion: randomEmotion,
      confidence,
      emoji: emotionMap[randomEmotion] || '😊'
    };
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const reloadCamera = async () => {
    stopCamera();
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure cleanup
    await startCamera();
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    onAnalysisStart();
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      
      try {
        const emotion = await analyzeEmotion(imageData);
        onEmotionDetected(emotion);
      } catch (error) {
        setError('Failed to analyze emotion. Please try again.');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onAnalysisStart();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      
      try {
        const emotion = await analyzeEmotion(imageData);
        onEmotionDetected(emotion);
      } catch (error) {
        setError('Failed to analyze emotion. Please try again.');
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [mode]);

  if (mode === 'camera') {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div className="relative rounded-xl overflow-hidden bg-black/20">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {isStreaming && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={captureAndAnalyze}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Camera className="mr-2 h-4 w-4" />
                Analyze Emotion
              </Button>
            </div>
          )}
        </div>

        {/* Camera Control Buttons */}
        <div className="flex gap-3">
          {!isStreaming && !error && (
            <Button
              onClick={startCamera}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          )}
          
          {isStreaming && (
            <>
              <Button
                onClick={reloadCamera}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reload Camera
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                <CameraOff className="mr-2 h-4 w-4" />
                Turn Off Camera
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-white/50 transition-colors cursor-pointer bg-white/5 hover:bg-white/10"
      >
        <Upload className="h-12 w-12 text-white/70 mx-auto mb-4" />
        <p className="text-white/90 font-medium">Click to upload an image</p>
        <p className="text-white/60 text-sm mt-2">Supports JPG, PNG, and other image formats</p>
      </div>
    </div>
  );
};

export default EmotionDetector;
