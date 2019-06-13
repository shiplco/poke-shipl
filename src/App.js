import React from 'react'
import ReactGA from 'react-ga'
import Card from './Card'
import Pokedex from './Pokedex'
import styled from 'styled-components'
import Web3 from 'web3'
import Shiplwallet from 'shipl-wallet'

const appId = '5fc6c72e-db33-4829-9a81-a4227b96238c'
const targetContractAddress = '0x1c314cc1f12c6ae930385de21024cf32b63ffa0d'

const contractAbi = [
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'owners',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'pokemon',
        type: 'uint256'
      }
    ],
    name: 'claim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

const StyledApp = styled.div`
  font-family: "Press Start 2P";
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  margin: 20px;

  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
    border-bottom: 4px solid #d3d3d3;
    background-color: white;
  }

  header > .container {
    display: flex;
    align-items: baseline;
    max-width: 1080px;
    margin: 0 auto;
    padding-top: 1rem;
    transition: all 0.2s ease;
  }

  header > .container > .nav-brand {
    margin-right: auto;
  }

  .nav-brand .brand-logo {
    margin-right: 1rem;
  }

  .container {
    max-width: 980px;
    margin: 0 auto;
    margin-top: 150px;
  }

  .card-board {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .showcase {
    margin-top: 2.5rem;
  }

  section.message-list {
    display: flex;
    flex-direction: column;
  }
  .message-list > .message.-left {
    align-self: flex-start;
  }

  .message-list > .message.-right {
    align-self: flex-end;
  }

  .message-list > .message {
    display: flex;
    margin-top: 2rem;
    align-items: flex-end;
    align-items: end;
  }

  img {
    margin: 10px;
    max-width: 96px;
  }

  .half {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  footer {
    margin-top: 30px;
    text-align: center;
  }

  @media (max-width: 380px) {
    .nes-prof,
    .nes-bulbasaur,
    .nes-charmander,
    .nes-squirtle,
    .nes-pokeball {
      transform: scale(0.8);
    }

    p {
      line-height: 1.2;
      font-size: 12px;
    }

    h1 {
      font-size: 1.5em;
    }

    .nav-brand {
      margin: 0px 10px 0px 10px !important;
    }

    .nes-container {
      padding: 1rem 1.2rem;
    }

    .pokedex-info {
      padding-left: 10px;
      margin-left: 10px;
    }
  }
`

const cards = [
  {
    id: 1,
    name: 'Bulbasaur',
    picture: 'nes-bulbasaur'
  },
  {
    id: 2,
    name: 'Charmander',
    picture: 'nes-charmander'
  },
  {
    id: 3,
    name: 'Squirtle',
    picture: 'nes-squirtle'
  }
]

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      poke: undefined,
      isLoading: true,
      txHash: undefined,
      network: undefined,
      identity: undefined,
      catch: undefined,
      shiplwallet: undefined,
      web3: undefined,
      contract: undefined
    }

    this.getAccount = this.getAccount.bind(this)
    this.claimPokemon = this.claimPokemon.bind(this)
    this.pokedex = this.pokedex.bind(this)
  }

  async componentWillMount () {
    const shiplwallet = await Shiplwallet.create({ appId })
    const web3 = new Web3(shiplwallet.getWeb3Provider())
    const contract = new web3.eth.Contract(contractAbi, targetContractAddress)
    this.setState({
      web3,
      contract,
      shiplwallet,
      network: shiplwallet.shiplID.network,
      identity: shiplwallet.shiplID.auth.identity
    })

    if (shiplwallet.shiplID.auth.identity) {
      this.pokedex()
    }
  }

  componentDidMount () {
    ReactGA.initialize('UA-136074649-4')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  async getAccount () {
    const account = (await this.state.web3.eth.getAccounts())[0]
    this.setState({ identity: this.state.shiplwallet.shiplID.auth.identity })
    return account
  }

  async claimPokemon (pokeId) {
    const account = await this.getAccount()
    this.state.contract.methods
      .claim(pokeId)
      .send({ from: account })
      .on('transactionHash', txHash => this.setState({ txHash }))
      .on('confirmation', () => this.pokedex())
    this.setState({
      isLoading: true,
      catch: cards[pokeId - 1].name,
      txHash: undefined
    })
  }

  async pokedex () {
    const account = await this.getAccount()
    const pokeId = await this.state.contract.methods
      .owners(account)
      .call({ from: account })
    const poke = cards[pokeId.toNumber() - 1]
    this.setState({ poke, isLoading: false })
  }

  render () {
    return (
      <StyledApp>
        <header>
          <div className='container'>
            <div className='nav-brand'>
              <a
                href='https://shipl.co'
                target='_blank'
                rel='noopener noreferrer'
              >
                <h1>
                  <i className='nes-logo brand-logo' />
                  Poké Shipl
                </h1>
              </a>
              <p>A new user experience over the blockchain.</p>
            </div>
          </div>
        </header>
        <div className='container'>
          <section className='topic half'>
            <div>
              <h2 id='Information'>#Information</h2>
              <p>
                No Ether? No Problem! Shipl enables dApps developers to pay
                transactions on behalf of their users; they can now interact
                with your dApp with an empty wallet.
              </p>
            </div>
            <Pokedex
              network={this.state.network}
              catch={this.state.catch}
              pokemon={this.state.poke}
              isLoading={this.state.isLoading}
              identity={this.state.identity}
              transaction={this.state.txHash}
            />
          </section>

          <section className='showcase'>
            <div className='nes-container with-title is-centered'>
              <p className='title'>POKéMON CENTER</p>
              <section className='message-list'>
                <section className='message -left'>
                  <img
                    className='nes-prof'
                    src='https://vignette.wikia.nocookie.net/pokemontowerdefensetwo/images/c/cd/Professoroak_icon.png/revision/latest?cb=20130710043109'
                    alt=''
                  />
                  <div className='nes-balloon from-left'>
                    <p>Now, RED, which POKEMON do you want?</p>
                  </div>
                </section>
              </section>
              <div className='nes-container is-rounded'>
                <div className='card-board'>
                  {cards.map(e => (
                    <Card key={e.name} item={e} claim={this.claimPokemon} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
        <footer>
          <p>
            <span>©2019 </span>
            <a
              href='https://shipl.co'
              target='_blank'
              rel='noopener noreferrer'
            >
              shipl.co
            </a>{' '}
            <span>-</span>{' '}
            <a
              href='https://github.com/shiplco/poke-shipl'
              target='_blank'
              rel='noopener noreferrer'
            >
              See the code <span role='img' aria-label='computer' aria-hidden>💻</span> on github
            </a>{' '}
          </p>
        </footer>
      </StyledApp>
    )
  }
}

export default App
