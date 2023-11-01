import { Card, Container } from 'react-bootstrap';
import React from 'react';
import api from "../../api/api"
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

class CommentsPageProdavac extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      myComments: [],
    } 
    
  }

  componentWillMount() {
    this.getMyComments();
  }

  getMyComments() {
    api("ocene", "get", {}, "prodavac")
    .then((res) => {
        if(res.data?.response?.status === 401) {
            this.setLoggedInState(false);
            return;
        } 
        this.putCommentsInState(res);
    })
  }

  putCommentsInState(data) {
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
        myComments: comments
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
        <RoledMainMenu role="prodavac" />
        {this.state.myComments.map(comment => (
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
      </Container>
    );
  }
}

export default CommentsPageProdavac;
