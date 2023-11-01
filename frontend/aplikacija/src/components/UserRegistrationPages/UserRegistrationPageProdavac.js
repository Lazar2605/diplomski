import React from 'react';
import { Container, Col, Card, Form, Button, Alert, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import api from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

export class UserRegistrationPageProdavac extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                ime: undefined,
                prezime: undefined,
                pol: "muški",
                jmbg: undefined,
                imejl: undefined,
                lozinka: undefined,
                lozinka2x: undefined,
                ulica: undefined,
                grad: undefined,
                postanskiBroj: undefined,
                drzavniPozivniBroj: undefined,
                broj: undefined,
                nazivPoljoprivrednogGazdinstva: undefined,
                registarskiBrojPoljoprivrednogGazdinstva: undefined,
                cenaDostave: undefined,
            },
            message: '',
            isRegistrationComplete : false
        };
    }

    formInputChanged(event) {
        const newFormData = Object.assign(this.state.formData, {
            [ event.target.id ] : event.target.value
        });
        const newState = Object.assign(this.state, {
            formData: newFormData
            
        });

        this.setState(newState);
    }
    selectChanged(event) {
        const { name, value } = event.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }));
    }

    render() {
        return (
        <Container>
            <RoledMainMenu role="posetilac" />
            <Col md = { { span: 8, offset: 2 } }>
                <Card style={{ backgroundColor: '#e6fff2' }}>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon = { faUserPlus }></FontAwesomeIcon> Registracija prodavca
                        </Card.Title>
                        {
                            (this.state.isRegistrationComplete === false) ? 
                            this.renderForm() : 
                            this.renderRegistrationCompleteMessage()
                                
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Container>

        );
    }

    renderForm() {
        return (
            <>
                <Form>
                    <Row>
                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "ime"> Ime: </Form.Label>
                                <Form.Control type = "text" id = "ime"
                                                value = { this.state.formData.ime } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "prezime"> Prezime: </Form.Label>
                                <Form.Control type = "text" id = "prezime"
                                                value = { this.state.formData.prezime } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "imejl"> Imejl: </Form.Label>
                                <Form.Control type = "email" id = "imejl"
                                                value = { this.state.formData.imejl } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="pol">Pol: </Form.Label>
                                <Form.Select id="pol"
                                    name="pol" 
                                    value={this.state.formData.pol}
                                    onChange={event => this.selectChanged(event)}>
                                    <option value="muški">muški</option>
                                    <option value="ženski">ženski</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "lozinka"> Lozinka: </Form.Label>
                                <Form.Control type = "password" id = "lozinka" 
                                                value = { this.state.formData.lozinka } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>

                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "lozinka2x"> Ponovljena lozinka: </Form.Label>
                                <Form.Control type = "password" id = "lozinka2x" 
                                                value = { this.state.formData.lozinka2x } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "ulica"> Adresa: </Form.Label>
                                <Form.Control type = "text" id = "ulica"
                                                value = { this.state.formData.ulica } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>

                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "grad"> Grad: </Form.Label>
                                <Form.Control type = "text" id = "grad" 
                                                value = { this.state.formData.grad } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "postanskiBroj"> Poštanski broj: </Form.Label>
                                <Form.Control type = "number" id = "postanskiBroj"
                                                value = { this.state.formData.postanskiBroj } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>

                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "jmbg"> JMBG: </Form.Label>
                                <Form.Control type = "text" id = "jmbg"
                                                value = { this.state.formData.jmbg } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    
                    <Row>
                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "drzavniPozivniBroj"> Pozivni broj za državu: </Form.Label>
                                <Form.Control type = "string" id = "drzavniPozivniBroj"
                                                value = { this.state.formData.drzavniPozivniBroj } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>

                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "broj"> Broj: </Form.Label>
                                <Form.Control type = "text" id = "broj" 
                                                value = { this.state.formData.broj } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>



                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "nazivPoljoprivrednogGazdinstva"> Naziv poljoprivrednog gazdinstva: </Form.Label>
                                <Form.Control type = "text" id = "nazivPoljoprivrednogGazdinstva"
                                                value = { this.state.formData.nazivPoljoprivrednogGazdinstva } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>

                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "registarskiBrojPoljoprivrednogGazdinstva"> Registarski broj poljoprivrednog gazdinstva: </Form.Label>
                                <Form.Control type = "text" id = "registarskiBrojPoljoprivrednogGazdinstva"
                                                value = { this.state.formData.registarskiBrojPoljoprivrednogGazdinstva } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>

                        <Col md = "6">
                            <Form.Group>
                                <Form.Label htmlFor = "cenaDostave"> Cena dostave: </Form.Label>
                                <Form.Control type = "number" id = "cenaDostave"
                                                value = { this.state.formData.cenaDostave } 
                                                onChange =  { event => this.formInputChanged(event) } />
                            </Form.Group>
                        </Col>
                        
                    </Row>


                    
                   
                    <Form.Group>
                        <Button variant = "primary"
                                onClick = { () =>  this.doRegister()  }>
                            Registruj se
                        </Button>
                    </Form.Group>
                </Form>
                <Alert variant = "danger"
                    className = { this.state.message ? '' : 'd-none' }>
                    { this.state.message }
                </Alert>
            </>
        );
    }

    renderRegistrationCompleteMessage() {
        return (
                <Redirect to = "/korisnik/login"></Redirect>
        );
    }

    doRegister() {
        const data = {
            ime: this.state.formData.ime,
            prezime: this.state.formData.prezime,
            pol: this.state.formData.pol,
            jmbg: this.state.formData.jmbg,
            imejl: this.state.formData.imejl,
            lozinka: this.state.formData.lozinka,
            adresa: {
                ulica: this.state.formData.ulica,
                grad: this.state.formData.grad,
                postanskiBroj: this.state.formData.postanskiBroj,
                drzava: this.state.formData.drzava,
            },
            brojTelefona: {
                drzavniPozivniBroj: this.state.formData.drzavniPozivniBroj,
                broj: this.state.formData.broj
            },
            nazivPG: this.state.formData.nazivPoljoprivrednogGazdinstva,
            registatskiBrojPG: this.state.formData.registarskiBrojPoljoprivrednogGazdinstva,
            cenaDostave: this.state.formData.cenaDostave,
            brojRacuna: "123",
        };

        let path = 'prodavci' 
        api(
        path,
        'post', 
        data
        )
        .then(res => {
            if (!res.data) {
                this.registrationComplete();
                return
            }
            if(res.status === "error")
                this.handleErrors(res.data);

        })
    }

    setErrorMessage(message) {
        const newState = Object.assign(this.state, {
            message: message
        });

        this.setState(newState);
    }

    handleErrors(data) {
        let message = data.response?.data.message;
                    
        this.setErrorMessage(message);
    }

    registrationComplete() {
        const newState = Object.assign(this.state, {
            isRegistrationComplete: true
        });

        this.setState(newState);
    }
}