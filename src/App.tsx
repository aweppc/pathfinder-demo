import React from 'react';
import './App.css';
import { AStarDemo } from './a-star-demo';
import { VectorFieldDemo } from './vector-field-demo';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <AStarDemo />
        <VectorFieldDemo />
      </div>
    </div>
  );
}

export default App;
