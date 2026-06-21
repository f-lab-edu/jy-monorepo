import styled from '@emotion/styled';

export const Card = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  list-style: none;
`;

export const Name = styled.span`
  font-weight: 600;
`;

export const Meta = styled.span`
  font-size: 0.875rem;
  color: #666;
`;
