import React, { useState } from 'react';
import { Content } from './Content';
import { SelectedItem } from './SelectedItem';
import { SidebarMenu } from './Sidebar/Sidebar';

function App() {
  const [selections, setSelected] = useState([]);

  const onSelect = selection => {
    setSelected([selection, ...selections]);
  };

  return (
    <>
      <SidebarMenu></SidebarMenu>
      <div className="p-grid">
        <div className="p-col-6 p-offset-3">
          <Content setSelected={onSelect} />
        </div>
      </div>
    </>
  );
}

export { App };

//<SelectedItem selections={selections} /> per passare dati ad una funzione esterna
