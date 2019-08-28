pragma solidity 0.5.10;

contract Pokemon {

    mapping(address => uint) public owners;
	event Claim(address sender, uint256 pokemon);
	event EvolvePokemon(address sender, uint256 pokemon, uint256 value);

	address payable creator = 0x894B3ac42D42a72Cd84e3215e633f0A3A03e16F9;

    function evolvePokemon(uint256 pokemon, uint256 amount) public payable {
        // require(msg.value == amount);
        owners[msg.sender] = pokemon;
        emit EvolvePokemon(msg.sender, pokemon, amount);
    }

    function claim(uint256 pokemon) public {
        owners[msg.sender] = pokemon;
        emit Claim(msg.sender, pokemon);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public {
        creator.transfer(address(this).balance);
    }
}