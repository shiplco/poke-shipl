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
      <img style={{ maxWidth: '200px' }} src={props.pictureEvolution} alt='This is an evolution of a Pokemon' />
      <button
        type='button'
        className='nes-btn is-primary'
        id={'evolve-button-' + props.id}
        onClick={() => props.claimEvolution(props.id, props.idEvolution)}
        style={{ height: 50, width: 200 }}
        disabled={props.disabled}
      >
        Evolve
      </button>
    </StyledCard>
  )
}

export default Card
