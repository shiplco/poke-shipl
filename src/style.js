import styled from 'styled-components'

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

export default StyledApp
