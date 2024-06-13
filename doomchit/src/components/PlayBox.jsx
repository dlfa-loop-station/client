import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { Midi } from "@tonejs/midi";
import "../helper";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import Song from "../music/1.mp3";
import axios from "axios";
import useLoadPitch from "../stores/pitch";

const PlayBox = () => {
  let canvas;
  const [isPlay, setIsPlay] = useState(false);
  const [song, setSong] = useState(null); // song 상태 추가
  const { setPitch } = useLoadPitch();
  const myRef = useRef();
  const fftRef = useRef();
  const toggleRef = useRef();
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);

  const parentRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const toggleSong = () => {
    if (song) {
      // song이 로드되었는지 확인
      if (song.isPlaying()) {
        song.pause();
      } else {
        song.play();
      }
      setIsPlay(!isPlay); // 재생 상태 업데이트
    }
  };

  const Sketch = (p) => {
    p.setup = () => {
      canvas = p.createCanvas(width, height - 10);
      p.colorMode(p.HSB);
      p.angleMode(p.DEGREES);

      fftRef.current = new p5.FFT(0.9, 128);
    };

    p.draw = () => {
      p.background(0);
      if (fftRef.current) {
        const spectrum = fftRef.current.analyze();
        p.noStroke();
        p.translate(p.width / 2, p.height / 2);

        for (let i = 0; i < spectrum.length; i++) {
          const angle = p.map(i, 0, spectrum.length, 0, 360);
          const amp = spectrum[i];
          const r = p.map(amp, 0, 256, 70, 300);

          const x = r * p.cos(angle);
          const y = r * p.sin(angle);
          p.stroke(i, 0, 255);

          p.line(0, 0, x, y);
        }
      }
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: pitchData } = await axios.get(
        "http://127.0.0.1:8000/pitch"
      );

      const pitchList = pitchData.unique_pitches;
      setPitch(pitchList);

      const { data: wavData } = await axios.get("http://127.0.0.1:8000/wav", {
        responseType: "arraybuffer",
      });
      const blob = new Blob([wavData], { type: "audio/wav" });
      const soundFile = new p5.SoundFile(blob);
      setSong(soundFile);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!song) return;
    let myP5;

    if (width && height) {
      myP5 = new p5(Sketch, myRef.current);
    }
  }, [width, height, song]);

  return (
    <>
      <Wrapper ref={parentRef}>
        <div ref={myRef}></div>
        <ImageWrapper>
          <Image
            ref={toggleRef}
            src={isPlay ? "stop.svg" : "play.svg"}
            alt={isPlay ? "stop" : "play"}
            onClick={toggleSong}
          />
        </ImageWrapper>
      </Wrapper>
    </>
  );
};

export default PlayBox;
const Wrapper = styled.section`
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  border: solid white 1.5px;
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
const P5Box = styled.div``;
const Image = styled.img`
  width: 30px;
  filter: invert(1);
  cursor: pointer;
`;
