import { Card } from "primereact/card";
import { Component } from "react";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import './Login.style.css';

export class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            usr: '',
            pwd: ''
        }
    }

    componentDidMount() { }

    handleSubmit(event) {

    }

    setUser(value) {
        this.setState({ usr: value });
    }

    setPwd(value) {
        this.setState({ pwd: value });
    }

    render() {

        const logo = (
            <div className="p-grid p-text-center p-pt-4">
                <h1 className="p-col-6 p-offset-3">tag.gy&nbsp;<i class="pi pi-tag"></i></h1>
            </div>
        )

        return (
            <>
                <div className="p-grid p-mt-3 p-mt-md-6 p-mb-6 p-mr-0 p-ml-0">
                    <div className="p-col-10 p-offset-1 p-md-8 p-lg-6 p-md-offset-2 p-lg-offset-3 ">
                        <Card className="ui-card-shadow" header={logo}>
                            <form onSubmit={this.handleSubmit}>
                                <div className="p-grid">
                                    <div className="p-col-6">
                                        <span className="p-input-icon-left maxWdt">
                                            <i class="pi pi-user"></i>
                                            <InputText className="maxWdt" value={this.state.usr} onChange={(e) => this.setUser(e.target.value)} placeholder="Username" />
                                        </span></div>
                                    <div className="p-col-6">
                                        <Password className="maxWdt" value={this.state.pwd} onChange={(e) => this.setPwd(e.target.value)} />
                                    </div>
                                </div>
                                <div className="p-col-6 p-md-offset-3 p-pb-6 p-pt-4">
                                    <Button className="maxWdt" label="LOGIN" icon="pi pi-sign-in" type="submit" />
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </>
        )
    }
}