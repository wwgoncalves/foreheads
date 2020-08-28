import styled from 'styled-components';

export const Container = styled.header`
  height: var(--headerHeight);
  background-color: var(--appBackgroundColor);

  display: flex;
  align-items: center;
  justify-content: space-between;

  #room-id {
    font-family: monospace;
    color: var(--muiDefaultColor);
    background-color: var(--muiSecondaryBgColor);
    border-radius: 4px;
    padding: 0.25rem 0.25rem;
  }

  .whatsapp {
    margin-left: 0.25rem;
    min-width: unset;

    color: var(--whatsappColor);
    background-color: var(--whatsappBgColor);
  }
  .whatsapp:hover {
    background-color: var(--whatsappBgColorHover);
  }
`;
