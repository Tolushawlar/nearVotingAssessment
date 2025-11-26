import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format';

const nearConfig = {
  networkId: 'testnet',
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: '/',
  walletUrl: 'https://testnet.mynearwallet.com',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

const CONTRACT_ID = 'voting-app-v2-hightdev.testnet';

export async function initializeContract() {
  const near = await connect(nearConfig);
  const wallet = new WalletConnection(near, 'near-voting-app');
  
  let contract = null;
  if (wallet.isSignedIn()) {
    contract = new Contract(
      wallet.account(),
      CONTRACT_ID,
      {
        viewMethods: ['get_proposal_details', 'get_proposal_results', 'get_all_proposal_ids'],
        changeMethods: ['create_proposal', 'cast_vote'],
      }
    );
  }

  return { contract, wallet, nearConfig, near, CONTRACT_ID };
}

export { formatNearAmount, parseNearAmount };