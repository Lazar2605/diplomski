import React from "react";
import { Button, Card, Container, Modal, Table } from "react-bootstrap";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import api from "../../api/api";

export default class OrdersPageProdavac extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            orders: [],
            cartVisible: false,
            kupacVisible: false,
        }
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

    setKupacVisibleState(state) {
        const newState = Object.assign(this.state, {
            kupacVisible: state,
        });
    
        this.setState(newState);
    }

    setCartState(cart) {
        const newState = Object.assign(this.state, {
            cart: cart,
        });
    
        this.setState(newState);
    }

    setKupacState(kupac) {
        const newState = Object.assign(this.state, {
            kupac: kupac,
        });
    
        this.setState(newState);
    }

    setOrdersState(orders) {
        const newState = Object.assign(this.state, {
            orders: orders,
        });
    
        this.setState(newState);
    }

    hideCart() {
        this.setCartVisibleState(false);
    }

    
    showCart() {
        this.setCartVisibleState(true);
    }
    
    hideKupac() {
        this.setKupacVisibleState(false);
    }

    showKupac() {
        this.setKupacVisibleState(true);
    }

    componentDidMount() {
        this.getOrders();
    }

    componentDidUpdate() {
        this.getOrders();
    }

    getOrders() {
        api("rezervacije/prodavac", "get", {}, "prodavac")
        .then(res => {
            if(res.data?.response?.status === 401) {
                this.setLoggedInState(false);
                return;
            }

            const orders = res.map(order => ({
                orderId: order.id,
                ukupnaCena: order.ukupnaCena,
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
                kupac: {
                    ime: order.kupac.ime,
                    prezime: order.kupac.prezime,
                    imejl: order.kupac.imejl,
                    adresa: {
                        ulica: order.kupac.adresa.ulica,
                        grad: order.kupac.adresa.grad,
                        postanskiBroj: order.kupac.adresa.postanskiBroj,
                    },
                    brojTelefona: {
                        drzavniPozivniBroj: order.kupac.brojTelefona.drzavniPozivniBroj,
                        broj: order.kupac.brojTelefona.broj,
                    },
                },
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

    render() {
        if(this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/korisnik/login" />
            )
        }

        return (
        <Container>
            <RoledMainMenu role="prodavac" />
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
                                    <th>Kupac</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.orders.map(this.printOrderRow, this) }
                            </tbody>
                        </Table>
                </Card.Body>
            </Card>

            <Modal size="lg" centered show={ this.state.kupacVisible } onHide={ () => this.hideKupac(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Kupac
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
                                    <td>{ this.state.kupac?.ime + " " + this.state.kupac?.prezime }</td>
                                    <td>{ this.state.kupac?.imejl }</td>
                                    <td>{ this.state.kupac?.adresa.ulica +  " " +  this.state.kupac?.adresa.postanskiBroj + " " +  this.state.kupac?.adresa.grad }</td>
                                    <td>{ this.state.kupac?.brojTelefona.drzavniPozivniBroj +  this.state.kupac?.brojTelefona.broj }</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>

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
        </Container>
        );
    }

    setAndShowCart(cart) {
        this.setCartState(cart);
        this.showCart();
    }

    setAndShowKupac(kupac) {
        this.setKupacState(kupac);
        this.showKupac();
    }

    promeniStatus(id, status) {
        const data = {
            status: status
        }
        api("rezervacije/promeni-status/" + id, "post", data , "prodavac")
        .then(res => {
            if(res.data?.response?.status === 401) {
                this.setLoggedInState(false);
                return;
            }

        })
    }

    ukloniPorudzbinu(id) {
        api("rezervacije/" + id, "delete", {} , "prodavac")
        .then(res => {
            if(res.data?.response?.status === 401) {
                this.setLoggedInState(false);
                return;
            }
        })
    }

    printOrderRow(order) {
        return (
            <tr>
                <td>{ order.datum }</td>
                <td>{ order.status }{order.status !== "dostavljeno" && order.status !== "isporučeno" && (
                    <>
                       <Button variant="success" onClick={() => this.promeniStatus(order.orderId, "isporučeno")}>Pošalji</Button>
                      <Button variant="danger" onClick={() => this.ukloniPorudzbinu(order.orderId)}>Odbij</Button>
                    </>)}
                </td>
                <td  className="text-primary" style={{ cursor: 'pointer' }}  onClick={() => this.setAndShowKupac(order.kupac)}> { order.kupac.ime + " " + order.kupac.prezime }</td>
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