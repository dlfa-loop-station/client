import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const AudioPlay = ({ url }) => {
  const [isPlay, setIsPlay] = useState(false);
  const audioRef = useRef(null);
  audioRef.current = new Audio(url);

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
      <AudioBox>
        <ImageWrapper>
          <Image
            src={isPlay ? "stop.svg" : "play.svg"}
            alt={isPlay ? "stop" : "play"}
            onClick={togglePlay}
          />
        </ImageWrapper>
      </AudioBox>
      <TextBox>
        <Txt>Listen DrumBeat</Txt>
      </TextBox>
    </>
  );
};

export default AudioPlay;
const AudioBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const ImageWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;
const Image = styled.img`
  width: 20%;
  filter: invert(1);
  cursor: pointer;
`;
const TextBox = styled.div`
  bottom: 0;
  width: 100%;
`;
const Txt = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: white;
  border: solid white 1px;
  font-size: 12px;
`;
