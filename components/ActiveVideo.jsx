import { useVideoPlayer, VideoView } from "expo-video";

const ActiveVideo = ({ 
  videoUrl, 
  onEnd, 
  width = 208,         
  height = 288,         
  borderRadius = 35, 
  marginTop = 12 
}) => {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
  });
  
  return (
    <VideoView
      player={player}
      style={{
        width,
        height,
        borderRadius,
        marginTop,
        backgroundColor: 'rgba(255,255,255,0.1)',
      }}
      allowsFullscreen
      allowsPictureInPicture
      onEnd={onEnd}
    />
  );
};

export default ActiveVideo;
