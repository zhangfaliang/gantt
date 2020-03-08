import React from 'react';

import Gantt from './components/Gantt';
import ReactGantt from './components/ReactGantt';
import VirtualizedList from './components/VirtualizedList';
// import DynamicVirtualizedList from './components/DynamicVirtualizedList';

import './styles.css';

const App = () => {
  return (
    <div>
      <VirtualizedList />
    </div>
  );
};

export default App;
