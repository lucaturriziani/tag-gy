import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { ScrollTop } from 'primereact/scrolltop';
import { ScrollPanel } from 'primereact/scrollpanel';
import styled from 'styled-components';
import './Sidebar.css';
import { getTagCount, getTagAndCount } from '../../service/db.service';

const Line = styled.hr`
    height: 1%;
`;

export class SidebarMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            collectionz: [],
            user: null,
            firstLetter: null,
            tagCount: 0,
            tags: []
        };
    }

    componentDidMount() {
        this.setState({
            collectionz: [
                { name: "images", code: "images" },
                { name: "sentences", code: "sentences" }       
            ]
        });
        let auth = JSON.parse(sessionStorage.getItem("token"));
        this.setState({
            user: auth.username.toUpperCase(),
        }, () => this.setState({ firstLetter: this.state.user.substring(0, 1) }))
        this.getCountOfTag();
    }

    onShow = () => {
        this.getInfoUser();
        this.getCountOfTag();
    }

    getInfoUser = () => {
        getTagCount().then(res => {
            this.setState({ tagCount: res.data.tagCount })
        })
    }

    getCountOfTag = () => {
        let dbName = '';
        if (this.props.selectedCollz.name === 'images') dbName = '/img';
        getTagAndCount(dbName).then(res => {
            let tags = res.data;
            tags.sort(function (a, b) {
                return a.tag.localeCompare(b.tag)
            })
            this.setState({ tags: res.data })
        })
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
                <Sidebar visible={this.state.visible} position="right" baseZIndex={1000000} onShow={() => this.onShow()} onHide={() => this.setState({ visible: false })}>
                    <h1>tag-gy</h1>
                    <Line></Line>
                    <div className="card">
                        <div className="p-d-flex">
                            <Avatar label={this.state.firstLetter} className="p-mr-2" size="xlarge" />
                            <div className="p-d-flex p-flex-column" style={{ "width": "80%" }}>
                                <div className="username">{this.state.user}</div>
                                {/*<div className="p-d-flex p-jc-between" >
                                    INSERIRE QUA LA RIGA CON CLASSNAME USERNAME
                                    <a href="/login" onClick={() => this.logout}><i className="pi pi-sign-out" /></a>
                                </div>*/}
                                <div>TAG DONE: {this.state.tagCount}</div>
                            </div>
                        </div>
                    </div>
                    <h4>COLLECTIONS</h4>
                    <Dropdown value={this.props.selectedCollz} options={this.state.collectionz} onChange={(e) => { this.props.onSelCollz(e) }} optionLabel="name" placeholder="Select a collections" style={{ width: "100%" }} />
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
                    <h4>TAGS SAVED ON DB</h4>
                    <div>
                        <ScrollPanel style={{ height: '200px' }}>
                            {this.state.tags.length > 0 ? this.state.tags.map(item => {
                                return <div className="p-d-flex p-jc-between" key={item.tag}>
                                    <div className="menu-option">{item.tag}</div>
                                    <div className="p-mr-3">{item.count}</div>
                                </div>
                            }) : null}
                            <ScrollTop target="parent" threshold={40} className="custom-scrolltop" icon="pi pi-arrow-up" />
                        </ScrollPanel>
                    </div>

                </Sidebar>
            </>
        )
    }
}