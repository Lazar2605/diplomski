import React from "react";
import { Redirect } from "react-router-dom";
import { logOut } from "../../api/api";

export class ProdavacLogoutPage extends React.Component {
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
        logOut("prodavac");
        this.finished();
    }
    
}