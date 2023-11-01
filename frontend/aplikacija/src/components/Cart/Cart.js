import React from "react";
import api, { getUser } from "../../api/api";
import { Alert, Button, Col, Form, Modal, Nav, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import SHA256 from "crypto-js/sha256";



export default class Cart extends React.Component {
    constructor(props) {
        super(props);

        const timestamp = Date.now().toString();
        const hash = SHA256(timestamp).toString();
        localStorage.setItem("hashKorpa", hash);

        this.state = {
            loggedUser: JSON.parse(localStorage.getItem("logged korisnik")),
            count: 0,
            hash: hash,
            visible: false,
            visible2: false,
            visible3: false,
            visible4: false,
            message: "",
            successMessage:"",
            disabled: false,
            cartMenuColor:"#000000",
            faUserVisible: (getUser("korisnik")) ? true : false ,
            formData: {
                ime: undefined,
                prezime: undefined,
                imejl: undefined,
                adresa: undefined,
                grad: undefined,
                postanskiBroj: undefined,
                drzavniPozivniBroj: undefined,
                brojTelefona: undefined,
            },
        }
    }
    setStateLoggedIn(loggedIn) {
        this.setState(Object.assign(this.state, { faUserVisible: loggedIn }))
    }

    componentDidMount() {
        this.updateCart();
        window.addEventListener("cart.update", () => this.updateCart());
    }

    componentWillUnmount() {
        window.removeEventListener("cart.update", () => this.updateCart());
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
        api("korpe/nelogovan/" + this.state.hash, "get", {})
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

        return sum;
    }

    sendCartUpdate(data) {
        api("korpe/izmeni/kvantitet/" + this.state.hash + "/nelogovan", "post", data)
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

    formInputChanged(event) {
        const newFormData = Object.assign(this.state.formData, {
            [ event.target.id ] : event.target.value
        });
        const newState = Object.assign(this.state, {
            formData: newFormData
            
        });

        this.setState(newState);
    }

    setFormDataToUndefined() {
        this.setState(Object.assign(this.state.formData, 
            {  ime: undefined,
                prezime: undefined,
                imejl: undefined,
                adresa: undefined,
                grad: undefined,
                postanskiBroj: undefined,
                drzavniPozivniBroj: undefined,
                brojTelefona: undefined }))
    }

    hideCart() {
        this.setErrorMessage("");
        this.setStateVisible3(false);
    }

    makeOrder() {
        const data = {
            kupac: {
                ime: this.state.formData?.ime,
                prezime: this.state.formData?.prezime,
                imejl: this.state.formData?.imejl,
                adresa: {
                    ulica: this.state.formData?.adresa,
                    grad: this.state.formData?.grad,
                    postanskiBroj: this.state.formData?.postanskiBroj,
                },
                brojTelefona: {
                    drzavniPozivniBroj: this.state.formData?.drzavniPozivniBroj,
                    broj: this.state.formData?.brojTelefona
                }
            },
            hash: this.state.hash,
            cena: this.calculateSum(),   
        }
        api("rezervacije/nelogovan", "post", data)
        .then(res => {
            if(res.data?.response.status === 401) {
                this.setLoggedInState(false);
                return;
            } else if (res.status === "error"){
                this.handleErrors(res.data);
                return;
            }
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

                                this.setFormDataToUndefined();
                                this.setStateVisible3(true); 
                                this.setSuccessMessage("");
  
                            }}>
                            Idi na kupovinu
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
                        <Button variant="primary" onClick={() => { this.setStateVisible2(false)
                                                                   this.removeFlag()}}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal size="lg" centered show={ this.state.visible3 } onHide={ () => this.hideCart()}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Lični podaci
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                    <Col md = "6">

                        <Form.Group>
                            <Form.Label htmlFor = "imejl"> Imejl: </Form.Label>
                            <Form.Control type = "email" id = "imejl"
                                          value = { this.state.formData.imejl } 
                                          onChange =  { event => this.formInputChanged(event) } />
                        </Form.Group>
                    </Col>
                    <Col md = "6">
                        <Form.Group>
                            <Form.Label htmlFor = "adresa"> Adresa: </Form.Label>
                            <Form.Control type = "text" id = "adresa"
                                          value = { this.state.formData.adresa } 
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
                            <Form.Label htmlFor = "drzavniPozivniBroj"> Pozivni broj za državu: </Form.Label>
                            <Form.Control type = "string" id = "drzavniPozivniBroj"
                                          value = { this.state.formData.drzavniPozivniBroj } 
                                          onChange =  { event => this.formInputChanged(event) } />
                        </Form.Group>
                    </Col>
 
                    <Col md = "6">
                        <Form.Group>
                            <Form.Label htmlFor = "brojTelefona"> Broj telefona: </Form.Label>
                            <Form.Control type = "text" id = "brojTelefona" 
                                          value = { this.state.formData.brojTelefona } 
                                          onChange =  { event => this.formInputChanged(event) } />
                        </Form.Group>
                    </Col>
                    <Form.Group>
                            <Form.Label htmlFor = "broj"> Pošiljka stiže u roku od 3 do 5 radnih dana nakon porudžbine. Cena dostave: { this.state.cart?.prodavac.cenaDostave } RSD </Form.Label>
                        </Form.Group>
                  
                </Row>
                </Form>
                <Alert variant = "danger"
                    className = { this.state.message ? '' : 'd-none' }>
                    { this.state.message }
                </Alert>

                <Alert variant = "success"
                    className = { this.state.successMessage ? '' : 'd-none' }>
                    { this.state.successMessage }
                </Alert>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={this.state.disabled} variant="primary" onClick={ () => this.makeOrder() }>
                            Poruči
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal size="lg" centered show={ this.state.visible4 } onHide={ () => this.setStateVisible4(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Obaveštenje
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Uspešno ste se odlogovali!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setStateVisible4(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

            
        );
    }
}

