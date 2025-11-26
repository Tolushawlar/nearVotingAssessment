import React, { useEffect, useState } from 'react';
import './index.css';
import { initializeContract } from './utils/near';
import { testContract } from './utils/test-contract';
import WalletConnectionComponent from './components/WalletConnection';
import CreateProposal from './components/CreateProposal';
import ProposalList from './components/ProposalList';

function App() {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    initNear();
  }, []);

  const initNear = async () => {
    try {
      const { contract, wallet } = await initializeContract();
      const isSignedIn = wallet.isSignedIn();
      const currentAccountId = isSignedIn ? wallet.getAccountId() : null;
      
      setWallet(wallet);
      setContract(contract);
      setAccountId(currentAccountId);
      setLoading(false);
      
      if (contract) {
        loadProposals(contract);
      }
      
      console.log('NEAR initialized. Signed in:', isSignedIn, 'Account:', currentAccountId);
    } catch (error) {
      console.error('Failed to initialize NEAR:', error);
      setLoading(false);
    }
  };

  const loadProposals = async (contractInstance = contract) => {
    if (!contractInstance) return;
    try {
      const proposalIds = await contractInstance.get_all_proposal_ids();
      const proposalPromises = proposalIds.map(id => contractInstance.get_proposal_details({ proposal_id: id }));
      const proposalData = await Promise.all(proposalPromises);
      setProposals(proposalData.filter(p => p !== null));
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const handleProposalCreated = () => {
    loadProposals();
  };

  const handleVoteCast = () => {
    loadProposals();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', padding: '20px' }}>NEAR Voting App</h1>
      
      <WalletConnectionComponent wallet={wallet} accountId={accountId} />
      
      <div className="card">
        <h3>Debug Contract</h3>
        <button 
          className="button" 
          onClick={async () => {
            console.log('Testing contract...');
            const result = await testContract();
            if (result) {
              console.log('Found working method:', result.method);
            }
          }}
        >
          Test Contract Methods
        </button>
      </div>
      
      {accountId && contract && (
        <>
          <CreateProposal contract={contract} accountId={accountId} onProposalCreated={handleProposalCreated} />
          <ProposalList 
            contract={contract} 
            proposals={proposals} 
            accountId={accountId}
            onVoteCast={handleVoteCast}
          />
        </>
      )}
    </div>
  );
}

export default App;