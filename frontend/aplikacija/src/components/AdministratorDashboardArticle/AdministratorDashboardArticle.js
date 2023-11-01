import { Container, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import api from "../../api/api"
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import SingleArticleRequestPreview from '../SingleArticleRequestPreview/SingleArticleRequestPreview';

class AdministratorDashboardProdavac extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      prodavci: [],
      addCategoryModal: {
        visible: false,
        categoryId: undefined,
      },
    } 
    
  }

  setAddCategoryModalVisibleState(newState) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addCategoryModal, {
        visible: newState
      })))
  } 

  setAddCategoryModalStringFieldState(fieldName, newValue) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state,
        Object.assign(this.state.addModal, {
          [ fieldName ]: newValue,
        }))))
  } 

  componentWillMount() {
    this.getArticleRequests();
  }

  componentDidUpdate() {
    this.getArticleRequests();
  }


  getArticleRequests() {
    api("/proizvodi/nedostupni", "get", {}, "admin")
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
        id: article.id,
        naziv: article.naziv,
        opis: article.opis,
        cena: {
          kolicina: article.cena.kolicina,
          mera: article.cena.mera,
          iznos: article.cena.iznos,
        },
        slika: article.slikaKljuc,
        prodavac: {
          id: article.prodavac.id,
          ime: article.prodavac.ime,
          prezime: article.prodavac.prezime,
          adresa: {
            grad: article.prodavac.adresa.grad,
          }
        },
      }
    })

    const newState = Object.assign(this.state, {
      articles: articles
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
                      <FontAwesomeIcon icon = { faListAlt }></FontAwesomeIcon> Zahtevi za proizvode
                  </Card.Title>

                  <Row>
                      <Col xs="12" md="8" lg="9">
                          { this.showArticles() }
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
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
      <SingleArticleRequestPreview article={article} />
    );
}
}

export default AdministratorDashboardProdavac;
