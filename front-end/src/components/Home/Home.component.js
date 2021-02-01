import React, { Component } from 'react';
import { SidebarMenu } from '../Sidebar/Sidebar';
import { ContainerPosTagging } from '../Container/ContainerPosTagging.component';
import { CanvasFabric } from '../Container/CanvasFabric.component';

export class Home extends Component {

  constructor(props) {
    super(props);

    this.containerText = React.createRef();
    this.containerImg = React.createRef();
    this.sideBarMenu = React.createRef();

    this.state = {
      total: 0,
      accepted: 0,
      ignored: 0,
      count: 0,
      lastInput: [],
      variableTags: true,
      selectedCollz: { name: "images", code: "images" }
    }
  }

  acceptSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ accepted: this.state.accepted + 1 });
    this.setState({ count: this.state.count + 1 }, () => {
      if (this.state.selectedCollz.name === "sentences")
        this.containerText.current.highlight();
      if (this.state.selectedCollz.name === "images")
        this.containerImg.current.nextImages();
    })
    this.state.lastInput.push('a');
  }

  ignoreSentences = (increment) => {
    this.setState({ total: this.state.total + increment });
    this.setState({ ignored: this.state.ignored + 1 });
    this.setState({ count: this.state.count + 1 }, () => {
      if (this.state.selectedCollz.name === "sentences")
        this.containerText.current.highlight();
      if (this.state.selectedCollz.name === "images")
        this.containerImg.current.nextImages();
    })
    this.state.lastInput.push('i');
  }

  previousSentences = (decrement) => {
    switch (this.state.lastInput.pop()) {
      case 'a': {
        this.setState({ accepted: this.state.accepted - 1 });
        break;
      }
      case 'i': {
        this.setState({ ignored: this.state.ignored - 1 });
        break;
      }
      default: break;
    }
    this.setState({ total: this.state.total - decrement });
    this.setState({ count: this.state.count - 1 }, () => {
      if (this.state.selectedCollz.name === "sentences")
        this.containerText.current.highlight();
      if (this.state.selectedCollz.name === "images") {
        this.containerImg.current.previous();
      }
    })
  }

  onChangeVariableTags = (e) => {
    this.setState({ variableTags: e.checked });
  }

  onSelCollz = (e) => {
    this.setState({ selectedCollz: e.value }, () => this.sideBarMenu.current.getCountOfTag());
    this.setState({ count: 0 });
  }

  render() {
    return (
      <>
        <SidebarMenu ref={this.sideBarMenu} total={this.state.total} accept={this.state.accepted} ignore={this.state.ignored}
          checked={this.state.variableTags} onChecked={this.onChangeVariableTags}
          selectedCollz={this.state.selectedCollz} onSelCollz={this.onSelCollz}></SidebarMenu>
        <div className="p-grid p-mt-3 p-mt-md-6 p-mb-6 p-mr-0 p-ml-0">
          <div className="p-col-10 p-offset-1 p-md-8 p-lg-6 p-md-offset-2 p-lg-offset-3 ">
            {this.state.selectedCollz.name === "sentences" ?
              <ContainerPosTagging ref={this.containerText}
                count={this.state.count} accept={this.acceptSentences} ignore={this.ignoreSentences} back={this.previousSentences}
                varTags={this.state.variableTags}></ContainerPosTagging>
              : <CanvasFabric ref={this.containerImg}
                count={this.state.count} accept={this.acceptSentences} ignore={this.ignoreSentences} back={this.previousSentences}
                varTags={this.state.variableTags}></CanvasFabric>
            }
          </div>
        </div>
      </>
    );
  }
}
