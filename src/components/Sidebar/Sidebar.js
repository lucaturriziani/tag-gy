import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import './Sidebar.css';

const Line = styled.hr`
    height: 1%;
`;

export class SidebarMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false
        };
    }

    render() {
        return (
            <>
                <div className="layout-config">
                    <div className="layout-config-content-wrapper">
                        <Button className="layout-config-button p-link" onClick={() => this.setState({ visible: true })}>
                        <i className="pi pi-cog" />
                        </Button>
                    </div>
                </div>
                <Sidebar visible={this.state.visible} position="right" baseZIndex={1000000} onHide={() => this.setState({ visible: false })}>
                        <h1>tag-gy</h1>
                        <Line></Line>
                </Sidebar>
            </>
        )
    }
}