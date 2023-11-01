import React from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import api from "../../api/api";

export default class OrdersPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            orders: [],
            cartVisible: false,
            prodavacVisible: false,
            oceniVisible: false,
            rating: undefined,
            comment: "",
            orderId: undefined,
        }
    }

    setOrderIdState(orderId) {
        const newState = Object.assign(this.state, {
            orderId: orderId,
        });
    
        this.setState(newState);
    }

    setRatingState(rating) {
        const newState = Object.assign(this.state, {
            rating: rating,
        });
    
        this.setState(newState);
    }

    setCommentState(comment) {
        const newState = Object.assign(this.state, {
            comment: comment,
        });
    
        this.setState(newState);
    }

    setLoggedInState(isLoggedIn) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });
    
        this.setState(newState);
    }

    setCartVisibleState(state) {
        const newState = Object.assign(this.state, {
            cartVisible: state,
        });
    
        this.setState(newState);
    }

    setProdavacVisibleState(state) {
        const newState = Object.assign(this.state, {
            prodavacVisible: state,
        });
    
        this.setState(newState);
    }

    
    setOceniVisibleState(state) {
        const newState = Object.assign(this.state, {
            oceniVisible: state,
        });
    
        this.setState(newState);
    }


    setCartState(cart) {
        const newState = Object.assign(this.state, {
            cart: cart,
        });
    
        this.setState(newState);
    }

    setProdavacState(prodavac) {
        const newState = Object.assign(this.state, {
            prodavac: prodavac,
        });
    
        this.setState(newState);
    }

    setOrdersState(orders) {
        const newState = Object.assign(this.state, {
            orders: orders,
        });
    
        this.setState(newState);
    }

    hideProdavac() {
        this.setProdavacVisibleState(false);
    }

    showProdavac() {
        this.setProdavacVisibleState(true);
    }

    showOceni(orderId) {
        this.setCommentState("");
        this.setOrderIdState(orderId);
        this.setRatingState(undefined);
        this.setOceniVisibleState(true);
    }

    hideOceni() {
        this.setOceniVisibleState(false);
    }

    hideCart() {
        this.setCartVisibleState(false);
    }

    showCart() {
        this.setCartVisibleState(true);
    }

    componentDidMount() {
        this.getOrders();
    }

    componentDidUpdate() {
        this.getOrders();
    }

    getOrders() {
        api("rezervacije", "get", {}, "korisnik")
        .then(res => {
            if(res.data?.response?.status === 401) {
                this.setLoggedInState(false);
                return;
            }

            const orders = res.map(order => ({
                orderId: order.id,
                ukupnaCena: order.ukupnaCena,
                prodavac: {
                    prodavacId: order.prodavac.id,
                    ime: order.prodavac.ime,
                    prezime: order.prodavac.prezime,
                    imejl: order.prodavac.imejl,
                    adresa: {
                        ulica: order.prodavac.adresa.ulica,
                        grad: order.prodavac.adresa.grad,
                        postanskiBroj: order.prodavac.adresa.postanskiBroj,
                    },
                    brojTelefona: {
                        drzavniPozivniBroj: order.prodavac.brojTelefona.drzavniPozivniBroj,
                        broj: order.prodavac.brojTelefona.broj,
                    },
                },
                datum: order.datum.split("T")[0] + " " + order.datum.split("T")[1].split(":")[0] + ":" + order.datum.split("T")[1].split(":")[1],
                proizvodi: order.proizvodi.map(pr => ({
                    proizvodId: pr.id,
                    naziv: pr.naziv,
                    cena: {
                        kolicina: pr.cena.kolicina,
                        mera: pr.cena.mera,
                        iznos: pr.cena.iznos,
                    },
                })),
                proizvodiKolicina: order.proizvodiKolicina.map(pk => ({
                    kvantitet: pk.kvantitet,
                })),
                status: order.status,
            }))

            this.setOrdersState(orders);
        })
    }

    calculateSum() {
        let sum = 0;
        if(!this.state.cart) {
            return sum;
        }   

        for (let i = 0; i < this.state.cart?.proizvodi.length; i++ ) {
            sum +=  this.state.cart?.proizvodiKolicina[i].kvantitet * this.state.cart?.proizvodi[i].cena.iznos;
        }
        localStorage.setItem("sum", sum);
        return sum;
    }

    promeniStatus(id, status) {
        const data = {
            status: status
        }
        api("rezervacije/promeni-status-korisnik/" + id, "post", data , "korisnik")
        .then(res => {
            if(res.data?.response?.status === 401) {
                this.setLoggedInState(false);
                return;
            }
        })
    }

    handleSubmit() {
        const data = {
            komentar: this.state.comment,
            brojZvezdica: this.state.rating,
            rezervacijaId: this.state.orderId,
            datumIVreme: new Date(),
        }
        api("ocene", "post", data, "korisnik")
        .then(res => {
            if(res.data?.response.status === 401) {
                this.setLoggedInState(false);
                return;
            }

            this.hideOceni();
            this.promeniStatus(this.state.orderId, "dostavljeno");


        })
    }

    render() {
        if(this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/korisnik/login" />
            )
        }

        return (
        <Container>
            <RoledMainMenu role="korisnik" />
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon = { faBox }></FontAwesomeIcon>  Moje porudžbine 
                    </Card.Title>
                    <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Datum</th>
                                    <th>Status</th>
                                    <th>Prodavac</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.orders.map(this.printOrderRow, this) }
                            </tbody>
                        </Table>
                </Card.Body>
            </Card>

            <Modal size="lg" centered show={ this.state.cartVisible } onHide={ () => this.hideCart(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Tvoja porudžbina
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Proizvod</th>
                                    <th className="text-right">Količina</th>
                                    <th className="text-right">Neto</th>
                                    <th className="text-right">Cena</th>
                                    <th className="text-right">Ukupno</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.cart?.proizvodi.map((proizvod, index) => {
                                    const total = Number(this.state.cart?.proizvodiKolicina[index].kvantitet * proizvod.cena.iznos).toFixed(2);
                                    return (
                                        <tr>
                                            <td>{ proizvod.naziv }</td>
                                            <td className="text-right">{ this.state.cart?.proizvodiKolicina[index].kvantitet }</td>
                                            <td className="text-right">{ proizvod.cena.kolicina + proizvod.cena.mera }</td>
                                            <td className="text-right">{ Number(proizvod.cena.iznos).toFixed(2) } RSD </td>
                                            <td className="text-right">{ Number(this.state.cart?.proizvodiKolicina[index].kvantitet *  proizvod.cena.kolicina) + proizvod.cena.mera + " - " + total } RSD</td>

                                        </tr>
                                    )
                                }, this)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="text-right">
                                        <strong>
                                            Ukupno:
                                        </strong>
                                    </td>
                                    <td className="text-right">{ Number(this.calculateSum()).toFixed(2) } RSD</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Modal.Body>
                </Modal>
                <Modal size="lg" centered show={ this.state.prodavacVisible } onHide={ () => this.hideProdavac(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Prodavac
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Ime i prezime</th>
                                    <th>Imejl</th>
                                    <th>Adresa</th>
                                    <th>Broj telefona</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{ this.state.prodavac?.ime + " " + this.state.prodavac?.prezime }</td>
                                    <td>{ this.state.prodavac?.imejl }</td>
                                    <td>{ this.state.prodavac?.adresa.ulica +  " " +  this.state.prodavac?.adresa.postanskiBroj + " " +  this.state.prodavac?.adresa.grad }</td>
                                    <td>{ this.state.prodavac?.brojTelefona.drzavniPozivniBroj +  this.state.prodavac?.brojTelefona.broj }</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.oceniVisible } onHide={ () => this.hideOceni(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Oceni
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.oceniVisible} onHide={() => this.hideOceni(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Oceni</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                            Ocena:
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control
                                type="number"
                                min="1"
                                max="5"
                                value={this.state.rating}
                                onChange={(e) => this.handleRatingChange(e.target.value)}
                            />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                            Komentar:
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={this.state.comment}
                                onChange={(e) => this.handleCommentChange(e)}
                            />
                            </Col>
                        </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.hideOceni(false)}>
                        Otkaži
                        </Button>
                        <Button variant="primary" onClick={ () => this.handleSubmit()}>
                        Sačuvaj
                        </Button>
                    </Modal.Footer>
                    </Modal>
                        </Container>
                        );
                    }

    handleRatingChange(newRating) {
        this.setRatingState(newRating);
    }

    handleCommentChange(e) {
        this.setCommentState(e.target.value);
    }

    setAndShowCart(cart) {
        this.setCartState(cart);
        this.showCart();
    }

    setAndShowProdavac(prodavac) {
        this.setProdavacState(prodavac);
        this.showProdavac();
    }

    printOrderRow(order) {
        return (
            <tr>
                <td>{ order.datum }</td>
                <td>{order.status}{order.status !== "dostavljeno" && order.status !== "obradjuje se" && (
                    <Button onClick={() => this.showOceni(order.orderId)}>Oceni</Button>)}</td>
                <td  className="text-primary" style={{ cursor: 'pointer' }}  onClick={() => this.setAndShowProdavac(order.prodavac)}> { order.prodavac.ime + " " + order.prodavac.prezime }</td>
                <td className="text-right" >
                    <Button style={{ width:"150px" }} size="sm" block variant="primary" 
                            onClick={() => this.setAndShowCart(order)}>
                        <FontAwesomeIcon icon={ faBoxOpen } />
                            </Button>
                </td>
            </tr>
        )
    }

}