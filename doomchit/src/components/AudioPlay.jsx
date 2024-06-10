import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const AudioPlay = ({ audioPreviewUrl }) => {
  const [isPlay, setIsPlay] = useState(false);
  const audioRef = useRef(null);
  audioRef.current = new Audio(audioPreviewUrl);

  useEffect(() => {
    console.log(isPlay);
  }, [isPlay]);

  const togglePlay = () => {
    if (isPlay) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlay(!isPlay);
  };
  return (
    <>
      {
        <AudioBox>
          <Image
            src={isPlay ? "stop.svg" : "play.svg"}
            alt={isPlay ? "stop" : "play"}
            onClick={togglePlay}
          />
        </AudioBox>
      }
    </>
  );
};

export default AudioPlay;
const AudioBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const Image = styled.img`
  width: 20%;
  filter: invert(1);
  cursor: pointer;
`;
