import React, { useState } from 'react';

export default function ProposalList({ contract, proposals, accountId, onVoteCast }) {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');

  const castVote = async (proposalId, optionIndex) => {
    setError('');
    setLoading({ ...loading, [proposalId]: true });
    
    try {
      await contract.cast_vote({
        proposal_id: proposalId,
        vote_option: proposal.options[optionIndex]
      }, '300000000000000');
      
      if (onVoteCast) onVoteCast();
    } catch (error) {
      console.error('Error casting vote:', error);
      setError('Failed to cast vote: ' + error.message);
    }
    
    setLoading({ ...loading, [proposalId]: false });
  };

  const getResults = async (proposalId) => {
    try {
      return await contract.get_proposal_results({ proposal_id: proposalId });
    } catch (error) {
      console.error('Error getting results:', error);
      return null;
    }
  };

  const formatDate = (nanoseconds) => {
    const date = new Date(parseInt(nanoseconds) / 1000000);
    return date.toLocaleString();
  };

  const isExpired = (deadline) => {
    const now = Date.now() * 1000000;
    return parseInt(deadline) < now;
  };

  const ProposalCard = ({ proposal }) => {
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const expired = isExpired(proposal.deadline);

    const loadResults = async () => {
      if (!showResults) {
        const proposalResults = await getResults(proposal.id);
        setResults(proposalResults);
      }
      setShowResults(!showResults);
    };

    const getTotalVotes = () => {
      if (!results) return 0;
      return results.votes.reduce((sum, count) => sum + count, 0);
    };

    const getWinningOption = () => {
      if (!results) return null;
      const maxVotes = Math.max(...results.votes);
      const winnerIndex = results.votes.indexOf(maxVotes);
      return { index: winnerIndex, votes: maxVotes };
    };

    return (
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>{proposal.title}</h3>
        <p>{proposal.description}</p>
        <p><strong>Deadline:</strong> {formatDate(proposal.deadline)}</p>
        <p><strong>Status:</strong> {expired ? 'Expired' : 'Active'}</p>
        
        {!expired && accountId && (
          <div style={{ marginTop: '15px' }}>
            <h4>Cast Your Vote:</h4>
            {proposal.options.map((option, index) => (
              <button
                key={index}
                onClick={() => castVote(proposal.id, index)}
                disabled={loading[proposal.id]}
                style={{
                  display: 'block',
                  width: '100%',
                  margin: '5px 0',
                  padding: '10px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {loading[proposal.id] ? 'Voting...' : option}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: '15px' }}>
          <button
            onClick={loadResults}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
        </div>

        {showResults && results && (
          <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Results:</h4>
            <p><strong>Total Votes:</strong> {getTotalVotes()}</p>
            
            {expired && (
              <p><strong>Winner:</strong> {
                getTotalVotes() > 0 
                  ? `${proposal.options[getWinningOption().index]} (${getWinningOption().votes} votes)`
                  : 'No votes cast'
              }</p>
            )}
            
            <div>
              {proposal.options.map((option, index) => (
                <div key={index} style={{ margin: '5px 0' }}>
                  <strong>{option}:</strong> {results.votes[index]} votes
                  {getTotalVotes() > 0 && (
                    <span style={{ marginLeft: '10px', color: '#666' }}>
                      ({((results.votes[index] / getTotalVotes()) * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!proposals || proposals.length === 0) {
    return (
      <div className="card">
        <h3>Proposals</h3>
        <p>No proposals found. Create the first one!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>All Proposals</h2>
      {error && <div className="error">{error}</div>}
      {proposals.map((proposal, index) => (
        <ProposalCard key={proposal.id || index} proposal={proposal} />
      ))}
    </div>
  );
}