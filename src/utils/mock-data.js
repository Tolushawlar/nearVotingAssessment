// Mock data for demonstration when NEAR network is unavailable
export const mockProposals = [
  {
    id: 1,
    details: {
      title: "Should we implement dark mode?",
      description: "Vote on whether to add dark mode support to the platform",
      creator_id: "alice.testnet",
      deadline: Date.now() + 86400000 // 24 hours from now
    },
    results: {
      is_active: true,
      total_votes: 15,
      vote_counts: {
        "Yes": 10,
        "No": 5
      },
      winning_option: null
    }
  },
  {
    id: 2,
    details: {
      title: "Community Fund Allocation",
      description: "How should we allocate the community development fund?",
      creator_id: "bob.testnet",
      deadline: Date.now() - 3600000 // 1 hour ago (ended)
    },
    results: {
      is_active: false,
      total_votes: 42,
      vote_counts: {
        "Development": 25,
        "Marketing": 12,
        "Community Events": 5
      },
      winning_option: "Development"
    }
  }
];

export const mockWallet = {
  isSignedIn: () => false,
  getAccountId: () => null,
  requestSignIn: () => alert('Mock: Wallet sign-in requested'),
  signOut: () => alert('Mock: Wallet signed out')
};