import React, { Component } from 'react';
import PrimeReact from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Home } from './Home/Home.component';
import { Login } from './Login/Login.component';

// GLOBAL 
window.$currentTag = []

export class App extends Component {

  constructor(props) {
    super(props);

    PrimeReact.ripple = true;
  }

  static visualizeToast(type, summary, message) {
    window.$toast.show({ severity: type, summary: summary, detail: message, life: 3000 });
  }

  render() {
    return (
      <>
        <Toast className="t" ref={(el) => window.$toast = el} position="bottom-left" />
        <Home></Home>
      </>
    );
  }
}


