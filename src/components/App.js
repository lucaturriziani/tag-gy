import React, { Component } from 'react';
import { SidebarMenu } from './Sidebar/Sidebar';
import { ContainerPosTagging } from './Wrapper/ContainerPosTagging';
import PrimeReact from 'primereact/utils';

export class App extends Component {

  constructor(props) {
    super(props);

    PrimeReact.ripple = true;

    this.containerText = React.createRef();

    this.state = {
      total: 0,
      accepted: 0,
      rejected: 0,
      ignored: 0,
      count: 0,
      lastInput: []
    }
  }

  acceptSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ accepted: this.state.accepted + 1 });
    this.setState({ count: this.state.count + 1 }, ()=>{
      this.containerText.current.highlight();
    })
    this.state.lastInput.push('a');
  }

  rejectSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ rejected: this.state.rejected + 1 });
    this.setState({ count: this.state.count + 1 }, ()=>{
      this.containerText.current.highlight();
    })
    this.state.lastInput.push('r');
  }

  ignoreSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ ignored: this.state.ignored + 1 });
    this.setState({ count: this.state.count + 1 }, ()=>{
      this.containerText.current.highlight();
    })
    this.state.lastInput.push('i');
  }

  previousSentences = (decrement) => {
    switch (this.state.lastInput.pop()) {
      case 'a': {
        this.setState({ accepted: this.state.accepted - 1 });
        break;
      }
      case 'r': {
        this.setState({ rejected: this.state.rejected - 1 });
        break;
      }
      case 'i': {
        this.setState({ ignored: this.state.ignored - 1 });
        break;
      }
      default: break;
    }

    this.setState({ total: this.state.total - decrement });
    this.setState({ count: this.state.count - 1 }, ()=>{
      this.containerText.current.highlight();
    })
  }

  render() {
    return (
      <>
        <SidebarMenu total={this.state.total} accept={this.state.accepted}
          reject={this.state.rejected} ignore={this.state.ignored}></SidebarMenu>
        <div className="p-grid p-mt-6 p-mr-0 p-ml-0">
          <div className="p-col-10 p-offset-1 p-md-6 p-md-offset-3 ">
            <ContainerPosTagging ref={this.containerText} count={this.state.count} accept={this.acceptSentences} reject={this.rejectSentences} ignore={this.ignoreSentences} back={this.previousSentences}></ContainerPosTagging>
          </div>
        </div>
      </>
    );
  }
}


