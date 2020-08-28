import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    --appBackgroundColor: rgb(40, 44, 52);
    --headerHeight: 3rem;

    --muiDefaultColor: rgba(0, 0, 0, 0.87);
    --muiPrimaryColor: #fff;
    --muiSecondaryColor: #fff;
    --muiDefaultBgColor: #e0e0e0;
    --muiDefaultBgColorHover: #d5d5d5;
    --muiPrimaryBgColor: #3f51b5;
    --muiPrimaryBgColorHover: #303f9f;
    --muiSecondaryBgColor: #f50057;
    --muiSecondaryBgColorHover: #c51162;

    --whatsappColor: #fff;
    --whatsappBgColor: #25d366;
    --whatsappBgColorHover: #19c257;
  }

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  *:focus {
    outline: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background-color: var(--appBackgroundColor);

    padding: 0 0.1rem;
  }

  body, input, button {
    font: 14px 'Roboto', sans-serif;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  button::-moz-focus-inner {
    border: 0;
  }
`;
