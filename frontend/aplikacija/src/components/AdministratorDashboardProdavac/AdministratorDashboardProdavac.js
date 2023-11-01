import { Container, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import api from "../../api/api"
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import SingleProdavacRequestPreview from '../SingleProdavacRequestReview/SingleProdavacRequestReview';

class AdministratorDashboardArticle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      prodavci: [],
    } 
    
  }

  componentWillMount() {
    this.getProdavacRequests();
  }

  componentDidUpdate() {
    this.getProdavacRequests();
  }


  getProdavacRequests() {
    api("/prodavci/zahtevi", "get", {}, "admin")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
        this.putProdavciInState(res);
    })
  }

  putProdavciInState(data) {
    const prodavci = data.map(prodavac => {
      return {
        id: prodavac.id,
        ime: prodavac.ime,
        prezime: prodavac.prezime,
        adresa: {
          ulica: prodavac.adresa.ulica,
          grad: prodavac.adresa.grad,
          postanskiBroj: prodavac.adresa.postanskiBroj,
        },
        brojTelefona: {
          drzavniPozivniBroj: prodavac.brojTelefona.drzavniPozivniBroj,
          broj: prodavac.brojTelefona.broj,
        },
        pol: prodavac.pol,
        jmbg: prodavac.jmbg,
        nazivPG: prodavac.nazivPG,
        registarskiBrojPG: prodavac.registatskiBrojPG,
        brojRacuna: prodavac.brojRacuna,
        cenaDostave: prodavac.cenaDostave,
        prosecnaOcena: prodavac.prosecnaOcena,
      }
    })

    const newState = Object.assign(this.state, {
      prodavci: prodavci
    })

    this.setState(newState);
  }

  setLoggedInState(isLoggedIn) {
    const newState = Object.assign(this.state, {
        isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }


  render() {
    if(this.state.isUserLoggedIn === false) {
        return (
            <Redirect to="/korisnik/login" />
        )
    }
      return (
          <Container>
              <RoledMainMenu role="admin" />
          <Card>
              <Card.Body>
                  <Card.Title>
                      <FontAwesomeIcon icon = { faListAlt }></FontAwesomeIcon> Zahtevi za nove prodavce
                  </Card.Title>

                  <Row>
                      <Col xs="12" md="8" lg="9">
                          { this.showProdavci() }
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
      </Container>
      );
  }
  showProdavci() {
    if (this.state.prodavci?.length === 0) {
        return (
            <div> Nema zahteva za prodavce </div>
        );
    }

    return (
        <Row>
            {this.state.prodavci?.map(this.singleProdavac)}
        </Row>
    )
}

singleProdavac(prodavac) {
    return (
      <SingleProdavacRequestPreview prodavac={prodavac} />
    );
}
}

export default AdministratorDashboardArticle;
