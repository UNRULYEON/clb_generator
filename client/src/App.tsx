import React from 'react';

import CoverGrid from "./components/CoverGrid"

function App() {
  return (
    <div className="App">
      <h1>
        Certified lover boy
      </h1>
      <h2>Cover generator</h2>            
      <h3>
        Click on an emoji to edit or remove
      </h3>
      <CoverGrid />
    </div>
  );
}

export default App;
