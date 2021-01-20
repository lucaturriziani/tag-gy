import React, { Component } from 'react';
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Home } from './Home/Home.component';
import { Login } from './Login/Login.component';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom";

// GLOBAL 
window.$currentTag = []

export class App extends Component {

  static visualizeToast(type, summary, message) {
    window.$toast.show({ severity: type, summary: summary, detail: message, life: 3000 });
  }

  render() {
    return (
      <>
        <Toast className="t" ref={(el) => window.$toast = el} position="bottom-left" />
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}

function PrivateRoute({ children, ...rest }) {
  let auth = sessionStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={() =>
        auth ? (
          children
        ) : (
            <Redirect to="/login" />
          )
      }
    />
  );
}

function NoMatch() {

  return (
    <>
      <div className="p-grid p-mt-3 p-mt-md-6 p-mb-6 p-mr-0 p-ml-0">
        <div className="p-col-10 p-offset-1 p-md-8 p-lg-6 p-md-offset-2 p-lg-offset-3 ">
          <Card className="ui-card-shadow">
            <div className="p-grid">
              <div className="p-col-6 p-offset-3 p-d-flex p-jc-center">
                <i className="pi pi-exclamation-triangle" style={{ fontSize: "10rem" }}></i>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-6 p-offset-3 p-d-flex p-jc-center">
                <h2>404! Not found!</h2>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-6 p-offset-3 p-pb-4 p-d-flex p-jc-center">
                <Link className="maxWdt" to="/"><Button className="maxWdt" icon="pi pi-home" label="Go back home!"></Button></Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

