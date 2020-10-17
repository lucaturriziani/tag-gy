import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import './Footer.css';

export class AcceptTag extends Component {
    render() {
        return (
            <>
                <div className="tag-gy-footer p-grid">
                    <div className="p-col p-md-4 p-md-offset-4">
                        <Button className="p-button-success p-ripple p-ripple-green" icon="pi pi-check" onClick={this.props.accept} ><Ripple /></Button>
                        <Button className="p-button-danger p-ripple p-ripple-red" icon="pi pi-times" onClick={this.props.reject} ><Ripple /></Button>
                        <Button className="p-button-warning p-ripple p-ripple-yellow" icon="pi pi-ban" onClick={this.props.ignore} ><Ripple /></Button>
                        <Button className="p-button-secondary" icon="pi pi-arrow-left" onClick={this.props.back} />
                    </div>
                </div>
            </>
        )
    }
}