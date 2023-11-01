import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import React from 'react';
import api from "../../api/api"
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import SingleArticlePreviewKupac from '../SingleArticlePreview/SingleArticlePreviewKupac';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

class ProdavacProfilePageKupac extends React.Component {
  constructor(props) {
    super(props);
    this.id = window.location.href.split("/")[window.location.href.split("/").length - 1];
    this.state = {
      prodavac: undefined,
      articles: [],
      marks: [],
      marksVisible: false,
    } 
    
  }

  componentWillMount() {
    this.getProdavac();
    this.getArticles();
    this.getMarks();
  }

  getMarks() {
    api("ocene/" + this.id, "get", {}, "prodavac")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
        this.putMarksInState(res);
    })
  }

  putMarksInState(data) {
    const comments = data.map(comment => {
      return {
        id: comment._id,
        brojZvezdica: comment.brojZvezdica,
        komentar: comment.komentar,
        datumIVreme: comment.datumIVreme.split("T")[0] + " " + comment.datumIVreme.split("T")[1].split(":")[0] + ":" + comment.datumIVreme.split("T")[1].split(":")[1],
        rezervacija: {
            proizvodiKolicina: comment.rezervacija.proizvodiKolicina.map(pk => ({
                proizvodNaziv: pk.proizvod.naziv,
                proizvodId: pk.proizvodId,
                kvantitet: pk.kvantitet,
            })),
            kupac: {
                ime: comment.rezervacija.kupac.ime,
                prezime: comment.rezervacija.kupac.prezime,
            },
        },
    }
    })
    
    const newState = Object.assign(this.state, {
        marks: comments
    })

    this.setState(newState);
  }

  getArticles() {
    api("/proizvodi/prodavac/" + this.id, "get", {}, "prodavac")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
        this.putArticlesInState(res);
    })
  }

  putArticlesInState(data) {
    const articles = data.map(article => {
      return {
        proizvodId: article.id,
        naziv: article.naziv,
        opis: article.opis,
        cena: {
          kolicina: article.cena.kolicina,
          mera: article.cena.mera,
          iznos: article.cena.iznos,
        },
        slika: article.slikaKljuc,
        dostupan: article.dostupan,
        kategorija: {
            naziv: article.kategorija?.naziv,
        },
        prodavac: {
            adresa: {
                grad: this.state.prodavac.adresa.grad,
            }
        }
      }
    })
    
    const newState = Object.assign(this.state, {
        articles: articles
    })

    this.setState(newState);
  }

  getProdavac() {
    api("prodavci/" + this.id, "get", {}, "posetilac")
    .then((res) => {
        this.putProdavacInState(res);
    })
  }

  putProdavacInState(data) {
    const prodavac = {
        id: data._id,
        ime: data.ime,
        prezime: data.prezime,
        imejl: data.imejl,
        adresa: {
            ulica: data.adresa.ulica,
            grad: data.adresa.grad,
            postanskiBroj: data.adresa.postanskiBroj,
            drzava: data.adresa.drzava,
        },
        brojTelefona: {
            drzavniPozivniBroj: data.brojTelefona.drzavniPozivniBroj,
            broj: data.brojTelefona.broj,
        },
        nazivPG: data.nazivPG,
        registarskiBrojPG: data.registatskiBrojPG,
        prosecnaOcena: data.prosecnaOcena.toFixed(2),
    }

    const newState = Object.assign(this.state, {
        prodavac: prodavac
    })
  
    this.setState(newState);
  }
    

  setLoggedInState(isLoggedIn) {
    const newState = Object.assign(this.state, {
        isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }

  setMarksVisibleState(state) {
    const newState = Object.assign(this.state, {
        marksVisible: state,
    });

    this.setState(newState);
  }

  showComments() {
    this.setMarksVisibleState(true);
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
            <Card key={this.state.prodavac?.id} className="my-3">
                <Card.Body>
                    <Card.Title> 
                      Poljoprivredno gazdinstvo { this.state.prodavac?.nazivPG }
                      <Button style={{marginLeft: "20px"}} onClick={() => this.showComments()}> {this.state.marks.length}<FontAwesomeIcon icon = { faComment } >  </FontAwesomeIcon></Button>   
                    </Card.Title>
                    <Card.Text>Prodavac: {this.state.prodavac?.ime + " " + this.state.prodavac?.prezime}</Card.Text>
                    <Card.Text>
                      Prosečna ocena: {this.state.prodavac?.prosecnaOcena} 
                    </Card.Text> 
                    <Card.Text>Imejl: {this.state.prodavac?.imejl}</Card.Text>
                    <Card.Text>Adresa: { this.state.prodavac?.adresa.ulica + " " + this.state.prodavac?.adresa.postanskiBroj + " " + this.state.prodavac?.adresa.grad }</Card.Text>
                    <Card.Text>Broj telefona: { this.state.prodavac?.brojTelefona.drzavniPozivniBroj + this.state.prodavac?.brojTelefona.broj }</Card.Text>
                    <Card.Text>Registarski broj poljoprivrednog gazdinstva: { this.state.prodavac?.registarskiBrojPG } </Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Row>
                    <Col xs="12" md="4" lg="1">
                    </Col>
                    <Col xs="12" md="8" lg="10">
                        { this.showArticles() }
                    </Col>
                </Row>
            </Card>
            <Modal size="lg" centered show={ this.state.marksVisible } onHide={ () => this.setMarksVisibleState(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                  Ocene
              </Modal.Title>
          </Modal.Header>
            {this.state.marks.map(comment => (
                <Card key={comment.id} className="my-3">
                    <Card.Body>
                        <Card.Title>Ocena: {comment.brojZvezdica}</Card.Title>
                        <Card.Text>Komentar: {comment.komentar}</Card.Text>
                        <Card.Text>Datum i vreme: {comment.datumIVreme}</Card.Text>
                        <Card.Text>
                            Proizvodi: <br />
                            {comment.rezervacija.proizvodiKolicina.map((proizvod, index) => (
                                <span key={index} >
                                    Proizvod: { proizvod.proizvodNaziv }, Količina: {proizvod.kvantitet}
                                    {index !== comment.rezervacija.proizvodiKolicina.length - 1 && <br />}
                                </span>
                            ))}
                        </Card.Text>
                        <Card.Text>Kupac: {comment.rezervacija.kupac.ime} {comment.rezervacija.kupac.prezime}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
            </Modal>

            
      </Container>
    );
  }

  
    showArticles() {
        if (this.state.articles?.length === 0) {
            return (
                <div> Nema proizvoda </div>
            );
        }

        return (
            <Row>
                {this.state.articles?.map(this.singleArticle)}
            </Row>
        )
    }

    singleArticle(article) {
        return (
            <SingleArticlePreviewKupac article={article} otvoriProdavca="false"/>
        );
    }
}

export default ProdavacProfilePageKupac;
