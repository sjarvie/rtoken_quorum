/**
   Copyright (c) 2017 Harbor Platform, Inc.

   Licensed under the Apache License, Version 2.0 (the “License”);
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an “AS IS” BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

const ServiceRegistry = artifacts.require("./ServiceRegistry.sol");
const TokenRegulatorService = artifacts.require("./TokenRegulatorService.sol");
const RegulatedToken = artifacts.require("./RegulatedToken.sol");
const harborPubKey = "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=";
const issuer1PubKey = "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=";
const issuer2PubKey = "1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg=";
const issuer3PubKey = "oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8";

const Web3 = require("web3");
const BigNumber = require("bignumber.js");
const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:22000")
);
const toMintAmount = web3.utils.toWei(new BigNumber(100).toString(), "ether");
const toMintAccounts = [
  "0x6897c4c4cc4Ec1581B2e978e07981B67F0e88d7E",
  "0x6c210c624B7D2A1a5E0Bba1207262DBa333D18E0",
  "0x367e45461Be0D299c47C60eAD4c079078d23243A"
];

module.exports = async function(deployer) {
  const log = deployer.logger.log;
  try {
    await deployer.deploy(TokenRegulatorService, {
      gasPrice: 0,
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    });
    const regulator = await TokenRegulatorService.deployed();

    await deployer.deploy(ServiceRegistry, regulator.address, {
      gasPrice: 0,
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey],
      overwrite: false
    });
    const registry = await ServiceRegistry.deployed();

    const copperToken = await deployer.new(
      RegulatedToken,
      registry.address,
      "Copper Token",
      "CPPR",
      { gasPrice: 0, privateFor: [harborPubKey, issuer1PubKey] }
    );
    log("copperToken.address " + copperToken.address);

    const silverToken = await deployer.new(
      RegulatedToken,
      registry.address,
      "Silver Token",
      "SLVR",
      { gasPrice: 0, privateFor: [harborPubKey, issuer2PubKey] }
    );
    log("silverToken.address " + silverToken.address);

    const goldToken = await deployer.new(
      RegulatedToken,
      registry.address,
      "Gold Token",
      "GOLD",
      { gasPrice: 0, privateFor: [harborPubKey, issuer3PubKey] }
    );
    log("goldToken.address " + goldToken.address);

    // Set permissions on regulator service
    regulator.setPermission(copperToken.address, toMintAccounts[0], 0x1 | 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Send/Receive
    regulator.setPermission(copperToken.address, toMintAccounts[1], 0x1 | 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Send/Receive
    regulator.setPermission(copperToken.address, toMintAccounts[2], 0x1 | 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Send/Receive
    regulator.setPermission(silverToken.address, toMintAccounts[0], 0x1 | 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Send/Receive
    regulator.setPermission(silverToken.address, toMintAccounts[1], 0x1 | 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Send/Receive
    regulator.setPermission(silverToken.address, toMintAccounts[2], 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Receive
    regulator.setPermission(goldToken.address, toMintAccounts[0], 0x1 | 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Send/Receive
    regulator.setPermission(goldToken.address, toMintAccounts[1], 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Receive
    regulator.setPermission(goldToken.address, toMintAccounts[2], 0x2, {
      privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]
    }); // Receive

    for (var i = 0; i < toMintAccounts.length; i++) {
      log("Minting tokens to " + toMintAccounts[i]);
      copperToken.mint(toMintAccounts[i], toMintAmount, {
        privateFor: [harborPubKey, issuer1PubKey]
      });
      silverToken.mint(toMintAccounts[i], toMintAmount, {
        privateFor: [harborPubKey, issuer2PubKey]
      });
      goldToken.mint(toMintAccounts[i], toMintAmount, {
        privateFor: [harborPubKey, issuer3PubKey]
      });
    }
  } catch (e) {
    log(e);
  }
};
