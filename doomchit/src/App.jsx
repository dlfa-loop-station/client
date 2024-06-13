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
