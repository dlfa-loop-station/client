import React, { useState, useCallback, useEffect } from "react";
import AudioPlay from "./AudioPlay";
import axios from "axios";
import styled from "styled-components";
import useLoadPitch from "../stores/pitch";

const AudioRecord = () => {
  const { pitch } = useLoadPitch();
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRecs, setOnRecs] = useState([]);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrls, setAudioUrls] = useState([]);
  const [audioPreviewUrls, setAudioPreviewUrls] = useState(
    Array(pitch.length).fill("")
  );
  const [isPlayNote, setIsPlayNote] = useState();

  useEffect(() => {
    if (pitch.length > 0) {
      console.log(pitch);
      setOnRecs(Array(pitch.length).fill(true));
      setAudioUrls(Array(pitch.length).fill(null));
    }
  }, [pitch]);

  const onRecAudio = (index) => {
    // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);

      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // 마이크 사용 권한 획득
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      // 음성 녹음이 시작됐을 때 onRec state값을 false로 변경
      analyser.onaudioprocess = function (e) {
        setOnRecs((prevOnRecs) => {
          const newOnRecs = [...prevOnRecs];
          newOnRecs[index] = false;
          return newOnRecs;
        });
      };
    });
  };

  // 사용자가 음성 녹음을 중지했을 때
  const offRecAudio = (index) => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      setAudioUrls((prevAudioUrls) => {
        const newAudioUrls = [...prevAudioUrls];
        newAudioUrls[index] = e.data;
        return newAudioUrls;
      });
      setOnRecs((prevOnRecs) => {
        const newOnRecs = [...prevOnRecs];
        newOnRecs[index] = true;
        return newOnRecs;
      });
    };

    // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    // 미디어 캡처 중지
    media.stop();
    // 메서드가 호출 된 노드 연결 해제
    analyser.disconnect();
    source.disconnect();
    onSubmitAudioFile();
  };

  const onSubmitAudioFile = useCallback(
    (index) => {
      if (audioUrls[index]) {
        const previewUrl = URL.createObjectURL(audioUrls[index]); // 출력된 링크에서 녹음된 오디오 확인 가능
        setAudioPreviewUrls((prevAudioPreviewUrls) => {
          const newAudioPreviewUrls = [...prevAudioPreviewUrls];
          newAudioPreviewUrls[index] = previewUrl;
          return newAudioPreviewUrls;
        });
      }
    },
    [audioUrls]
  );

  const sendRecord = () => {};
  async function postSound(index, pitch) {
    // File 생성자를 사용해 파일로 변환
    const sound = new File([audioUrls[index]], `note_${pitch}`, {
      lastModified: new Date().getTime(),
      type: "audio",
    });
    try {
      const formData = new FormData();
      formData.append("file", sound);

      await axios.post("http://127.0.0.1:8000/upload", formData, {
        timeout: 5000, // 타임아웃 설정 (5초)
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Wrapper>
        {pitch.length > 0 &&
          pitch.map((m, index) => (
            <Container key={index}>
              <Box>{m && <AudioPlay fileName={m} />}</Box>
              <Box>
                <RecordBox>
                  <ImageWrapper>
                    {onRecs.length > 0 && onRecs[index] ? (
                      <Image
                        src={"microphone.svg"}
                        alt={"microphone"}
                        onClick={() => onRecAudio(index)}
                      />
                    ) : (
                      <Image
                        src={"stop.svg"}
                        alt={"stop"}
                        onClick={() => offRecAudio(index)}
                      />
                    )}
                  </ImageWrapper>
                </RecordBox>
                <TextBox>
                  {!(audioUrls[index] && source) ? (
                    <Txt>Record Yours</Txt>
                  ) : (
                    <>
                      <Button onClick={() => postSound(index, m)}>
                        Complete
                      </Button>
                      <Button
                        onClick={() => {
                          setOnRecs((prevOnRecs) => {
                            const newOnRecs = [...prevOnRecs];
                            newOnRecs[index] = true;
                            return newOnRecs;
                          });
                          onRecAudio(index);
                        }}
                      >
                        Again
                      </Button>
                    </>
                  )}
                </TextBox>
              </Box>
            </Container>
          ))}
      </Wrapper>
      <ButtonWrapper>
        <SendButton onClick={sendRecord}>생성하기</SendButton>
      </ButtonWrapper>
    </>
  );
};

export default AudioRecord;
const Wrapper = styled.div`
  margin-top: 16px;
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(30%, auto));
`;
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const SendButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0.5rem 1rem;

  display: inline-block;

  width: 180px;
  height: 42px;
  background-color: transparent;
  color: white;
  border: solid white 1px;
  border-radius: 24px;
  font-size: 21px;

  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: white;
    color: black;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-right: 15px;
  margin-bottom: 20px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 220px;
  border: solid white 1.5px;
`;
const RecordBox = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const TextBox = styled.div`
  display: flex;
  bottom: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
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
const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0.5rem 1rem;

  display: inline-block;
  width: 100%;
  background-color: transparent;
  color: white;
  border: solid white 1px;
  font-size: 12px;

  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: white;
    color: black;
  }

  &:hover ${ImageWrapper} {
    opacity: 1;
  }
`;
