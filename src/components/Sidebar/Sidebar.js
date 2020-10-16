import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import styled from 'styled-components';
import './Sidebar.css';

const Line = styled.hr`
    height: 1%;
`;

export class SidebarMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
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
                    <h4>PROGRESS</h4>
                    <div class="p-mb-3"><ProgressBar value={this.props.total}></ProgressBar></div>
                    <div className="p-d-flex p-jc-between">
                        <div className="menu-option">ACCEPT</div>
                        <div>{this.props.accept}</div>
                    </div>
                    <div className="p-d-flex p-jc-between">
                        <div className="menu-option">REJECT</div>
                        <div>{this.props.reject}</div>
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