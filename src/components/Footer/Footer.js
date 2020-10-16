import React, { Component } from 'react';
import { Button } from 'primereact/button';
import './Footer.css';

export class AcceptTag extends Component {
    render() {
        return (
            <>
                <div className="tag-gy-footer p-grid">
                    <div className="p-col p-md-4 p-md-offset-4">
                        <Button className="p-button-success" icon="pi pi-check" onClick={this.props.accept} />
                        <Button className="p-button-danger" icon="pi pi-times" onClick={this.props.reject} />
                        <Button className="p-button-warning" icon="pi pi-ban" onClick={this.props.ignore} />
                        <Button className="p-button-secondary" icon="pi pi-arrow-left" onClick={this.props.back} />
                    </div>
                </div>
            </>
        )
    }
}