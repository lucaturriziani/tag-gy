import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import styled from 'styled-components';
import './Sidebar.css';
import { getCollsName } from '../../service/db.service';

const Line = styled.hr`
    height: 1%;
`;

export class SidebarMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            collectionz: []
        };
    }

    componentDidMount() {
        getCollsName().then(res => {
            console.log("response collections", res.data)
            this.setState({ collectionz: res.data });
        });
    }

    render() {
        return (
            <>
                <div className="layout-config">
                    <div className="layout-config-content-wrapper">
                        <Button className="layout-config-button p-link" onClick={() => this.setState({ visible: true })}>
                            <i className="pi pi-tag"></i>
                        </Button>
                    </div>
                </div>
                <Sidebar visible={this.state.visible} position="right" baseZIndex={1000000} onHide={() => this.setState({ visible: false })}>
                    <h1>tag-gy</h1>
                    <Line></Line>
                    <h4>COLLECTIONS</h4>
                    <Dropdown value={this.props.selectedCollz} options={this.state.collectionz} onChange={(e) => {this.props.onSelCollz(e)}} optionLabel="name" placeholder="Select a collections" style={{width:"100%"}}/>
                    <div className="p-field-checkbox p-mt-2">
                        <Checkbox inputId="binary" checked={this.props.checked} onChange={e => this.props.onChecked(e)} />
                        <label htmlFor="binary">{this.props.checked ? 'VARIABLE TAGS' : 'FIXED TAGS'}</label>
                    </div>
                    <h4>PROGRESS</h4>
                    <div className="p-mb-3"><ProgressBar value={this.props.total} showValue={false}></ProgressBar></div>
                    <div className="p-d-flex p-jc-between">
                        <div className="menu-option">ACCEPT</div>
                        <div>{this.props.accept}</div>
                    </div>
                    <div className="p-d-flex p-jc-between">
                        <div className="menu-option">IGNORE</div>
                        <div>{this.props.ignore}</div>
                    </div>
                </Sidebar>
            </>
        )
    }
}