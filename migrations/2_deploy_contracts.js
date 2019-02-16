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
const harborPubKey = "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="
const issuer1PubKey = "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="
const issuer2PubKey = "1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="
const issuer3PubKey = "oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8"

module.exports = async function(deployer) {
  const log = deployer.logger.log;
  try {
    await deployer.deploy(TokenRegulatorService, {privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey]});
    const regulator = await TokenRegulatorService.deployed();

    await deployer.deploy(ServiceRegistry, regulator.address, {privateFor: [harborPubKey, issuer1PubKey, issuer2PubKey, issuer3PubKey], overwrite: false});
    const registry = await ServiceRegistry.deployed();

    const copperToken = await deployer.new(RegulatedToken, registry.address, "Copper Token", "CPPR", {privateFor: [harborPubKey, issuer1PubKey]})
    log('copperToken.address ' + copperToken.address);

    const silverToken = await deployer.new(RegulatedToken, registry.address, "Silver Token", "SLVR", {privateFor: [harborPubKey, issuer2PubKey]})
    log('silverToken.address ' + silverToken.address);

    const goldToken = await deployer.new(RegulatedToken, registry.address, "Gold Token", "GOLD", {privateFor: [harborPubKey, issuer3PubKey]})
    log('goldToken.address ' + goldToken.address);
  }
  catch (e) {
    log(e);
  }
};
