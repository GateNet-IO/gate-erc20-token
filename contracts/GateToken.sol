// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20Burnable.sol
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";


/**
 * Gate ERC-20 token is 1:1 ERC20 Burnable from OpenZeppelin contracts package:
 *
 */
contract GateToken is ERC20Burnable {

    constructor() ERC20("GATE", "GATE")  {
        _mint(msg.sender, 900_000_000 ether);
    }
}