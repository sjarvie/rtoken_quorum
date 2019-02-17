import React, { Component } from "react";
import RegulatedToken from "./contracts/RegulatedToken.json";
import getWeb3 from "./utils/getWeb3";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import "./App.css";

const MASTER = 
  { name:"Regulator", address:"0xcc11df45aba0a4ff198b18300d0b148ad2468834", port: "22000"} // TODO PORTS MIGHT NOT BE RIGHT
const COPPER = { name:"Copper", address:"0x67bb49f7bd40b6a1226d77dc07fb38f03680c94f", port: "22001"}
const SILVER = {  name:"Silver", address: "0xa38e9cbd5f7acc5ce3790c1558d0d50669aeb577", port: "22002"} 
const GOLD = { name:"Gold", address: "0x9ff7c866f0d8a6c7a6e478846f50e334e8cb93ae", port: "22003"};

const toMintAccounts = {
  P1: "0x6897c4c4cc4Ec1581B2e978e07981B67F0e88d7E",
  P2: "0x6c210c624B7D2A1a5E0Bba1207262DBa333D18E0",
  P3: "0x367e45461Be0D299c47C60eAD4c079078d23243A",
}

class App extends Component {
  state = { web3: null, contract: null, balances: [0,0,0], issuer: COPPER, node: MASTER};

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3(this.state.node.port);
      const instance = await new web3.eth.Contract(RegulatedToken.abi,  this.state.issuer.address)
      this.setState({ web3, contract: instance }, this.updateBalances);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateBalances = async () => {
    console.log("UPDATING BALANCES")
    let a = 0
    let b = 0 
    let c = 0 
    try {
      a = await this.state.contract.methods.balanceOf(toMintAccounts.P1).call()
    } catch{
      console.log("BBAD")
    }
    try {
      b = await this.state.contract.methods.balanceOf(toMintAccounts.P2).call()
    } catch {
      console.log("BAD")
     }
    try {
      c = await this.state.contract.methods.balanceOf(toMintAccounts.P3).call()
    } catch{      
      console.log("BBAD")
  }
    console.log([a,b,c])
    
    this.setState({ balances: [parseInt(a),parseInt(b),parseInt(c)] })
  }

  updateContract = async () => {
    console.log("UPDATING CONTRACT")
    const instance = await new this.state.web3.eth.Contract(RegulatedToken.abi, this.state.issuer.address)
    // Get the value from the contract to prove it worked.
    this.setState({contract: instance }, this.updateBalances);
  };

  updateNode = async () => {
    const web3 = await getWeb3(this.state.node.port);
    console.log("**************** PORT *******************")
    console.log(this.state.node.port)
    this.setState({ web3: web3 }, this.updateContract);

  }

  setIssuer = (e) => { 
    let issuer; 
    if (e.target.id === "GOLD_ISSUER"){
      issuer = GOLD
    } else if (e.target.id === "SILVER_ISSUER") {
      issuer = SILVER
    } else if (e.target.id === "COPPER_ISSUER") { 
      issuer = COPPER
    } else {
      return;
    }
    this.setState( {issuer: issuer }, this.updateContract)
  }

  setNode = (e) => { 
    let node; 
    if (e.target.id === "MASTER") {
      node = MASTER
    } else if (e.target.id === "GOLD") {
      node = GOLD
    } else if (e.target.id === "SILVER") {
      node = SILVER
    } else if (e.target.id === "COPPER") {
      node = COPPER
    } else {
      return
    }

     this.setState({ node: node }, this.updateNode)
  }

  printBalances = () => {
    console.log(this.state.balances)
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h1>Permissioned Balance access</h1>
        <p>From different ports corresponding to different nodes, your view access will be limited.</p>
        <p>Currently showing <b>{this.state.issuer.name}</b> from the perspective of <b>{this.state.node.name}</b></p>
        <h2>Play with the sandbox below</h2>

        <br />
        <span className="dropdowns">
        <Dropdown >
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Node: {this.state.node.name}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item id="MASTER" onClick={this.setNode}>Harbor</Dropdown.Item>
            <Dropdown.Item id="GOLD" onClick={this.setNode}>Issuer 1 (Gold)</Dropdown.Item>
            <Dropdown.Item id="SILVER" onClick={this.setNode}>Issuer 2 (Silver)</Dropdown.Item>
            <Dropdown.Item id="COPPER" onClick={this.setNode}>Issuer 3 (Copper)</Dropdown.Item>

          </Dropdown.Menu>

        </Dropdown>
        <Dropdown className="rightdd" >
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Issuer: {this.state.issuer.name}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item id="GOLD_ISSUER" onClick={this.setIssuer}>Issuer 1 (Gold)</Dropdown.Item>
            <Dropdown.Item id="SILVER_ISSUER" onClick={this.setIssuer}>Issuer 2 (Silver)</Dropdown.Item>
            <Dropdown.Item id="COPPER_ISSUER" onClick={this.setIssuer}>Issuer 3 (Copper)</Dropdown.Item>

          </Dropdown.Menu>

        </Dropdown>
        </span>

        <br/> 
        <Table striped bordered hover size="md">
          <thead>
            <tr>
              <th>Investor Address</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{toMintAccounts.P1}</th>
              <th>{this.state.balances[0]}</th>
            </tr>
            <tr>
              <th>{toMintAccounts.P2}</th>
              <th>{this.state.balances[1]}</th>
            </tr>
            <tr>
              <th>{toMintAccounts.P3}</th>
              <th>{this.state.balances[2]}</th>
            </tr>
          </tbody>
        </Table>

        <Button variant="outline-primary" onClick={this.updateBalances}>
          Update Balances
        </Button>
      </div>

    );
  }
}

export default App;
