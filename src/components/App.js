import React, { Component } from 'react';
import { SidebarMenu } from './Sidebar/Sidebar';
import { ContainerPosTagging } from './Wrapper/ContainerPosTagging';

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      accepted: 0,
      rejected: 0,
      ignored: 0,
      lastInput: []
    }
  }

  acceptSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ accepted: this.state.accepted + 1 });
    this.state.lastInput.push('a');
  }

  rejectSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ rejected: this.state.rejected + 1 });
    this.state.lastInput.push('r');
  }

  ignoreSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ ignored: this.state.ignored + 1 });
    this.state.lastInput.push('i');
  }

  previousSentences = (increment) => {
    switch (this.state.lastInput.pop()) {
      case 'a': {
        this.setState({ total: this.state.total - increment });
        this.setState({ accepted: this.state.accepted - 1 });
        break;
      }
      case 'r': {
        this.setState({ total: this.state.total - increment });
        this.setState({ rejected: this.state.rejected - 1 });
        break;
      }
      case 'i': {
        this.setState({ total: this.state.total - increment });
        this.setState({ ignored: this.state.ignored - 1 });
        break;
      }
      default: break;
    }
  }

  render() {
    return (
      <>
        <SidebarMenu total={this.state.total} accept={this.state.accepted}
          reject={this.state.rejected} ignore={this.state.ignored}></SidebarMenu>
        <div className="p-grid p-mt-6 p-mr-0 p-ml-0">
          <div className="p-col-10 p-offset-1 p-md-6 p-md-offset-3 ">
            <ContainerPosTagging accept={this.acceptSentences} reject={this.rejectSentences} ignore={this.ignoreSentences} back={this.previousSentences}></ContainerPosTagging>
          </div>
        </div>
      </>
    );
  }
}


