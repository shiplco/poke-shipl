import React from "react";
import Card from "./Card";
import Pokedex from "./Pokedex";
import styled from "styled-components";
import web3 from "web3";
// import ethers from "ethers";

const appId = "5fc6c72e-db33-4829-9a81-a4227b96238c";
const targetContractAddress = "0x1c314cc1f12c6ae930385de21024cf32b63ffa0d";

const contractAbi = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address"
      }
    ],
    name: "owners",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "pokemon",
        type: "uint256"
      }
    ],
    name: "claim",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

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
`;

const cards = [
  {
    id: 1,
    name: "Bulbasaur",
    picture: "nes-bulbasaur"
  },
  {
    id: 2,
    name: "Charmander",
    picture: "nes-charmander"
  },
  {
    id: 3,
    name: "Squirtle",
    picture: "nes-squirtle"
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poke: undefined,
      isLoading: true,
      txHash: undefined,
      network: undefined,
      identity: undefined,
      catch: undefined
    };
  }

  async componentDidMount() {
    this.vaultX = await window.shiplwallet.create({
      appId
    });
    this.web3 = new web3(this.vaultX.getWeb3Provider());
    this.contract = new this.web3.eth.Contract(
      contractAbi,
      targetContractAddress,
      this.vaultX.getWeb3Provider()
    );
    this.setState({
      network: this.vaultX.shiplID.network,
      identity: this.vaultX.shiplID.auth.identity
    });
    this.pokedex();
  }

  claimPokemon = async pokeId => {
    const account = (await this.web3.eth.getAccounts())[0];
    this.contract.methods
      .claim(pokeId)
      .send({ from: account })
      .on("transactionHash", txHash => this.setState({ txHash }))
      .on("confirmation", () => this.pokedex());
    this.setState({
      isLoading: true,
      catch: cards[pokeId - 1].name,
      txHash: undefined
    });
  };

  pokedex = async () => {
    const account = (await this.web3.eth.getAccounts())[0];
    const pokeId = await this.contract.methods
      .owners(account)
      .call({ from: account });
    const poke = cards[pokeId.toNumber() - 1];
    this.setState({ poke, isLoading: false });
  };

  render() {
    return (
      <StyledApp>
        <header>
          <div className="container">
            <div className="nav-brand">
              <a
                href="https://shipl.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h1>
                  <i className="nes-logo brand-logo" />
                  Poké Shipl
                </h1>
              </a>
              <p>A new user experience over the blockchain.</p>
            </div>
          </div>
        </header>
        <div className="container">
          <section className="topic half">
            <div>
              <h2 id="Information">#Information</h2>
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

          <section className="showcase">
            <div className="nes-container with-title is-centered">
              <p className="title">POKéMON CENTER</p>
              <section className="message-list">
                <section className="message -left">
                  <img
                    src="https://vignette.wikia.nocookie.net/pokemontowerdefensetwo/images/c/cd/Professoroak_icon.png/revision/latest?cb=20130710043109"
                    alt=""
                  />
                  <div className="nes-balloon from-left">
                    <p>Now, RED, which POKEMON do you want?</p>
                  </div>
                </section>
              </section>
              <div className="nes-container is-rounded">
                <div className="card-board">
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
              href="https://shipl.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shipl.co
            </a>{" "}
            <span>-</span>{" "}
            <a
              href="https://github.com/aneopsy"
              target="_blank"
              rel="noopener noreferrer"
            >
              @AneoPsy
            </a>
          </p>
        </footer>
      </StyledApp>
    );
  }
}

export default App;
