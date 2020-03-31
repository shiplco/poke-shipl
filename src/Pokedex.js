import React from 'react'
import styled from 'styled-components'

const StyledPokedex = styled.div`
  .pokedex {
    display: flex;
    flex-direction: row;

    i {
      margin-bottom: 10px;
    }

    p {
      margin: 0px;
    }

    .pokemon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .pokedex-info {
      display: flex;
      flex-direction: column;
      padding-left: 15px;
      margin-left: 15px;
      border-left: 2px solid #000;
      text-align: left;

      .breakline {
        flex: 1 1 100%;
        word-wrap: break-word;
        word-break: break-all;
        font-size: small;
      }
    }
  }
`

function Card (props) {
  return (
    <StyledPokedex>
      <div className='nes-container with-title is-centered'>
        <p className='title'>POKéDEX</p>
        <div className='pokedex'>
          <div className='pokemon'>
            {props.isLoading ? (
              <div>
                <i className='nes-pokeball' />
                {props.catch ? (
                  <p>You are trying to catch a {props.catch}!</p>
                ) : (
                  <p>Catch your Pokemon!</p>
                )}
              </div>
            ) : (
              props.pokemon && (
                <div>
                  {props.ownAEvolution
                    ? <img src={props.pokemon.pictureEvolution} alt='This is a Pokemon' />
                    : <i className={props.pokemon.picture} />}
                  <p>{props.pokemon.name}</p>
                </div>
              )
            )}
          </div>
          <div className='pokedex-info'>
            <p id='pokedex-info-network'>Network: {props.network}</p>
            <p id='pokedex-info-identity'>
              Identity:
              <a
                href={
                  props.network === 'mainnet'
                    ? `https://etherscan.io/address/${props.identity}`
                    : `https://${props.network}.etherscan.io/address/${props.identity}`
                }
                className='breakline'
                target='_blank'
                rel='noopener noreferrer'
              >
                {props.identity}
              </a>
            </p>
            <div>
              {props.transaction && (
                <p id='pokedex-info-transaction'>
                  Transaction:
                  <a
                    href={
                      props.network === 'mainnet'
                        ? `https://etherscan.io/tx/${props.transaction}`
                        : `https://${props.network}.etherscan.io/tx/${props.transaction}`
                    }
                    className='breakline'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {props.transaction}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </StyledPokedex>
  )
}

export default Card
