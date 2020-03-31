import React from 'react'
import styled from 'styled-components'

const StyledCard = styled.div`
  margin: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  align-items: center;

  i {
    margin-bottom: 10px;
  }
`

function Card (props) {
  return (
    <StyledCard>
      <i className={props.item.picture} />
      <button
        type='button'
        className='nes-btn is-primary'
        id={'claim-button-' + props.item.id}
        onClick={() => props.claim(props.item.id)}
        style={{ height: 50, width: 200 }}
        disabled={props.disabled}
      >
        Choose
      </button>
    </StyledCard>
  )
}

export default Card
