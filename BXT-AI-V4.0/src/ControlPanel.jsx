import React, { useState } from 'react';
import './styles.css';

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState('personality');
  const [agent, setAgent] = useState({
    name: '',
    purpose: '',
    traits: 'Professional, Knowledgeable, Friendly',
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    accessSecret: '',
    schedule: 'hourly'
  });
  const [message, setMessage] = useState('');

  const handleDeploy = async () => {
    if (!agent.name || !agent.purpose) {
      setMessage('❌ Name and Purpose are required');
      return;
    }
    
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
      });
      const data = await response.json();
      setMessage('✅ Agent deployed successfully!');
      console.log('Agent ID:', data.id);
    } catch (error) {
      setMessage('❌ Deployment failed: ' + error.message);
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1><span className="brand">BXT.ai</span> Agent Builder</h1>
        <div className="status">🚀 Ready to deploy</div>
      </header>

      <div className="tabs">
        <button className={activeTab === 'personality' ? 'active' : ''} 
                onClick={() => setActiveTab('personality')}>
          🤖 Personality
        </button>
        <button className={activeTab === 'api' ? 'active' : ''} 
                onClick={() => setActiveTab('api')}>
          🔑 API Keys
        </button>
        <button className={activeTab === 'schedule' ? 'active' : ''} 
                onClick={() => setActiveTab('schedule')}>
          ⏰ Schedule
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'personality' && (
          <div className="form-section">
            <div className="input-group">
              <label>Agent Name</label>
              <input type="text" 
                placeholder="e.g. TechBot 3000" 
                value={agent.name}
                onChange={e => setAgent({...agent, name: e.target.value})}
              />
            </div>
            
            <div className="input-group">
              <label>Primary Purpose</label>
              <textarea
                value={agent.purpose}
                onChange={e => setAgent({...agent, purpose: e.target.value})}
                placeholder="Example: 'Share AI news and engage with tech community'"
              />
            </div>

            <div className="input-group">
              <label>Personality Traits</label>
              <div className="traits-grid">
                {['Professional', 'Casual', 'Humorous', 'Analytical', 'Provocative', 'Supportive'].map(trait => (
                  <button key={trait}
                    className={agent.traits.includes(trait) ? 'selected' : ''}
                    onClick={() => setAgent({
                      ...agent,
                      traits: agent.traits.includes(trait) 
                        ? agent.traits.replace(trait, '') 
                        : `${agent.traits}, ${trait}`
                    })}>
                    {trait}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="form-section">
            <div className="input-group">
              <label>X API Credentials</label>
              <input type="password" 
                placeholder="API Key"
                value={agent.apiKey}
                onChange={e => setAgent({...agent, apiKey: e.target.value})}
              />
              <input type="password" 
                placeholder="API Secret"
                value={agent.apiSecret}
                onChange={e => setAgent({...agent, apiSecret: e.target.value})}
              />
              <input type="password" 
                placeholder="Access Token"
                value={agent.accessToken}
                onChange={e => setAgent({...agent, accessToken: e.target.value})}
              />
              <input type="password" 
                placeholder="Access Secret"
                value={agent.accessSecret}
                onChange={e => setAgent({...agent, accessSecret: e.target.value})}
              />
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="form-section">
            <div className="input-group">
              <label>Posting Frequency</label>
              <select value={agent.schedule} 
                      onChange={e => setAgent({...agent, schedule: e.target.value})}>
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="custom">Custom Schedule</option>
              </select>
              
              {agent.schedule === 'custom' && (
                <input type="text" 
                  placeholder="Cron expression (e.g. 0 */2 * * *)"
                  onChange={e => setAgent({...agent, schedule: e.target.value})}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="footer">
        <div className="message">{message}</div>
        <button className="deploy-button" onClick={handleDeploy}>
          🚀 Deploy Agent
        </button>
      </div>
    </div>
  );
}
