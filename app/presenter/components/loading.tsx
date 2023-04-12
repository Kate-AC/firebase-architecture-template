import { RotatingLines } from 'react-loader-spinner'
import styled from 'styled-components'

const LoadingStyled = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s 0s ease;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  z-index: 100;
`

export const Loading = () => {
  return (
    <LoadingStyled>
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </LoadingStyled>
  )
}
