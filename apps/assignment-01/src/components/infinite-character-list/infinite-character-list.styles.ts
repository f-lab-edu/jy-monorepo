import styled from '@emotion/styled';

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
`;

// 목록 끝에 두는 감지용 요소. 이 영역이 보이면 다음 페이지를 불러온다.
export const Sentinel = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
  color: #666;
`;
