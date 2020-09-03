import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;

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
    flex: 4;
  }

  .videocall .someone {
    position: relative;

    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: calc(100vh - var(--headerHeight));

    resize: both;
    overflow: hidden;
  }
  .videocall .someone video {
    width: 100%;
    height: 100%;
  }

  .videocall .me {
    position: absolute;
    top: 0;
    left: 0;

    transform-origin: top left;
    transform: scale(0.15);

    transition: transform 500ms linear;

    resize: both;
    overflow: hidden;
  }
  .videocall .me.alone {
    margin: 0;
    transform: scale(1);

    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: calc(100vh - var(--headerHeight));
  }
`;
