import styled from '@emotion/styled';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

export const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;

  &:disabled {
    color: #bbb;
    cursor: not-allowed;
  }
`;

export const PageText = styled.span`
  min-width: 64px;
  text-align: center;
`;
