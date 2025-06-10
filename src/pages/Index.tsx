
import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Music, Play, Heart, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmotionDetector from '@/components/EmotionDetector';
import MusicRecommendations from '@/components/MusicRecommendations';
import { useToast } from '@/hooks/use-toast';

export interface DetectedEmotion {
  emotion: string;
  confidence: number;
  emoji: string;
}

const Index = () => {
  const [detectedEmotion, setDetectedEmotion] = useState<DetectedEmotion | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | null>(null);
  const { toast } = useToast();

  const handleEmotionDetected = useCallback((emotion: DetectedEmotion) => {
    setDetectedEmotion(emotion);
    setIsAnalyzing(false);
    toast({
      title: "Emotion Detected!",
      description: `We detected ${emotion.emotion} with ${(emotion.confidence * 100).toFixed(1)}% confidence`,
    });
  }, [toast]);

  const handleAnalysisStart = useCallback(() => {
    setIsAnalyzing(true);
    setDetectedEmotion(null);
  }, []);

  const handleModeChange = useCallback((mode: 'camera' | 'upload' | null) => {
    setActiveMode(mode);
    if (!mode) {
      setDetectedEmotion(null);
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Smile className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              MoodTunes
            </h1>
            <div className="p-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Discover your emotions through AI and let us recommend the perfect Indian music for your mood
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Emotion Detection Section */}
          <div className="space-y-6">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <Camera className="h-6 w-6" />
                  Emotion Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!activeMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleModeChange('camera')}
                      className="h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                      size="lg"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Use Camera
                    </Button>
                    <Button
                      onClick={() => handleModeChange('upload')}
                      className="h-16 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                      size="lg"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Image
                    </Button>
                  </div>
                )}

                {activeMode && (
                  <div className="space-y-4">
                    <Button
                      onClick={() => handleModeChange(null)}
                      variant="outline"
                      className="mb-4 border-white/30 text-white hover:bg-white/10"
                    >
                      ← Back to options
                    </Button>
                    <EmotionDetector
                      mode={activeMode}
                      onEmotionDetected={handleEmotionDetected}
                      onAnalysisStart={handleAnalysisStart}
                    />
                  </div>
                )}

                {/* Emotion Display */}
                {(detectedEmotion || isAnalyzing) && (
                  <div className="text-center p-6 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/20">
                    {isAnalyzing ? (
                      <div className="space-y-3">
                        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-white">Analyzing your emotion...</p>
                      </div>
                    ) : detectedEmotion ? (
                      <div className="space-y-3">
                        <div className="text-6xl animate-bounce">{detectedEmotion.emoji}</div>
                        <h3 className="text-2xl font-bold text-white capitalize">
                          {detectedEmotion.emotion}
                        </h3>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {(detectedEmotion.confidence * 100).toFixed(1)}% confidence
                        </Badge>
                      </div>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Music Recommendations Section */}
          <div className="space-y-6">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <Heart className="h-6 w-6" />
                  Music Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MusicRecommendations emotion={detectedEmotion?.emotion} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: <Camera className="h-8 w-8" />,
              title: "Real-time Detection",
              description: "Use your camera for live emotion analysis"
            },
            {
              icon: <Upload className="h-8 w-8" />,
              title: "Image Upload",
              description: "Upload photos for instant emotion recognition"
            },
            {
              icon: <Music className="h-8 w-8" />,
              title: "Indian Music",
              description: "Curated Bollywood, classical & folk recommendations"
            }
          ].map((feature, index) => (
            <Card key={index} className="backdrop-blur-lg bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <CardContent className="text-center p-6 space-y-3">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-purple-200 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
