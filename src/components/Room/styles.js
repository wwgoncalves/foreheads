import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100%;
  max-height: 100%;

  background-color: var(--appBackgroundColor);
  color: #f0f0f0;
  font-size: calc(10px + 2vmin);

  display: flex;
  flex-direction: column;

  main {
    flex: 1;

    display: flex;
    flex-direction: row;

    background-color: var(--appBackgroundColor);
  }

  .videocall {
    flex: 3;

    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;

    max-width: 100vw;
    /* Due to problems in using '100vh' for mobile browsers */
    max-height: ${({ windowDimensions: wd }) =>
      `calc(${wd.height}px - var(--headerHeight))`};

    min-height: 0;

    position: relative;
  }

  .videocall .someone {
    position: relative;
    flex: 1 0 300px;
    max-width: 640px;

    resize: both;
    overflow: hidden;
  }
  .videocall .someone video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .videocall .me {
    position: relative;
    flex: 1 0 300px;
    max-width: 640px;

    resize: both;
    overflow: hidden;
  }
  .videocall .me video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .videocall .me.alone {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    max-width: unset;
  }
`;
