import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    body {
        max-width: 100vw;
        overflow-x: hidden;

        padding: 0 1.2rem;
        background-color:black;
        color:white;
    }

    html {
        font-size: 62.5%;
        display: flex;
        justify-content: center;
    }

    a {
    color: inherit;
    text-decoration: none;
    }

    .non-clickable {
        pointer-events: none;
    }

    button{
        cursor: pointer;
    }

    ul, ol {
    list-style: none;
  }
`;
export default GlobalStyle;
