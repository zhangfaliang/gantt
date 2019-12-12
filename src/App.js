import React from 'react';

import Gantt from './components/Gantt';
import ReactGantt from './components/ReactGantt';

import './styles.css';

const App = () => {
  return (
    <div>
      <Gantt />
      <ReactGantt />
    </div>
  );
};

export default App;
