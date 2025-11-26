import React, { useState } from 'react';
import { parseNearAmount } from '../utils/near';

export default function CreateProposal({ contract, accountId, onProposalCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addOption = () => setOptions([...options, '']);
  
  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };
  
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createProposal = async () => {
    setError('');
    
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }
    
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }
    
    if (!deadline) {
      setError('Deadline is required');
      return;
    }

    setLoading(true);
    try {
      const deadlineNs = new Date(deadline).getTime() * 1000000;
      await contract.create_proposal({
        title: title.trim(),
        description: description.trim(),
        options: validOptions,
        deadline_nanoseconds: deadlineNs.toString()
      }, '300000000000000', parseNearAmount('0.01'));
      
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setDeadline('');
      
      if (onProposalCreated) onProposalCreated();
    } catch (error) {
      console.error('Error creating proposal:', error);
      setError('Failed to create proposal: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Create New Proposal</h3>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Proposal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      
      <textarea
        placeholder="Proposal Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea"
        style={{ height: '80px', marginBottom: '10px' }}
      />
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Voting Options:</h4>
        {options.map((option, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="input"
              style={{ marginRight: '10px' }}
            />
            {options.length > 2 && (
              <button 
                type="button" 
                onClick={() => removeOption(index)}
                style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={addOption}
          style={{ padding: '5px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', marginTop: '5px' }}
        >
          Add Option
        </button>
      </div>

      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        min={new Date().toISOString().slice(0, 16)}
        className="input"
        style={{ marginBottom: '15px' }}
      />
      
      <button 
        className="button"
        onClick={createProposal} 
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Proposal (0.01 NEAR fee)'}
      </button>
    </div>
  );
}