import { connect, keyStores } from 'near-api-js';

const CONTRACT_ID = 'voting-app-hightdev.testnet';

export async function testContract() {
  try {
    const near = await connect({
      networkId: 'testnet',
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: 'https://rpc.testnet.fastnear.com',
      walletUrl: 'https://testnet.mynearwallet.com',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
    });

    const account = await near.account(CONTRACT_ID);
    
    // Check if contract exists
    try {
      const state = await account.state();
      console.log('Contract exists:', state);
      console.log('Contract has code:', state.code_hash !== '11111111111111111111111111111111');
      
    } catch (error) {
      console.error('Contract does not exist:', error);
      return false;
    }

    // Test common view methods
    const testMethods = [
      'get_proposals',
      'get_proposal', 
      'get_all_proposals',
      'list_proposals',
      'proposals'
    ];

    for (const method of testMethods) {
      try {
        const result = await account.viewFunction(CONTRACT_ID, method, {});
        console.log(`✅ Method ${method} works:`, result);
        return { method, result };
      } catch (error) {
        console.log(`❌ Method ${method} failed:`, error.message);
      }
    }

    return null;
  } catch (error) {
    console.error('Test failed:', error);
    return null;
  }
}