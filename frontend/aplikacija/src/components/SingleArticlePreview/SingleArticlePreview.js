import React from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";


export default class SingleArticlePreview extends React.Component {
    constructor(props) {
        super(props);



        this.state = {
            quantity: 1,
            hash: localStorage.getItem("hashKorpa"),
            visible: false,
        }
    }

    quantityChanged(event) {
        this.setState({
            quantity: Number(event.target.value),
        });
    }

    setVisibleState(newState) {
        this.setState(Object.assign(this.state, { visible: newState }))
    }

    addToCart() {
        const data = {
            hash: this.state.hash,
            kvantitet: this.state.quantity,
        };
        api("korpe/proizvod/" + this.props.article.proizvodId + "/nelogovan", "post", data)
        .then(res => {
            if(res.status === "error") {
                return;
            }
            localStorage.setItem("flag", res.flag);
            localStorage.setItem("disabled", false);
            const event = new CustomEvent("cart.update");
            window.dispatchEvent(event);
        })
    }

    render() {
        return (
            <Col lg="4" md="6" sm="6" xs="12">
              <Card className="mb-3">
                  <Card.Header style={{ height: '240px', overflow: 'hidden', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img alt={ this.props.article.naziv }
                           src={ require("../../images/" + this.props.article.slika) }  className="w-100 h-auto"   style={{ maxHeight: '100%', width: 'auto' }} />
                  </Card.Header>
                <Card.Body  style={{ height: '240px'}}>
                  <Card.Title as="p">
                    <strong>
                      { this.props.article.naziv + "    " } 
                    </strong>
                    <Button onClick={() => this.setVisibleState(true)}><FontAwesomeIcon icon={faInfo} ></FontAwesomeIcon></Button>
                  </Card.Title>
    
                  <Card.Text>
                      cena: { this.props.article.cena.kolicina + this.props.article.cena.mera + " " + this.props.article.cena.iznos } RSD
                  </Card.Text>
                  <Card.Text>
                     lokacija: { this.props.article.prodavac.adresa.grad }
                  </Card.Text>
                  <Form.Group>
                      <Row>
                          <Col xs="7">
                              <Form.Control type="number" min="1" step="1" value={ this.state.quantity }
                                            onChange={ (e) => this.quantityChanged(e) }/>
                          </Col>
                          <Col xs="5">
                              <Button variant="secondary" block
                                      onClick={ () => this.addToCart() }> Kupi </Button>
                          </Col>
                      </Row>
                  </Form.Group>
                  {this.props.otvoriProdavca !== "false" && (
                  <Link to = {`/prodavac-profile/${ this.props.article.prodavac.id }`} className="btn btn-primary w-100 btn-sm"
                        style={{ position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)'}}>
                  Poljoprivredno gazdinstvo {this.props.article.prodavac.nazivPG}
                  </Link>
                  )}
                </Card.Body>
              </Card>
              <Modal size="lg" centered show={ this.state.visible } onHide={ () => this.setVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.article.naziv}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.article.opis}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setVisibleState(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Col>
          );
    }
}