import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import api, { getUser } from "../../api/api"
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

class AdministratorDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: (localStorage.getItem("api_tokenadmin")) ? true : false,
      categories: [],
    } 
    
  }

  componentWillMount() {
    this.getMyData();
  }

  componentWillUpdate() {
    this.getMyData();
  }

  getMyData() {
    const admin = getUser('admin');
    api("/admin/" + admin._id, "get", {}, "admin")
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
        <RoledMainMenu role="admin" />
      <Card>
          <Card.Body>
              <Card.Title>
                  <FontAwesomeIcon icon = { faHome } /> Administrator 
              </Card.Title>

                <Card style={{ height:"250px"}} className="mb-3 ">
                  <Link style={{backgroundColor:"white", color:"white", height:"100%", fontSize:"50px", display: "flex",
                    alignItems: "center",
                    justifyContent: "center"}} to = "/admin/dashboard/kategorije" className="btn btn-primary w-100 btn-sm kategorije-image">
                      <strong>Kategorije</strong>
                  </Link>
              </Card>
              <Card style={{ height:"250px"}} className="mb-3">
                <Link style={{backgroundColor:"white", color:"white", height:"100%", fontSize:"50px", display: "flex",
                  alignItems: "center",
                  justifyContent: "center"}} to = "/admin/dashboard/proizvodi" className="btn btn-primary w-100 btn-sm proizvodi-image">
                    <strong>Proizvodi</strong>
                </Link>
              </Card>
              <Card style={{ height:"250px"}} className="mb-3">
                <Link style={{backgroundColor:"white", color:"white", height:"100%", fontSize:"50px", display: "flex",
                  alignItems: "center",
                  justifyContent: "center"}} to = "/admin/dashboard/prodavci" className="btn btn-primary w-100 btn-sm prodavci-image">
                     <strong>Prodavci</strong>
                </Link>
              </Card>

          </Card.Body>
      </Card>
  </Container>
    );
  }
}

export default AdministratorDashboard;
