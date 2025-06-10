
import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  year: string;
  duration: string;
  audioUrl?: string;
}

interface MusicRecommendationsProps {
  emotion?: string;
}

const MusicRecommendations: React.FC<MusicRecommendationsProps> = ({ emotion }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Curated Indian music database organized by emotion with sample audio URLs
  const musicDatabase: Record<string, Song[]> = {
    happy: [
      { id: '1', title: 'Jai Ho', artist: 'A.R. Rahman', genre: 'Bollywood', year: '2008', duration: '5:09', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '2', title: 'Nagada Sang Dhol', artist: 'Shreya Ghoshal', genre: 'Bollywood', year: '2013', duration: '4:52', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '3', title: 'Bhangra Paale', artist: 'Divine', genre: 'Hip-Hop', year: '2020', duration: '3:24', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '4', title: 'Gallan Goodiyaan', artist: 'Yashita Sharma', genre: 'Bollywood', year: '2014', duration: '4:11', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '5', title: 'Kar Gayi Chull', artist: 'Neha Kakkar', genre: 'Bollywood', year: '2016', duration: '3:18', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
    ],
    sad: [
      { id: '6', title: 'Tum Hi Ho', artist: 'Arijit Singh', genre: 'Bollywood', year: '2013', duration: '4:22', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '7', title: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', genre: 'Bollywood', year: '2016', duration: '4:29', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '8', title: 'Humdard', artist: 'Arijit Singh', genre: 'Bollywood', year: '2014', duration: '4:58', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '9', title: 'Khone De', artist: 'Arijit Singh', genre: 'Bollywood', year: '2015', duration: '4:02', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '10', title: 'Raabta', artist: 'Arijit Singh', genre: 'Bollywood', year: '2017', duration: '4:17', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
    ],
    angry: [
      { id: '11', title: 'Sultan', artist: 'Vishal Dadlani', genre: 'Bollywood', year: '2016', duration: '3:24', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '12', title: 'Malhari', artist: 'Vishal Dadlani', genre: 'Bollywood', year: '2015', duration: '4:03', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '13', title: 'Apna Time Aayega', artist: 'Divine & Ranveer Singh', genre: 'Hip-Hop', year: '2019', duration: '3:07', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '14', title: 'Tattad Tattad', artist: 'Arijit Singh', genre: 'Bollywood', year: '2013', duration: '4:16', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '15', title: 'Khalibali', artist: 'Shivam Mahadevan', genre: 'Bollywood', year: '2017', duration: '4:28', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
    ],
    neutral: [
      { id: '16', title: 'Vande Mataram', artist: 'A.R. Rahman', genre: 'Patriotic', year: '1997', duration: '6:52', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '17', title: 'Raga Yaman', artist: 'Pt. Ravi Shankar', genre: 'Classical', year: '1995', duration: '8:15', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '18', title: 'Ketto', artist: 'Bonobo', genre: 'Electronic', year: '2013', duration: '4:32', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '19', title: 'Mumbai', artist: 'A.R. Rahman', genre: 'Instrumental', year: '2009', duration: '5:43', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '20', title: 'Breathe Me', artist: 'Prateek Kuhad', genre: 'Indie', year: '2018', duration: '3:56', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
    ],
    surprised: [
      { id: '21', title: 'Nagada Sang Dhol', artist: 'Shreya Ghoshal', genre: 'Bollywood', year: '2013', duration: '4:52', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '22', title: 'Dhoom Machale', artist: 'Sunidhi Chauhan', genre: 'Bollywood', year: '2004', duration: '5:27', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '23', title: 'Ainvayi Ainvayi', artist: 'Salim-Sulaiman', genre: 'Bollywood', year: '2008', duration: '6:05', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '24', title: 'Bismil', artist: 'Arijit Singh', genre: 'Bollywood', year: '2022', duration: '4:31', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '25', title: 'Khairiyat', artist: 'Arijit Singh', genre: 'Bollywood', year: '2019', duration: '4:40', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
    ],
    fear: [
      { id: '26', title: 'Om Namah Shivaya', artist: 'Krishna Das', genre: 'Devotional', year: '2001', duration: '7:23', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '27', title: 'Hanuman Chalisa', artist: 'Hariharan', genre: 'Devotional', year: '2000', duration: '8:12', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '28', title: 'Shiva Moon', artist: 'Prem Joshua', genre: 'Meditation', year: '2004', duration: '6:45', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '29', title: 'Gayatri Mantra', artist: 'Anuradha Paudwal', genre: 'Devotional', year: '1999', duration: '5:30', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { id: '30', title: 'Mahamrityunjaya Mantra', artist: 'Uma Mohan', genre: 'Devotional', year: '1998', duration: '9:15', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
    ]
  };

  const getRecommendations = (): Song[] => {
    if (!emotion || !musicDatabase[emotion]) {
      return musicDatabase.neutral || [];
    }
    return musicDatabase[emotion];
  };

  const recommendations = getRecommendations();

  const getEmotionColor = (emotion?: string) => {
    const colorMap: Record<string, string> = {
      happy: 'from-yellow-400 to-orange-500',
      sad: 'from-blue-400 to-blue-600',
      angry: 'from-red-400 to-red-600',
      surprised: 'from-purple-400 to-pink-500',
      fear: 'from-gray-400 to-gray-600',
      neutral: 'from-green-400 to-blue-500'
    };
    return colorMap[emotion || 'neutral'] || colorMap.neutral;
  };

  const handlePlayPause = (song: Song) => {
    console.log('Playing song:', song.title);
    
    if (currentlyPlaying === song.id && isPlaying) {
      // Pause current song
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Play new song or resume
      if (audioRef.current) {
        if (currentlyPlaying !== song.id) {
          audioRef.current.src = song.audioUrl || '';
          setCurrentlyPlaying(song.id);
        }
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
          // Fallback: show message that audio is not available
          alert('Audio not available for this song. This is a demo with placeholder audio.');
        });
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentlyPlaying(null);
  };

  if (!emotion) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Music className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Ready for Music!</h3>
        <p className="text-purple-200">Detect your emotion first to get personalized Indian music recommendations</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={(e) => console.error('Audio error:', e)}
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <Badge className={`bg-gradient-to-r ${getEmotionColor(emotion)} text-white px-4 py-2 text-sm font-medium`}>
          {emotion.charAt(0).toUpperCase() + emotion.slice(1)} Vibes
        </Badge>
        <p className="text-purple-200 text-sm">Perfect Indian songs for your current mood</p>
      </div>

      {/* Music List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {recommendations.map((song, index) => (
          <Card key={song.id} className="backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{song.title}</h4>
                  <p className="text-sm text-purple-200 truncate">{song.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                      {song.genre}
                    </Badge>
                    <span className="text-xs text-white/50">{song.year}</span>
                    <span className="text-xs text-white/50">•</span>
                    <span className="text-xs text-white/50">{song.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handlePlayPause(song)}
                    className={`h-8 w-8 p-0 bg-gradient-to-r ${getEmotionColor(emotion)} hover:shadow-lg transition-all duration-200`}
                  >
                    {currentlyPlaying === song.id && isPlaying ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-xs text-purple-300">
          🎵 Discover more Indian music based on your emotions
        </p>
      </div>
    </div>
  );
};

export default MusicRecommendations;
