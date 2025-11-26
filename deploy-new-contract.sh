#!/bin/bash

# Deploy to a new contract account to avoid deserialization errors
NEW_CONTRACT_ID="voting-app-v3-hightdev.testnet"
ACCOUNT_ID="hightdevtesting.testnet"

echo "Creating new contract account..."
near create-account $NEW_CONTRACT_ID --masterAccount $ACCOUNT_ID --initialBalance 10

echo "Deploying contract..."
near deploy --wasmFile ../near-voting-contract/target/wasm32-unknown-unknown/release/near_voting_contract.wasm --accountId $NEW_CONTRACT_ID

echo "Initializing contract..."
near call $NEW_CONTRACT_ID new '{"owner_id": "'$ACCOUNT_ID'"}' --accountId $NEW_CONTRACT_ID

echo "Testing contract..."
near call $NEW_CONTRACT_ID create_proposal '{
  "title": "Test Proposal",
  "description": "Testing new contract",
  "options": ["Yes", "No"],
  "deadline_nanoseconds": "1764077880000000000"
}' --accountId $ACCOUNT_ID --deposit 0.01

echo "Contract deployed to: $NEW_CONTRACT_ID"