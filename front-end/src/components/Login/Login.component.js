import { Card } from "primereact/card";
import { Component } from "react";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import './Login.style.css';
import { Redirect } from "react-router";
import { login } from '../../service/auth.service';
import { App } from "../App";

export class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            usr: '',
            pwd: '',
            token: null
        }
    }

    componentDidMount() { 
        this.setState({token: sessionStorage.getItem("token")});
    }

    handleSubmit(value) {
        login(this.state.usr, this.state.pwd).then(res => {
            console.log("Auth",res.data.token);
            const jwt = res.data.token;
            sessionStorage.setItem("token", jwt)
            this.setState({token: jwt});
        }).catch(err => {
            App.visualizeToast("error", "Error", err.toString());
        })
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
                <h1 className="p-col-6 p-offset-3">tag.gy&nbsp;<i className="pi pi-tag"></i></h1>
            </div>
        )

        return (
            <>
                { !this.state.token ?
                    <div className="p-grid p-mt-3 p-mt-md-6 p-mb-6 p-mr-0 p-ml-0">
                        <div className="p-col-10 p-offset-1 p-md-8 p-lg-6 p-md-offset-2 p-lg-offset-3 ">
                            <Card className="ui-card-shadow" header={logo}>
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <span className="p-input-icon-left maxWdt">
                                                <i className="pi pi-user"></i>
                                                <InputText className="maxWdt" value={this.state.usr} onChange={(e) => this.setUser(e.target.value)} placeholder="Username" />
                                            </span></div>
                                        <div className="p-col-6">
                                            <Password className="maxWdt" value={this.state.pwd} onChange={(e) => this.setPwd(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="p-col-6 p-md-offset-3 p-pb-6 p-pt-4">
                                        <Button className="maxWdt" label="LOGIN" icon="pi pi-sign-in" onClick={() => this.handleSubmit('prova')}/>
                                    </div>
                            </Card>
                        </div>
                    </div>
                    :
                    <Redirect to="/"/>
                }
            </>
        )
    }
}