import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
`;

export const Message = styled.p`
  margin: 0;
  color: #c0392b;
`;

export const RetryButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #c0392b;
  border-radius: 6px;
  background: #fff;
  color: #c0392b;
  cursor: pointer;
`;
