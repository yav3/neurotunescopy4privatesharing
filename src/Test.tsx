import { useState } from 'react';

export default function Test() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>React Test Component</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click me to test React
      </button>
      <p style={{ marginTop: '20px', color: 'green' }}>
        ✅ If you can see this and the button works, React is functioning properly!
      </p>
    </div>
  );
}