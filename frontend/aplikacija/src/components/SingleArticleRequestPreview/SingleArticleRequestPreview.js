import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/api";

export default class SingleArticleRequestPreview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            categories: [],
            categoryId: undefined,
        }
    } 

 acceptArticle(articleId) {
    api("/admin/proizvod/" + articleId + "/potvrdi/kategorija/" + this.state.categoryId, "post", {}, "admin")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
    })
 }

 declineArticle(articleId){
    api("/admin/proizvod/" + articleId + "/odbij", "post", {}, "admin")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
    })
 }

 componentWillMount() {
    this.getCategories();
  }

  getCategories() {
    api("/kategorije/admin", "get", {}, "admin")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
        this.putCategoriesInState(res);
        this.setCategory(res[0].id);
    })
  }
  putCategoriesInState(data) {
    const categories = data.map(category => {
      return {
        id: category.id,
        naziv: category.naziv,
        roditeljska: {
          id: category.roditeljska?.id,
          naziv: category.roditeljska?.naziv
        }
      }
    })

    const newState = Object.assign(this.state, {
      categories: categories
    })

    this.setState(newState);
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
                <Card.Header style={{ height: '270px', overflow: 'hidden', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img alt={ this.props.article.naziv }
                        src={ require("../../images/" + this.props.article.slika) }  className="w-100 h-auto"   style={{ maxHeight: '100%', width: 'auto' }} />
                </Card.Header>
                <Card.Body  style={{ height: '270px'}}>
                <Card.Title as="p">
                    <strong>
                    { this.props.article.naziv }
                    </strong>
                </Card.Title>
    
                <Card.Text>
                    cena: { this.props.article.cena.kolicina + this.props.article.cena.mera + " " + this.props.article.cena.iznos } RSD
                </Card.Text>
                <Card.Text>
                    lokacija: { this.props.article.prodavac.adresa.grad }
                </Card.Text>
                    prodavac:{" "}
                    <a href={`/admin/dashboard/prodavci/${this.props.article.prodavac.id}`}>
                        {this.props.article.prodavac.ime} {this.props.article.prodavac.prezime}
                    </a>
                <Card.Text>
                </Card.Text>
                <Form.Group>
                <Form.Label htmlFor="kategorija">kategorija</Form.Label>
                <Form.Control id="kategorija" as="select" size="sm" value={this.state.categoryId}
                    onChange={ (e) => this.setCategory(e.target.value) }>
                    { this.state.categories.map(category => (
                    <option value={ category.id }>
                        { category.naziv }
                    </option>
                    )) }
                </Form.Control>
                    <Row>
                        <Col xs="6">
                            <Button className="btn btn-primary w-100 btn-sm" variant='success' size="sm" style={{ color: 'white'}}
                            onClick={ () => this.acceptArticle(this.props.article.id) }>
                            <FontAwesomeIcon icon={ faCheck }/> Prihvati
                            </Button>
                        </Col>
                        <Col xs="6">
                        <Button className="btn btn-primary w-100 btn-sm" variant='danger' size="sm" style={{ color: 'white'}}
                            onClick={ () => this.declineArticle(this.props.article.id) }>
                            <FontAwesomeIcon icon={ faX }/> Odbij
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