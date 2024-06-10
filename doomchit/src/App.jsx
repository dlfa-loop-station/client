import styled from "styled-components";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Main from "./pages/Main";
import Test from "./pages/Test";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 웹 서비스 소개 페이지 */}
        <Route path="/" element={<Main />} />
        {/* <SignIn /> */}
        <Route path="/test" element={<Test />} />
        <Route path={"*"} component={<NotFound />} />
      </Routes>
    </BrowserRouter>
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
