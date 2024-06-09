import React from "react";

const AudioPlay = ({ audioPreviewUrl }) => {  
  return (
    <>
      {audioPreviewUrl && (
        <audio controls>
          <source src={audioPreviewUrl} type="audio/webm" />
        </audio>
      )}
    </>
  );
};

export default AudioPlay;
