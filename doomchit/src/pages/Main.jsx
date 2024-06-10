import styled from "styled-components";
import PlayBox from "../components/PlayBox";

export default function Main() {
  return (
    <>
      <header>
        <Title>CUSTOM DOOMCHIT</Title>
        <Subtitle>
          <h2>Step 1</h2>
          <h2>Listen Generated Drumbeat</h2>
        </Subtitle>
        <PlayBox />
        <Subtitle>
          <h2>Step 2</h2>
          <h2>Input your own Drum Note</h2>
        </Subtitle>
        <Subtitle>
          <h2>Step 3</h2>
          <h2>Listen CUSTOM DOOMCHIT</h2>
        </Subtitle>
        <PlayBox />
      </header>
    </>
  );
}
const Title = styled.h1`
  display: flex;
  margin-top: 180px;
  font-family: "Tiny5", sans-serif;
  font-size: 12rem;
`;
const Subtitle = styled.div`
  margin-top: 6.8rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  font-style: bold;
`;
