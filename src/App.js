import React from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import Shipl from 'shipl-wallet'
import Web3Connect from 'web3connect'
import Web3 from 'web3'
import Card from './Card'
import Pokedex from './Pokedex'
import TextBubble from './TextBubble'
import CardEvolution from './CardEvolution'
import contractAbi from './contractAbi'

import CharmanderEvolution from './img/charmander-evolution.png'
import BalbasaurEvolution from './img/balbasaur-evolution.png'
import SquirtleEvolution from './img/squirtle-evolution.png'

const appId = 'kovan-ef6bd76f-28d7-428a-9c83-1bfedd681da5'
// const appId = 'rinkeby-36c1be6f-15dc-4f91-88c1-fe5101af099c'
// const appId = 'xdai-32bbb5ce-6083-4014-9d5b-d0dc4c93d931'
// const targetContractAddress = '0x590583649EB5166291Ca48cDbEaB9468F0095a36' // xdai
const targetContractAddress = '0xa0Dc4Ad26188ce6D8D9428EC0581D6a6310401f8' // kovan

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
    picture: 'nes-bulbasaur',
    pictureEvolution: BalbasaurEvolution,
    idEvolution: 11
  },
  {
    id: 2,
    name: 'Charmander',
    picture: 'nes-charmander',
    pictureEvolution: CharmanderEvolution,
    idEvolution: 22
  },
  {
    id: 3,
    name: 'Squirtle',
    picture: 'nes-squirtle',
    pictureEvolution: SquirtleEvolution,
    idEvolution: 33
  }
]

const web3Connect = new Web3Connect.Core({
  providerOptions: {
    portis: {
      id: 'PORTIS_ID', // required
      network: 'kovan' // optional
    },
    fortmatic: {
      key: 'FORTMATIC_KEY', // required
      network: 'kovan' // optional
    }
  }
})

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ownAPokemon: false,
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
    this.claimEvolution = this.claimEvolution.bind(this)
    this.pokedex = this.pokedex.bind(this)
  }

  chooseWeb3Provider () {
    return new Promise((resolve, reject) => {
      console.log('I am being called')
      web3Connect.toggleModal() // open modal on button click
      // subscibe to close
      web3Connect.on('close', () => {
        reject(new Error('Web3Connect Modal Closed')) // modal has closed
      })
      web3Connect.on('connect', (provider) => {
        return resolve(provider)
      })
    })
  }

  async componentDidMount () {
    const companyEmail = 'demo@shipl.co'
    const companyName = 'Shipl'
    const shiplwallet = await Shipl.create({ appId, companyEmail, companyName, provider: 'manual', web3Provider: window.ethereum, inputCallback: window.prompt })
    // const shiplwallet = await Shipl.create({ appId, companyEmail, companyName, provider: 'web3Connect', web3Fallback: this.chooseWeb3Provider, inputCallback: window.prompt })
    const web3 = new Web3(shiplwallet.getWeb3Provider())
    const contract = new web3.eth.Contract(contractAbi, targetContractAddress)
    this.setState({
      web3,
      contract,
      shiplwallet,
      network: shiplwallet.getNetwork(),
      identity: shiplwallet.getIdentity()
      // identity: shiplwallet.shiplID.auth.identity
    })

    if (shiplwallet.getIdentity()) {
      await this.pokedex()
    } else {
      this.setState({ textBubble: TextBubble({ text: 'RED, Shipl sponsor you the gas cost of this transaction. Which POKEMON do you want?' }) })
    }
    ReactGA.initialize('UA-136074649-4')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  async getAccount () {
    const account = (await this.state.web3.eth.getAccounts())[0]
    console.log('account', account)
    // this.setState({ identity: this.state.shiplwallet.shiplID.auth.identity })
    this.setState({ identity: this.state.shiplwallet.getIdentity() })
    return account
  }

  async claimPokemon (pokeId) {
    console.log('claimPokemin')
    const account = await this.getAccount()
    console.log('CLAIM.account', account)
    this.state.contract.methods
      .claim(pokeId)
      .send({ from: account })
      .on('transactionHash', txHash => this.setState({ txHash }))
      .on('confirmation', (confirmation) => {
        if (confirmation === 1) this.pokedex()
      })
    this.setState({
      isLoading: true,
      catch: cards[pokeId - 1].name,
      txHash: undefined
    })
  }

  async claimEvolution (pokeId, pokeIdEvolution) {
    const TX_VALUE = '1000000000000000000'
    const account = await this.getAccount()
    this.state.contract.methods
      .evolvePokemon(pokeIdEvolution, TX_VALUE)
      .send({ from: account, value: TX_VALUE })
      .on('transactionHash', txHash => this.setState({ txHash }))
      .on('confirmation', (confirmation) => {
        if (confirmation === 1) this.pokedex()
      })
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
    const pokeIdNumber = pokeId.toNumber()
    let cardIndex = pokeIdNumber - 1
    let poke = cards[cardIndex]
    if (pokeIdNumber === 11 || pokeIdNumber === 22 || pokeIdNumber === 33) {
      cardIndex = Math.round(pokeIdNumber / 10) - 1
      poke = cards[cardIndex]
      this.setState({ poke, isLoading: false, ownAPokemon: true, textBubble: null, ownAEvolution: true })
      this.setState({ textBubble: TextBubble({ text: 'RED you already have a POKEMON Evolution! Try other ones!' }) })
    } else if (pokeIdNumber === 1 || pokeIdNumber === 2 || pokeIdNumber === 3) {
      this.setState({ poke, isLoading: false, ownAPokemon: true, textBubble: null, ownAEvolution: false })
      this.setState({ textBubble: TextBubble({ text: 'RED, you can now for 1$ evolve your POKEMON.' }) })
    } else {
      this.setState({ textBubble: TextBubble({ text: 'RED, Shipl sponsor you the gas cost of this transaction. Which POKEMON do you want?' }) })
    }
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
              ownAEvolution={this.state.ownAEvolution}
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
                    alt='Nes professor'
                  />
                  <div className='nes-balloon from-left'>
                    {this.state.textBubble}
                  </div>
                </section>
              </section>
              <div className='nes-container is-rounded'>
                {this.state.ownAPokemon && !this.state.ownAEvolution &&
                  <CardEvolution
                    pictureEvolution={this.state.poke.pictureEvolution}
                    claimEvolution={this.claimEvolution}
                    id={this.state.poke.id}
                    idEvolution={this.state.poke.idEvolution}
                  />
                }
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
