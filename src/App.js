import React from 'react'
import ReactGA from 'react-ga'
import Shipl from 'shipl'
import Web3 from 'web3'
import Card from './Card'
import Pokedex from './Pokedex'
import TextBubble from './TextBubble'
import CardEvolution from './CardEvolution'
import contractAbi from './contractAbi'
import StyledApp from './style'

import CharmanderEvolution from './img/charmander-evolution.png'
import BalbasaurEvolution from './img/balbasaur-evolution.png'
import SquirtleEvolution from './img/squirtle-evolution.png'

const appId = 'kovan-821c17fe-df90-4250-a61f-3ea6f59d5f59'
const targetContractAddress = '0x87Dc39A69D0E86840632cFae9Fc9d14325Aa39C2'

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

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ownAPokemon: false,
      ownAEvolution: false,
      poke: undefined,
      isLoading: true,
      txHash: undefined,
      network: undefined,
      identity: undefined,
      catch: undefined,
      shiplwallet: undefined,
      web3: undefined,
      eth: undefined,
      contract: undefined
    }

    this.getAccount = this.getAccount.bind(this)
    this.claimPokemon = this.claimPokemon.bind(this)
    this.claimEvolution = this.claimEvolution.bind(this)
    this.pokedex = this.pokedex.bind(this)
  }

  async componentDidMount () {
    const shiplwallet = await Shipl.create({ appId, provider: 'shiplwallet' })
    const web3 = new Web3(shiplwallet.getWeb3Provider())
    const contract = new web3.eth.Contract(contractAbi, targetContractAddress)
    this.setState({
      web3,
      contract,
      shiplwallet,
      network: shiplwallet.getNetwork(),
      identity: shiplwallet.getIdentity()
    })

    if (shiplwallet.getIdentity()) {
      await this.pokedex()
    } else {
      this.setState({ textBubble: TextBubble({ text: 'RED, Shipl pay for the gas cost of this transaction. Which POKEMON do you want?' }) })
    }
    ReactGA.initialize('UA-136074649-4')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  async getAccount () {
    const account = (await this.state.web3.eth.getAccounts())[0]
    this.setState({ identity: this.state.shiplwallet.getIdentity() })
    return account
  }

  async claimPokemon (pokeId) {
    const account = await this.getAccount()
    this.state.contract.methods
      .claim(pokeId)
      .send({ from: account })
      .on('transactionHash', txHash => this.setState({ txHash }))
      .on('confirmation', (confirmation) => {
        if (confirmation === 1) this.pokedex()
      })
      .on('error', error => {
        console.error(error)
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
              <a href='https://shipl.co' target='_blank' rel='noopener noreferrer'>
                <h1>
                  <i className='nes-logo brand-logo' />
                  Poké Shipl
                </h1>
              </a>
              <p>A blockchain-less experience.</p>
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
              {this.state.web3 &&
                <div className='nes-container is-rounded'>
                  {this.state.ownAPokemon && !this.state.ownAEvolution &&
                    <CardEvolution
                      claimEvolution={this.claimEvolution}
                      pictureEvolution={this.state.poke.pictureEvolution}
                      id={this.state.poke.id}
                      idEvolution={this.state.poke.idEvolution}
                      disabled={this.state.web3 === undefined}
                    />}
                  <div className='card-board'>
                    {cards.map(e => (
                      <Card key={e.name} item={e} claim={this.claimPokemon} disabled={this.state.web3 === undefined} />
                    ))}
                  </div>
                </div>}
            </div>
          </section>
        </div>
        <footer>
          <p>
            <span>©2020 </span>
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
