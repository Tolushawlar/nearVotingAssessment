import { connect, keyStores, WalletConnection } from 'near-api-js';
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format';

const nearConfig = {
  networkId: 'testnet',
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://testnet.mynearwallet.com/',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

const CONTRACT_ID = 'hightdevtest.testnet';

export async function initNear() {
  const near = await connect(nearConfig);
  const wallet = new WalletConnection(near, 'near-voting-app');
  return { near, wallet };
}

export async function callContract(near, methodName, args = {}, deposit = '0') {
  const account = await near.account(CONTRACT_ID);
  return await account.functionCall({
    contractId: CONTRACT_ID,
    methodName,
    args,
    attachedDeposit: parseNearAmount(deposit),
    gas: '300000000000000'
  });
}

export async function viewContract(near, methodName, args = {}) {
  const account = await near.account(CONTRACT_ID);
  return await account.viewFunction(CONTRACT_ID, methodName, args);
}

export { formatNearAmount, parseNearAmount, CONTRACT_ID };