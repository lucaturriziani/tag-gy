import React, { useState } from 'react';
import { Content } from './Content';
import { SidebarMenu } from './Sidebar/Sidebar';

function App() {
  const [selections, setSelected] = useState([]);

  const onSelect = selection => {
    setSelected([selection, ...selections]);
  };

  return (
    <>
      <SidebarMenu></SidebarMenu>
      <div className="p-grid p-mt-6">
        <div className="p-col-10 p-offset-1 p-md-6 p-md-offset-3 ">
          <Content setSelected={onSelect} />
        </div>
      </div>
    </>
  );
}

export { App };
