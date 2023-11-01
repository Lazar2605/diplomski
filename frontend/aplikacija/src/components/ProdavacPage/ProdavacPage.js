import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import api from "../../api/api"
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

class ProdavacPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: (localStorage.getItem("api_tokenprodavac")) ? true : false,
    } 
    
  }

  componentWillMount() {
    this.getMyData();
  }

  componentWillUpdate() {
    this.getMyData();
  }

  getMyData() {
    api("/prodavci/trenutni", "get", {}, "prodavac")
    .then((res) => {
      if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        }
    })
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
        <RoledMainMenu role="prodavac" />
      <Card>
          <Card.Body>
              <Card.Title>
                  <FontAwesomeIcon icon = { faHome } /> Prodavac 
              </Card.Title>
                <Card style={{ height:"250px"}} className="mb-3 ">
                  <Link style={{backgroundColor:"white", color:"white", height:"100%", fontSize:"50px", display: "flex",
                    alignItems: "center",
                    justifyContent: "center"}} to = "/prodavac/dashboard/moji-proizvodi" className="btn btn-primary w-100 btn-sm proizvodi-image">
                      <strong>Proizvodi</strong>
                  </Link>
              </Card>
              <Card style={{ height:"250px"}} className="mb-3">
                <Link style={{backgroundColor:"white", color:"white", height:"100%", fontSize:"50px", display: "flex",
                  alignItems: "center",
                  justifyContent: "center"}} to = "/prodavac/dashboard/porudzbine" className="btn btn-primary w-100 btn-sm porudzbine-image">
                    <strong>Porudžbine</strong>
                </Link>
              </Card>
              <Card style={{ height:"250px"}} className="mb-3">
                <Link style={{backgroundColor:"white", color:"white", height:"100%", fontSize:"50px", display: "flex",
                  alignItems: "center",
                  justifyContent: "center"}} to = "/prodavac/dashboard/komentari" className="btn btn-primary w-100 btn-sm komentari-image">
                     <strong>Komentari</strong>
                </Link>
              </Card>


          </Card.Body>
      </Card>
  </Container>
    );
  }
}

export default ProdavacPage;
