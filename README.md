Gate ERC-20 token.

An OpenZeppelin BurnableToken based token with 900M total supply.

[For more information, see [GSX group website](https://www.gsxgroup.global/).

The token is deployed at [0x9d7630adf7ab0b0cb00af747db76864df0ec82e4](https://etherscan.io/token/0x9d7630adf7ab0b0cb00af747db76864df0ec82e4).

# Deploying

## Testnet

Instructions to deploy on Goerly testnet.

1. Generate two new private keys, one for the deployment account and one for the server-side signer

```sh
openssl rand -hex 32
```

2. [Create account on Infura and get API key for Goerli network]().

3. Create a config file `secrets/goearly.env.ini`. For variable documentation see [deploy.js](src/scripts/deploy.ts).

```ini
deployerPrivateKeyHex = "..."

infuraProjectId = "..."


network = "goerli"

etherscanAPIKey = "..."
```

4. Get the address for the deployment account by running the deployer without ETH

```sh
npx ts-node src/scripts/deploy.ts secrets/goerli.testnet.ini
```

5. [Visit faucet to get testnet eth on the deployment account](https://goerli-faucet.slock.it/)

6. Deploy now with having some gas money

```sh
npx ts-node src/scripts/deploy.ts secrets/goearly.env.ini
```

# Creating a token snapshot

Here are instructions how to generate snapshots for old STACS token.

Create alias that runs the command `sto` from the command-line using Docker container.

```sh
alias sto='docker run -p 8545:8545 -v `pwd`:`pwd` -w `pwd` miohtama/sto:latest'
```

Create INI file with your API key.

sto.ini

```ini
network = ethereum

# Get this from your Infura dashboard
ethereum-node-url = https://mainnet.infura.io/v3/x
```

Build a snapshot of balances in local SQLite database. This database also contains historical balances and can be resynced with the network.

```sh
sto --config=mainnet.ini token-scan \
  --token-address=0x9b6443b0fb9c241a7fdac375595cea13e6b7807a
```

Print out balances sorted by the top holder first.
```sh
venv/bin/sto --config=mainnet.ini cap-table \
    --token-address=0x286708f069225905194673755f12359e6aff6fe1 \
    --order-by=balance \
    --order-direction=desc \
    --max-entries=99999
```

If you need a CSV, you can pipe the output of the last command to a file.

You can also query the number of token holders:

```sh
sto --config=mainnet.init cap-table \
    --token-address=0x9b6443b0fb9c241a7fdac375595cea13e6b7807a \
    --order-by=balance \
    --order-direction=desc \
    | wc -l
```

