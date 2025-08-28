import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAudio } from "@/context/AudioContext";
import FullPlayer from "@/components/FullPlayer";

const PlayerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentTrack, loadTrack } = useAudio();

  useEffect(() => {
    const trackId = searchParams.get('track');
    
    // If no track is specified and no current track, go back
    if (!trackId && !currentTrack) {
      navigate('/');
      return;
    }

    // If track ID is specified but doesn't match current track, we could load it here
    // For now, we'll just rely on the track being loaded elsewhere
  }, [searchParams, currentTrack, navigate]);

  return <FullPlayer />;
};

export default PlayerPage;