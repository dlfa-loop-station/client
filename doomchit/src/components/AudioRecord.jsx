import React, { useState, useCallback } from "react";
import AudioPlay from "./AudioPlay";
import axios from "axios";
import styled from "styled-components";
const AudioRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [audioPreviewUrl, setAudioPreviewUrl] = useState();
  const [isPlayNote, setIsPlayNote] = useState();
  const list = ["10.mp3", "72.mp3", "90.mp3", "91.mp3", "92.mp3"];

  const onRecAudio = () => {
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
        setOnRec(false);
      };
    });
  };

  // 사용자가 음성 녹음을 중지했을 때
  const offRecAudio = () => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
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

  const onSubmitAudioFile = useCallback(() => {
    if (audioUrl) {
      const previewUrl = URL.createObjectURL(audioUrl); // 출력된 링크에서 녹음된 오디오 확인 가능
      setAudioPreviewUrl(previewUrl);
    }
  }, [audioUrl]);

  async function postSound() {
    // File 생성자를 사용해 파일로 변환
    const sound = new File([audioUrl], "soundBlob", {
      lastModified: new Date().getTime(),
      type: "audio",
    });
    postSound(sound);
    try {
      const formData = new FormData();
      formData.append("file", sound);
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const response2 = await axios.get("http://127.0.0.1:8000/midi");
      console.log(response2);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Wrapper>
      {list.map((m) => (
        <Container>
          <Box>{m && <AudioPlay audioPreviewUrl={m} />}</Box>
          <Box>
            <RecordBox>
              {onRec ? (
                <Image
                  src={"microphone.svg"}
                  alt={"microphone"}
                  onClick={onRecAudio}
                />
              ) : (
                <Image src={"stop.svg"} alt={"stop"} onClick={offRecAudio} />
              )}
            </RecordBox>
            <TextBox>
              <Button onClick={postSound}>Record Complete</Button>
              <Button
                onClick={() => {
                  setOnRec(true);
                  onRecAudio();
                }}
              >
                Record Again
              </Button>
            </TextBox>
          </Box>
        </Container>
      ))}
    </Wrapper>
  );
};

export default AudioRecord;
const Wrapper = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, auto));
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
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const TextBox = styled.div`
  display: flex;
  bottom: 0;
  height: 60px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Image = styled.img`
  width: 20%;
  filter: invert(1);
  cursor: pointer;
`;
const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  margin-bottom: 0.5px;
  padding: 0.5rem 1rem;

  display: inline-block;
  width: auto;
  background-color: transparent;
  color: white;
  border: solid white 1px;
`;
