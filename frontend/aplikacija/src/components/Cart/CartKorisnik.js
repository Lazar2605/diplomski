import React from "react";
import api from "../../api/api";
import {  Button, Form, Modal, Nav, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faMinusSquare } from "@fortawesome/free-solid-svg-icons";



export default class CartKorisnik extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedUser: JSON.parse(localStorage.getItem("logged korisnik")),
            count: 0,
            visible: false,
            visible2: false,
            visible3: false,
            visible4: false,
            message: "",
            successMessage:"",
            disabled: false,
            cartMenuColor:"#000000",
        }
    }
    setStateLoggedIn(loggedIn) {
        this.setState(Object.assign(this.state, { faUserVisible: loggedIn }))
    }

    componentDidMount() {
        this.updateCart();
        window.addEventListener("cart.update.korisnik", () => this.updateCart());
    }

    componentWillUnmount() {
        window.removeEventListener("cart.update.korisnik", () => this.updateCart());
    }

    setStateCount(newCount) {
        this.setState(Object.assign(this.state, { count: newCount }));
    }

    setStateCart(newCart) {
        this.setState(Object.assign(this.state, { cart: newCart }))
    }

    setStateVisible(newState) {
        this.setState(Object.assign(this.state, { visible: newState }))
    }
    
    setStateVisible2(newState) {
        this.setState(Object.assign(this.state, { visible2: newState }))
    }

    setStateVisible3(newState) {
        this.setState(Object.assign(this.state, { visible3: newState }))
    }

    setStateVisible4(newState) {
        this.setState(Object.assign(this.state, { visible4: newState }))
    }

    setDisabled(newDisabled) {
        this.setState(Object.assign(this.state, { disabled: newDisabled }))
    }

    setStateMenuColor(newColor) {
        this.setState(Object.assign(this.state, { cartMenuColor: newColor }))
    }

   updateCart() {
        api("korpe/logovan/", "get", {}, "korisnik")
        .then(res => {
            if(res.status === "error") {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            } 
            const flag = localStorage.getItem("flag");
            if (flag && Number(flag) === 1) {
                this.setStateVisible2(true);
            }
            this.setStateCart(res);
            this.setStateCount(res.proizvodiKolicina.length);

            this.setStateMenuColor("#808000");
            setTimeout(() => this.setStateMenuColor("#000000"), 1000);

        })
    }

    removeFlag() {
        localStorage.removeItem("flag");
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

    sendCartUpdate(data) {
        api("korpe/izmeni/kvantitet/logovan", "post", data, "korisnik")
        .then(res => {
            if(res.status === "error") {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }
            this.setStateCart(res);
            this.setStateCount(res.proizvodiKolicina.length);
        });
    }

    updateQuantity(event) {
        const articleId = event.target.dataset.articleId;
        const newQuantity = event.target.value;

        const data = {
            proizvodId: articleId,
            kvantitet: Number(newQuantity),
        };

        this.sendCartUpdate(data);
    }

    removeFromCart(articleId) {
        const data = {
            proizvodId: articleId,
            kvantitet: 0,
        };

        this.sendCartUpdate(data);
    }

    setErrorMessage(message) {
        const newState = Object.assign(this.state, {
            message: message
        });

        this.setState(newState);
    }

    setSuccessMessage(message) {
        const newState = Object.assign(this.state, {
            successMessage: message
        });

        this.setState(newState);
    }

    handleErrors(data) {
        let message = data.response?.data.message;
                    
        this.setErrorMessage(message);
    }

    hideCart() {
        this.setErrorMessage("");
        this.setStateVisible3(false);
    }

    makeOrder() {
        api("rezervacije/logovan", "post", {}, "korisnik")
        .then(res => {
            if(res.data?.response.status === 401) {
                this.setLoggedInState(false);
                return;
            } else if (res.status === "error"){
                this.handleErrors(res.data);
                return;
            }
            this.setSuccessMessage("Uspešna porudžbina. Hvala na kupovini!");

            this.setStateVisible(false);
            this.setDisabled(true);
                       
        })
    }

    makeOrderUser() {
        api("rezervacije/logovan", "post", {}, "korisnik")
        .then(res => {
            if(res.data?.response?.status === 401) {
                this.setLoggedInState(false);
                return;
            } else if (res.status === "error"){
                this.handleErrors(res.data);
                return;
            }
            alert("Uspešna porudžbina! Sačekajte da prodavac prihvati.");
            this.setSuccessMessage("Uspešna porudžbina. Hvala na kupovini!");

            this.setStateCount(0);
            this.setStateCart(undefined);
            this.setStateVisible(false);
            this.setDisabled(true);
                       
        })
    }

    render() {
        return (
            <>
                <Nav.Item >
                    <Nav.Link active= { false } onClick={ () => this.setStateVisible(true)}
                    style= {{ color: this.state.cartMenuColor}} >
                        <FontAwesomeIcon icon={ faCartArrowDown } /> ({ this.state.count })
                    </Nav.Link>
                </Nav.Item>
                <Modal size="lg" centered show={ this.state.visible } onHide={ () => this.setStateVisible(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Vaša korpa
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
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.cart?.proizvodi.map((proizvod, index) => {
                                    const total = Number(this.state.cart?.proizvodiKolicina[index].kvantitet * proizvod.cena.iznos).toFixed(2);
                                    return (
                                        <tr>
                                            <td>{ proizvod.naziv }</td>
                                            <td className="text-right">
                                                <Form.Control type = "number" step="1" min="1"
                                                              value={ this.state.cart?.proizvodiKolicina[index].kvantitet }
                                                              data-article-id={ proizvod._id }
                                                              onChange={ (e) => this.updateQuantity(e)}/>
                                            </td>
                                            <td className="text-right">{ proizvod.cena.kolicina + proizvod.cena.mera }</td>
                                            <td className="text-right">{ Number(proizvod.cena.iznos).toFixed(2) } RSD </td>
                                            <td className="text-right">{ Number(this.state.cart?.proizvodiKolicina[index].kvantitet *  proizvod.cena.kolicina) + proizvod.cena.mera + " - " + total } RSD</td>
                                            <td>
                                                <FontAwesomeIcon icon={ faMinusSquare }
                                                onClick={ () => this.removeFromCart(proizvod._id) } />
                                            </td>
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
                                    <td></td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <>
                                
                        </>
                        <Button disabled={ (this.state.cart !== undefined) && (this.state.cart.proizvodiKolicina.length > 0) ? false : true } variant="primary" 
                        onClick={() => {
                                this.makeOrderUser();
                                this.setSuccessMessage("");
                            }}>
                            Kupi
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal size="lg" centered show={ this.state.visible2 } onHide={ () => { this.setStateVisible2(false);
                                                                                        this.removeFlag()}}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Obaveštenje
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Korpa će se resetovati jer ste dodali proizvod drugog prodavca!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { this.setStateVisible2(false);
                                                                   this.removeFlag()}}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                
            </>

            
        );
    }
}

