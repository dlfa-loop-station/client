import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { Midi } from "@tonejs/midi";
import "p5/lib/addons/p5.sound";
import p5 from "p5";
const PlayBox = () => {
  const myRef = useRef();
  const songRef = useRef();
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

  const Sketch = (p) => {
    let midi, song;

    function toggleSong() {
      if (song && song.isPlaying()) {
        song.pause();
      } else {
        song.play();
      }
    }

    // p.preload = async () => {
    //   midi = await Midi.fromUrl("1.mid");
    // };
    p.preload = () => {
      console.log(p);
      //   p.loadSound("this-dot-kp.mp3", (loadedSound) => {
      //     song = loadedSound;
      //     song.play();
      //   });
    };
    p.setup = () => {
      p.createCanvas(width, height);
      p.colorMode(p.HSB);
      p.angleMode(p.DEGREES);
      toggleRef.current = p.createButton("toggle");
      toggleRef.current.mousePressed(toggleSong);

      //   toggleRef.current.mousePressed(() => {
      //     console.log(midi);
      //     if (midi && midi.isPlaying()) {
      //       midi.pause();
      //     } else {
      //       midi.play();
      //     }
      //   });
      //   if (midi) {
      //     midi.play();
      //   }
      fftRef.current = new window.p5.FFT(0.9, 128);
    };

    p.draw = () => {
      p.background("white");
      const spectrum = fftRef.current.analyze();
      p.noStroke();
      p.translate(p.width / 2, p.height / 2);

      for (let i = 0; i < spectrum.length; i++) {
        const angle = p.map(i, 0, spectrum.length, 0, 360);
        const amp = spectrum[i];
        const r = p.map(amp, 0, 256, 20, 100);

        const x = r * p.cos(angle);
        const y = r * p.sin(angle);
        p.stroke(i, 255, 255);
        p.line(0, 0, x, y);
      }
    };
  };

  useEffect(() => {
    const myP5 = new p5(Sketch, myRef.current);
    return () => {
      myP5.remove();
    };
  }, []);

  return (
    <>
      <Wrapper ref={parentRef}>
        <div ref={myRef}></div>
      </Wrapper>
    </>
  );
};

export default PlayBox;
const Wrapper = styled.section`
  width: 100%;
  height: 500px;
  margin-top: 12px;
  border: solid white 1.5px;
`;
