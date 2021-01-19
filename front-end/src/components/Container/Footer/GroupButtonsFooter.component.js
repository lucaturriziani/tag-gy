import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import './GroupButtonsFooter.style.css';

export class GroupButtonsFooter extends Component {
    render() {
        return (
            <>
                <div className="tag-gy-footer p-grid">
                    <div className="p-col p-md-4 p-md-offset-4">
                        <Button className="p-button-success p-ripple p-ripple-green" icon="pi pi-check" onClick={this.props.accept} disabled={!this.props.disabled}><Ripple /></Button>
                        <Button className="p-button-warning p-ripple p-ripple-yellow" icon="pi pi-ban" onClick={this.props.ignore} disabled={!this.props.disabled}><Ripple /></Button>
                        <Button className="p-button-secondary" icon="pi pi-arrow-left" onClick={this.props.back} disabled={!this.props.disabled}/>
                    </div>
                </div>
            </>
        )
    }
}