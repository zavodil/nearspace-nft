import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* --green: #6FD65E;
    --green-light: #D5FFCE;
    --pink: #EB5BEE;
    --pink-light: #feccff;
    --pink-lighter: #FFE5E5;
    --blue: #1472FF;
    --blue-light: #B6D3FF;
    --gray-darker: #808080;
    --gray-dark: #A7A7A7;
    --gray: #E0E0E0;
    --gray-light: #EDEDED;
    --gray-lighter: #F3F3F3;
    --gray-lighest: #F8F9FB;
    --black: #444444; */
    --purple: #250055;
    --plum-base: 5, 44, 46;
    --plum: rgb(var(--plum-base));
    --plum-light: #052c2e;
    --periwinkle-base: 255, 209, 0;
    --periwinkle: rgb(var(--periwinkle-base));
    --lavendar-base: 255, 126, 0;
    --lavendar: rgb(var(--lavendar-base));
    --pink: #FF79ED;
    --background: #1a3e40;
    --background-dark: #1F043C;
    --bubble-gum-base: 255, 126, 1;
    --bubble-gum: rgb(var(--bubble-gum-base));
    --nearspace: #00b1b1;

    --success: #00FF38;
    --error-base: 255, 95, 95;
    --error: rgb(var(--error-base));

    --success-bg: #1F1C45;
    --error-bg: rgba(255, 0, 31, 0.1);

    --shadow-primary: 0 0 14px #ffd100;
    --shadow-secondary: 0 0 14px rgba(255, 209, 0, 0.6);

    --radius-default: 8px;

    --font-primary: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --font-secondary: 'Roboto Slab', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
    font-family: var(--font-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    background-color: var(--background);
    color: var(--lavendar);
  }

  #root {
    height: 100%;
  }

  .app {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1 0 auto;
    margin-top: -93px;

    .sticked-to-bottom {
      position: sticky;
      bottom: 0;
      z-index: 2;
    }
  }

  .portal-container {
    position: relative;
  }

  .footer {
    flex-shrink: 0;
  }

  a {
    color: var(--periwinkle);
    text-decoration: none;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

export default GlobalStyle;
