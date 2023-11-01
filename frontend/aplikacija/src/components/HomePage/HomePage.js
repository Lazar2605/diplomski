import { Container, Card, Row, Col } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import api from "../../api/api"
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

class HomePage extends React.Component {
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
    return (
      <Container>
        <RoledMainMenu role="posetilac" />
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
          <Link style={{backgroundColor:"white", color:"black", height:"100%", fontSize:"20px", display: "flex",
            alignItems: "center",
            justifyContent: "center"}} to = {`kategorija/${ category.id}`} className="btn btn-primary w-100 btn-sm">
            	{ category.naziv }
          </Link>
        </Card>
      </Col>
    );
  }
}

export default HomePage;
