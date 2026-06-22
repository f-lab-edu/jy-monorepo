import styled from '@emotion/styled';

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
