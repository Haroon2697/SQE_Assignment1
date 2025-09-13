import styled from 'styled-components/macro';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  padding: 0 10px;

  @media only screen and (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  @media only screen and (min-width: ${({ theme: { breakpoints } }) =>
      breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 20px;
  }

  @media only screen and (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
  }

  @media only screen and (min-width: ${({ theme: { breakpoints } }) =>
      breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    padding: 0 30px;
  }
`;
