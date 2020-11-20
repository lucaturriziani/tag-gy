import './Header.css';
import React, { Component } from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { colorRandom } from '../../utils/color';

export class Header extends Component {

    constructor(props) {
        super(props);
        console.log(props)

        this.state = {
            displayModal: false,
            value: '',
            error1: false,
            error2: false
        }

        this.onClick = this.onClick.bind(this);
        this.onHide = this.onHide.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addTag = this.addTag.bind(this);
    }

    onClick(position) {
        let state = {
            displayModal: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }

    onHide() {
        this.setState({ displayModal: false });
    }

    onChange(value) {
        this.setState({ error2: false });
        this.setState({ value: value });
        if (value.includes(" ") || value.length > 8 || value === '') {
            this.setState({ error1: true })
            return;
        }
        this.setState({ error1: false })
    }

    addTag() {
        if (this.state.value.includes(" ") || this.state.value.length > 8 || this.state.value === '') {
            return;
        }
        const index = this.props.availTag.findIndex(t => { return t.name.toUpperCase() === this.state.value.toUpperCase() });
        if (index === -1) {
            this.props.availTag.push({ name: this.state.value.toUpperCase(), color: colorRandom(), count: 0 });
            this.setState({ value: '' });
            this.onHide();
            return;
        }

        this.setState({ error2: true });
    }

    renderFooter() {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.onHide()} className="p-button-text" />
                <Button label="Add" icon="pi pi-check" onClick={() => this.addTag()} autoFocus />
            </div>
        );
    }

    render() {

        return (
            <>
                <div className="p-grid">
                    {this.props.varTags ? <div className="p-col-fixed p-ml-sm-3 p-ml-xl-4 p-mt-2">
                        <div className="box add-button p-mt-3 p-mr-2 p-ml-2 p-pl-4 p-pr-4" onClick={() => this.onClick()}><i className="pi pi-plus" /></div>
                        <Dialog header="Tag module" visible={this.state.displayModal} maximizable modal style={{ width: '50vw' }} footer={this.renderFooter()} onHide={() => this.onHide()}>
                            <div className="p-field">
                                <span className="p-float-label p-mt-3">
                                    <InputText id="newTag" value={this.state.value} onChange={(e) => this.onChange(e.target.value)} />
                                    <label htmlFor="newTag">Tag name</label>
                                </span>
                                {this.state.error1 ? <small id="newTag-help" className="p-invalid p-d-block">The name must not contain space and it must have at most 8 characters. </small> : null}
                                {this.state.error2 ? <small id="newTag-help" className="p-invalid p-d-block">The name tag to add is alredy used.</small> : null}
                            </div>
                        </Dialog>
                    </div> : null}
                    <div className={this.props.varTags ? "p-col-7 p-sm-8 p-xl-9 p-mt-2" : "p-mt-3 p-ml-2 p-pl-3"}>
                        <ScrollPanel style={{ width: '100%', height: '100%' }} className="tag-bar">
                            <div className="p-d-flex p-mr-5">
                                {this.props.availTag ? this.props.availTag.map((tag, index) => {
                                    return <div className="box p-mt-3 p-ml-2 p-pl-3 p-pr-3" value={tag.name} key={index} id={'tag-' + tag.name} onClick={() => this.props.onTagSelected(tag)}>{tag.name}</div>
                                }) : null}
                                <div className="p-pl-4">&nbsp;</div>
                            </div>
                        </ScrollPanel>
                    </div>
                </div>
            </>
        );
    }
}