import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRemove } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/api";

export default class SingleProdavacRequestPreview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
        }
    } 

 acceptProdavac(prodavacId) {
    api("/admin/prodavac/" + prodavacId + "/potvrdi", "post", {}, "admin")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
    })
 }

 declineProdavac(prodavacId){
    api("/admin/prodavac/" + prodavacId + "/odbij", "post", {}, "admin")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
    })
 }

  setLoggedInState(isLoggedIn) {
    const newState = Object.assign(this.state, {
        isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }

  setCategory(categoryId) {
    const newState = Object.assign(this.state, {
        categoryId: categoryId,
    });

    this.setState(newState);
  }
 
 render() {
        return (
            <Col lg="4" md="6" sm="6" xs="12">
            <Card className="mb-3">
                <Card.Body  style={{ height: '400px'}}>
                <Card.Title as="p">
                    <strong>
                    { this.props.prodavac.ime + " " + this.props.prodavac.prezime}
                    </strong>
                </Card.Title>
                <Card.Text>
                    Adresa: { this.props.prodavac.adresa.ulica + " " + this.props.prodavac.adresa.grad + " " + this.props.prodavac.adresa.postanskiBroj}
                </Card.Text>
                <Card.Text>
                    Broj telefona: { this.props.prodavac.brojTelefona.drzavniPozivniBroj + this.props.prodavac.brojTelefona.broj}
                </Card.Text>
                <Card.Text>
                    Naziv poljoprivrednog gazdinstva: { this.props.prodavac.nazivPG}
                </Card.Text>
                <Card.Text>
                    Registarski broj poljoprivrednog gazdinstva: { this.props.prodavac.registarskiBrojPG}
                </Card.Text>
                <Card.Text>
                    Cena dostave: { this.props.prodavac.cenaDostave} RSD
                </Card.Text>
                <Form.Group>
                    <Row>
                        <Col xs="6">
                            <Button className="btn btn-primary w-100 btn-sm" variant='success' size="sm" style={{ color: 'white'}}
                            onClick={ () => this.acceptProdavac(this.props.prodavac.id) }>
                            <FontAwesomeIcon icon={ faCheck }/> Prihvati
                            </Button>
                        </Col>
                        <Col xs="6">
                        <Button className="btn btn-primary w-100 btn-sm" variant='danger' size="sm" style={{ color: 'white'}}
                            onClick={ () => this.declineProdavac(this.props.prodavac.id) }>
                            <FontAwesomeIcon icon={ faRemove }/> Odbij
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
                </Card.Body>
            </Card>
            </Col>
          );
        }
    }