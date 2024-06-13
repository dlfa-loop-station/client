import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const AudioPlay = ({ fileName }) => {
  const [isPlay, setIsPlay] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    if (fileName) {
      const loadAudio = async () => {
        try {
          const audioModule = await import(
            `../music/base/note_${fileName}.wav`
          );
          console.log(audioModule.default);
          const audio = new Audio(audioModule.default);
          audio.oncanplaythrough = () => {
            audioRef.current = audio;
          };
        } catch (error) {
          console.error("오디오 로드 실패:", error);
          // 사용자에게 오류 메시지 표시
        }
      };

      loadAudio();
    }
  }, [fileName]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlay) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          console.error("재생 실패:", e);
          // 사용자에게 오류 메시지 표시
        });
      }
      setIsPlay(!isPlay);
    } else {
      console.error("오디오가 아직 로드되지 않았습니다.");
      // 사용자에게 오류 메시지 표시
    }
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
