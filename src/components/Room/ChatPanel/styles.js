import React from 'react';
import styled, { css } from 'styled-components';

import { Paper, IconButton } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

export const Container = styled.div`
  flex: 1;
  @media (max-width: 768px) {
    flex: 5;
  }

  z-index: 2;

  background-color: #f0f0f0;
  color: var(--appBackgroundColor);
  /* Due to problems in using '100vh' for mobile browsers */
  max-height: ${({ windowDimensions: wd }) =>
    `calc(${wd.height}px - var(--headerHeight))`};

  display: ${({ open }) => (open ? 'flex' : 'none')};
  flex-direction: column;

  position: relative;
`;

export const CloseButton = styled(IconButton).attrs({
  size: 'medium',
  'aria-label': 'close',
  color: 'inherit',
  children: <CloseIcon fontSize="large" />,
})`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;

  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

export const Conversation = styled.div`
  flex: 1;
  padding: 16px;

  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Message = styled.span`
  border-radius: 10px;
  margin-top: 1rem;
  padding: 0.5rem 3rem 0.5rem 0.5rem;
  max-width: 20rem;

  font-size: 1rem;
  line-height: 1.5rem;
  white-space: normal;
  word-break: break-all;

  ${({ origin }) => {
    if (origin === 'mine') {
      return css`
        align-self: flex-end;
        border-bottom-right-radius: 0px;

        background-color: #0077ff;
        color: #fff;
      `;
    }
    return css`
      align-self: flex-start;
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
