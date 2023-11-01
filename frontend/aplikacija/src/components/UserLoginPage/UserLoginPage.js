import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Card, Form, Button, Col, Alert} from 'react-bootstrap';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { saveToken, saveUser, saveRole } from '../../api/api';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

export default class UserLoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imejl: undefined,
            lozinka: undefined,
            errorMessage: '',
            flag: 'korisnici',
            isLoggedInKorisnik: false,
            isLoggedInAdmin: false,
            isLoggedInProdavac: false
        }
    }

    formInputChanged(event) {
        const newState = Object.assign(this.state, {
            [ event.target.id ] : event.target.value
        });

        this.setState(newState);
    }

    setErrorMessage(message) {
        const newState = Object.assign(this.state, {
            errorMessage: message
        });

        this.setState(newState);
    }

    setLogginStateKorisnik(isLoggedIn) {
        const newState = Object.assign(this.state, {
            isLoggedInKorisnik: isLoggedIn,
        });

        this.setState(newState);
    }

    setLogginStateProdavac(isLoggedIn) {
        const newState = Object.assign(this.state, {
            isLoggedInProdavac: isLoggedIn,
        });

        this.setState(newState);
    }

    setLogginStateAdmin(isLoggedIn) {
        const newState = Object.assign(this.state, {
            isLoggedInAdmin: isLoggedIn,
        });

        this.setState(newState);
    }

    radioButtonChecked(event) {
        const newState = Object.assign(this.state, {
            flag : event.target.value
        })

        this.setState(newState);
    }


    doLogin(ruta) {
        let data;
        if(ruta === "admin") {
            data = {
                korisnickoIme: this.state.imejl,
                lozinka: this.state.lozinka,
            };
            if(!data.korisnickoIme) {
                this.setErrorMessage("Unesite korisničko ime!");
                return
            }
        } else {
            data = {
                imejl: this.state.imejl,
                lozinka: this.state.lozinka,
            };
            if(!data.imejl) {
                this.setErrorMessage("Unesite imejl!");
                return
            }
        }
        if(!data.lozinka) {
            this.setErrorMessage("Unesite lozinku!");
            return
        }
        api(
            `${ruta}/login`, 
            'post', 
            data
        )
        .then(res => {

            if (!res.data) {
                if(res.korisnik) {
                    saveUser("korisnik", res.korisnik);
                    saveToken("korisnik", res.accessToken);
                    saveRole("korisnik");
                    this.setLogginStateKorisnik(true);
                } else if(res.prodavac) {
                    saveUser("prodavac", res.prodavac);
                    saveToken("prodavac", res.accessToken);
                    saveRole("prodavac");
                    this.setLogginStateProdavac(true);
                    
                } else if (res.admin) {
                    saveUser("admin", res.admin);
                    saveToken("admin", res.accessToken);
                    saveRole("admin");
                    this.setLogginStateAdmin(true);
                }

                return;
            } 
            if(res.status === "error")
                this.setErrorMessage(res.data.response?.data.message);
        });
    }

    render() {
        if(this.state.isLoggedInKorisnik === true) {
            return (
                <Redirect to = "/korisnik" />
            );
        }

        if(this.state.isLoggedInProdavac === true) {
            return (
                <Redirect to = "/prodavac/dashboard" />
            );
        }

        if(this.state.isLoggedInAdmin === true) {
            return (
                <Redirect to = "/admin/dashboard" />
            );
        }

        return (
        <Container>
            <RoledMainMenu role="posetilac" />
            <Col md = { { span: 6, offset: 3 } }>
                <Card style={{ backgroundColor: '#e6fff2' }}>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon = { faSignInAlt }></FontAwesomeIcon> Logovanje korisnika
                        </Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Label htmlFor = "imejl"> Imejl/korisničko ime: </Form.Label>
                                <Form.Control type = "email" id = "imejl" className="form-control"
                                                value = { this.state.email } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor = "lozinka"> Lozinka: </Form.Label>
                                <Form.Control type = "password" id = "lozinka" 
                                                value = { this.state.password } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                            <Form.Group>
                                <Form.Check type="radio" label="Kupac" name="options" 
                                            value = "korisnici" 
                                            defaultChecked 
                                            onChange = { event => this.radioButtonChecked(event) }/>
                                <Form.Check type="radio" label="Prodavac" name="options" 
                                            value =  "prodavci" 
                                            onChange = { event => this.radioButtonChecked(event) }/>
                                <Form.Check type="radio" label="Admin" name="options" 
                                            value =  "admin" 
                                            onChange = { event => this.radioButtonChecked(event) }/>
                            </Form.Group>
                            <Form.Group>
                                <Button variant = "primary"
                                        onClick = { () => this.doLogin(this.state.flag) }>
                                    Uloguj se
                                </Button>
                            </Form.Group>
                        </Form>
                        <Alert variant = "danger"
                            className = { this.state.errorMessage ? '' : 'd-none' }>
                            { this.state.errorMessage }
                        </Alert>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
        );
    }

}