import React, { Component } from "react";
import RegulatedToken from "./contracts/RegulatedToken.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

const HARBOR = 
  { name:"Registry", address:"0xa1650fb8c6f586c4e171d28c9f6bef85ca56695b", port: "22000"}
const COPPER = { name:"Copper", address:"0x6b50ce12b55035c835dcdb977450cb6af12e79d5", port: "22001"}
const SILVER = {  name:"Silver", address: "0x830b90b17a25826e5bfc0adda1927d54a52f9e07", port: "22002"} 
const GOLD = { name:"Gold", address: "0x45ce4de679dda2846c842b0356dc2db075aee2cf", port: "22003"};

const R_TOKENS = [HARBOR, GOLD, COPPER, SILVER]


class App extends Component {
  state = { web3: null, contract: null };
  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3(HARBOR.port);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      const instance = new web3.eth.Contract(
        RegulatedToken.abi,
        GOLD.address,
      );
      console.log(instance)
      let a = await web3.eth.getBalance(GOLD.address)
      console.log(a)
    
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateInstance = () => {
    let new_address = COPPER.address
    // Stores a given value, 5 by default.
    const instance =  this.state.web3.eth.Contract(
      RegulatedToken.abi,
      new_address,
    );
    // Get the value from the contract to prove it worked.
    this.setState({ contract: instance });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Permissioned Balance access</h1>
        <p>From different ports corresponding to different nodes, your view access will be limited.</p>
        <h2>Play with the sandbox below</h2>
      </div>
    );
  }
}

export default App;
