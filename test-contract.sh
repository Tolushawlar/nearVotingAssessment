#!/bin/bash

# Test the voting contract directly with NEAR CLI
CONTRACT_ID="voting-app-hightdev.testnet"
ACCOUNT_ID="hightdevtest.testnet"

echo "Testing contract methods..."

# Test view methods
echo "1. Testing get_proposals..."
near view $CONTRACT_ID get_proposals '{"account_id": "'$ACCOUNT_ID'"}' --networkId testnet

echo "2. Testing get_proposal..."
near view $CONTRACT_ID get_proposal '{"proposal_id": 0, "account_id": "'$ACCOUNT_ID'"}' --networkId testnet

echo "3. Testing create_proposal..."
near call $CONTRACT_ID create_proposal '{
  "title": "Test Proposal", 
  "description": "Test Description", 
  "options": ["Yes", "No"], 
  "deadline": "1764077880000000000",
  "account_id": "'$ACCOUNT_ID'"
}' --accountId $ACCOUNT_ID --networkId testnet --deposit 0.01

echo "Done testing contract methods"