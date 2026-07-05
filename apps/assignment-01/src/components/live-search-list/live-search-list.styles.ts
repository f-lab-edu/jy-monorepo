import styled from '@emotion/styled';

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 24px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
`;

export const EmptyState = styled.p`
  padding: 48px;
  text-align: center;
  color: #666;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

export const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PageText = styled.span`
  min-width: 60px;
  text-align: center;
`;
