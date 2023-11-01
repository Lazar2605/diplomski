import { Container, Card, Row, Col } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import api from "../../api/api"
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

class HomePageKupac extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: (localStorage.getItem("api_tokenkorisnik")) ? true : false,
      categories: [],
    } 
    
  }

  componentWillMount() {
    this.getCategories();
  }

  componentWillUpdate() {
    this.getCategories();
  }

  setLoggedInState(isLoggedIn) {
    const newState = Object.assign(this.state, {
        isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }

  getCategories() {
    api('kategorije', 'get', {})
    .then(res => {
       if (!res.data) {
        this.putCategoriesInState(res);
      } 
    })
  }

  putCategoriesInState(data) {
    const categories = data.map(category => {
      return {
        id: category.id,
        naziv: category.naziv,
      }
    })

    const newState = Object.assign(this.state, {
      categories: categories
    })

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
        <RoledMainMenu role="korisnik" />
        <Card style={{ color: 'white' }} className='transparent-bg'>
            <Card.Body>
                <Card.Title>
                    <FontAwesomeIcon icon = { faListAlt }></FontAwesomeIcon>  Kategorije 
                </Card.Title>
                <Row>
                  { this.state.categories.map(this.singleCategory)}
                </Row>
            </Card.Body>
        </Card>
    </Container>
    );
  }

  singleCategory(category) {
    return (
      <Col lg="3" md="4" sm="6" xs="12">
        <Card style={{ height:"100px"}} className="mb-3 opacity-75">
          <Link style={{backgroundColor:"white", color: "black", height:"100%", fontSize:"20px", display: "flex",
            alignItems: "center",
            justifyContent: "center"}} to = {`korisnik/kategorija/${ category.id}`} className="btn btn-primary w-100 btn-sm">
            	{ category.naziv }
          </Link>
        </Card>
      </Col>
    );
  }
}

export default HomePageKupac;
