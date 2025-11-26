import React from 'react';

export default function WalletConnection({ wallet, accountId }) {
  const signIn = () => {
    if (wallet) {
      wallet.requestSignIn({
        contractId: 'voting-app-hightdev.testnet',
        methodNames: ['create_proposal', 'cast_vote']
      });
    }
  };

  const signOut = () => {
    if (wallet) {
      wallet.signOut();
      window.location.reload();
    }
  };

  if (!wallet) {
    return (
      <div className="card">
        <h3>Wallet Connection</h3>
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Wallet Connection</h3>
      {accountId ? (
        <div>
          <span>Connected: {accountId}</span>
          <button className="button" onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button className="button" onClick={signIn}>Connect NEAR Wallet</button>
      )}
    </div>
  );
}