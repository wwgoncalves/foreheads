import styled, { css } from 'styled-components';

import { Paper } from '@material-ui/core';

export const Container = styled.div`
  flex: 1;

  background-color: #f0f0f0;
  color: var(--appBackgroundColor);
  max-height: calc(100vh - var(--headerHeight));

  display: ${({ open }) => (open ? 'flex' : 'none')};
  flex-direction: column;
`;

export const Conversation = styled.div`
  flex-grow: 1;
  padding: 16px;

  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Message = styled.span`
  border-radius: 10px;
  margin-top: 1rem;
  padding: 0.5rem 3rem 0.5rem 0.5rem;

  font-size: 1rem;
  line-height: 1.5rem;

  ${({ origin }) => {
    if (origin === 'mine') {
      return css`
        margin-left: 3rem;
        border-bottom-right-radius: 0px;

        background-color: #0077ff;
        color: #fff;
      `;
    }
    return css`
      margin-right: 3rem;
      border-top-left-radius: 0px;

      background-color: #666;
      color: #fff;
    `;
  }}

  div {
    margin-right: 1rem;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  position: relative;

  &::after {
    content: attr(data-time);
    font-size: 0.75em;
    color: #ddd;

    position: absolute;
    bottom: 0;
    right: 0.5rem;
  }

  &:first-child {
    margin-top: auto;
  }
`;

export const MessageBox = styled(Paper).attrs({
  component: 'form',
})`
  display: flex;
  justify-content: stretch;
  border-top: 1px solid #ccc;

  div:nth-of-type(1) {
    flex: 1;

    padding-left: 16px;
  }
`;
