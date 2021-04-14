/**
 * Set ups a environment for deploying mainnet versions of new token, staking and swap contracts.
 *
 * Actual deployment is done through ts-node REPL where you can import inputs.
 *
 * Using OpenZeppelin SDK https://github.com/OpenZeppelin/openzeppelin-sdk
 *
 * More docs: https://github.com/OpenZeppelin/openzeppelin-sdk/tree/master/packages/lib#readme
 *
 * https://ethereum.stackexchange.com/questions/67407/how-to-deploy-a-smart-contract-using-infura-and-web3js1-x-x-on-nodejs
 */

import { resolve } from 'path';
import { ZWeb3, Contracts } from '@openzeppelin/upgrades';
import * as envalid from 'envalid';
import { Account } from 'eth-lib/lib'; // https://github.com/MaiaVictor/eth-lib/blob/master/src/account.js

import { checkDeploymentAccounts, createProvider, deployContract } from '../utils/deploy';

// We need all of these secrets from our
// secrets/goerli.env.ini config file
const inputs = {
  // Deployment account private key
  deployerPrivateKeyHex: envalid.str(),

  // "goerli" or "ropsten"
  network: envalid.str(),

  // Needed to verify deployed contracts on EtherScan
  etherscanAPIKey: envalid.str(),

  // Infura project id key for command-line web3 client for testnet
  infuraProjectId: envalid.str(),

};

// Get config file from the command line or fallback to the default
const configPath = process.argv[2] || 'secrets/aprilfools.ini';

console.log('Using configuration file', resolve(configPath));

// https://www.npmjs.com/package/envalid
const envOptions = {
  dotEnvPath: configPath,
};

/**
 * This function is made available for ts-node REPL.
 *
 * You get all inputs needed and then you can manually deploy contracts one by one.
 */
export async function deploy(): Promise<any> {
  const {
    deployerPrivateKeyHex,
    etherscanAPIKey,
    infuraProjectId,
    network,
  } = envalid.cleanEnv(process.env, inputs, envOptions);

  // Get a websocket that connects us to Infura Ethereum node
  const deploymentKeys = [deployerPrivateKeyHex];
  const provider = createProvider(deploymentKeys, infuraProjectId, network);

  // OpenZeppelin framework likes it globals
  // // https://github.com/OpenZeppelin/openzeppelin-sdk/blob/62ffef55559e0076ef6066ccf2861fd31de6a3aa/packages/lib/src/artifacts/ZWeb3.ts
  ZWeb3.initialize(provider);

  console.log('Connected to', await ZWeb3.getNetworkName(), 'network');

  // Check we have money on accounts we need
  await checkDeploymentAccounts(deploymentKeys);

  // Loads a compiled contract using OpenZeppelin test-environment
  const AprilFools = Contracts.getFromLocal('AprilFools');

  // Deployer account serves all owner functions
  const deployer = Account.fromPrivate(`0x${deployerPrivateKeyHex}`).address;

  const token = await deployContract('token', AprilFools, [], { from: deployer }, etherscanAPIKey);

  console.log('AprilFools deployed at', network, token.address);

}

// Top level async is not supported yet, so we need to wrap this in a function
async function run(): Promise<void> {
    try {
      await deploy();
    } catch (e) {
      // Show any exceptions to the user
      console.log(e);
    }

    // Need to explicitly terminate the process or websocket
    // lingers and keeps us alive
    process.exit(0);
  }

  run();
