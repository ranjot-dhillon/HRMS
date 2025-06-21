import React, { useState } from 'react';

const ReminderCard = () => {
  const [task, setTask] = useState('');
  const [reminders, setReminders] = useState([]);

  const handleAdd = () => {
    if (task.trim()) {
      setReminders([...reminders, task]);
      setTask('');
    }
  };

  return (
    <div className="card">
      <h4>Reminder 🔔</h4>
      <input
        type="text"
        placeholder="Add a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{ width: '100%', padding: '5px', marginTop: '10px' }}
      />
      <button onClick={handleAdd} style={{ marginTop: '10px', padding: '5px 10px', background: '#6A1B9A', color: 'white', border: 'none', borderRadius: '5px' }}>Add</button>
      <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
        {reminders.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderCard;
