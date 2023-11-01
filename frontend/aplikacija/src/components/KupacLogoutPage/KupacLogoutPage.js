import React from "react";
import { Redirect } from "react-router-dom";
import { logOut } from "../../api/api";

export class KupacLogoutPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            done: false,
        }
    }

    finished() {
        this.setState({
            done: true,
        })
    }

    render() {
        if(this.state.done) {
            return <Redirect to="/korisnik/login" />
        }

        return (
            <p> Odjavljivanje ... </p>
        )
    }

    componentDidMount() {
        this.doLogout();
    }

    componentDidUpdate() {
        this.doLogout();
    }

    doLogout() {
        logOut("korisnik");
        this.finished();
    }
    
}