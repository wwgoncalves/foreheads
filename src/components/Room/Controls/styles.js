import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  left: calc(50vw - 50vmin);
  bottom: 1vh;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100vmin;
  height: 80px;
  opacity: 0.2;
  transition: opacity 300ms linear;

  div {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  input[type='file'] {
    display: none;
  }

  div:nth-last-child(1) {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  &:hover {
    opacity: 1;
  }
`;
