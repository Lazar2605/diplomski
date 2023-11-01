import { Container, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import api, { apiFile } from "../../api/api"
import { faEdit, faImage, faListAlt, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

class ProdavacProizvodi extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      myArticles: [],
      addModal: {
        visible: false,
        imageKey: "",
        name: "",
        description: "",
        quantity: undefined,
        neto: "",
        price: undefined,
        file: undefined,
      },
      editModal: {
        visible: false,
        quantity: undefined,
        neto: "",
        price: undefined,
        articleId: "",
      },
      imageModal: {
        visible: false,
        articleImage: "",
        articleName: "",
      },
      checkModal: {
        visible: false,
        articleId: "",
      }
    } 
    
  }

  setCheckModalVisibleState(newState) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.checkModal, {
        visible: newState
      })))
  } 

  setCheckModalStringFieldState(fieldName, newValue) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state,
        Object.assign(this.state.checkModal, {
          [ fieldName ]: newValue,
        }))))
  } 

  setImageModalVisibleState(newState) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.imageModal, {
        visible: newState
      })))
  } 

  setImageModalStringFieldState(fieldName, newValue) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state,
        Object.assign(this.state.imageModal, {
          [ fieldName ]: newValue,
        }))))
  } 

  setAddModalVisibleState(newState) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        visible: newState
      })))
  } 

  setAddModalStringFieldState(fieldName, newValue) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state,
        Object.assign(this.state.addModal, {
          [ fieldName ]: newValue,
        }))))
  } 

  setAddModalPriceState(newValue) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal, {
           price: newValue,
        })))
  } 

  setAddModalQuantityState(newValue) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal, {
           quantity: newValue,
        })))
  } 

  setEditModalVisibleState(newState) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        visible: newState
      })))
  } 

  setEditModalStringFieldState(fieldName, newValue) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state,
        Object.assign(this.state.editModal, {
          [ fieldName ]: newValue,
        }))))
  } 

  setEditModalPriceState(newValue) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal, {
           price: newValue,
        })))
  } 

  setEditModalQuantityState(newValue) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal, {
           quantity: newValue,
        })))
  } 

  componentWillMount() {
    this.getMyArticles();
  }



  getMyArticles() {
    api("/proizvodi/prodavac", "get", {}, "prodavac")
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
        dostupan: article.dostupan,
        kategorija: {
            naziv: article.kategorija?.naziv,
        }
      }
    })
    
    const newState = Object.assign(this.state, {
        myArticles: articles
    })

    this.setState(newState);
  }

  setLoggedInState(isLoggedIn) {
    const newState = Object.assign(this.state, {
        isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }

  handleFileChange = (event) => {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
         file: event.target.files[0],
      })))
  };


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
                  <FontAwesomeIcon icon = { faListAlt } /> Moji proizvodi 
              </Card.Title>

              <Table hover size="sm" bordered>
                <thead>
                  <tr>
                    <th colspan={ 8 }></th>
                    <th className="text-center">
                      <Button variant='primary' size="sm"
                        onClick={ () => this.showAddModal() }>
                        <FontAwesomeIcon icon={ faPlus }/> Dodaj
                      </Button>
                    </th>
                  </tr>
                  <tr>
                    <th>naziv</th>
                    <th>opis</th>
                    <th>neto</th>
                    <th>cena</th>
                    <th>kategorija</th>
                    <th>dostupan</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.myArticles.map(article => (
                    <tr>
                      <td>{ article.naziv }</td>
                      <td style={{maxWidth:"400px"}}>{ article.opis }</td>
                      <td>{ article.cena.kolicina + article.cena.mera }</td>
                      <td>{ article.cena.iznos } RSD</td>
                      <td>{ article.kategorija?.naziv} </td>
                      <td>{ article.dostupan === true ? "Da" : "Ne"} </td>
                      <td className='text-center'>
                      <Button variant='danger' size="sm" style={{ color: 'white' }}
                        onClick={ () => this.showCheckModal(article.id) }>
                        <FontAwesomeIcon icon={ faRemove }/> Obriši
                      </Button>
                      </td>
                      <td className='text-center'>
                      <Button variant='link' size="sm" style={{ color: 'black' }}
                        onClick={ () => this.showImageModal(article.slika, article.naziv) }>
                        <FontAwesomeIcon icon={ faImage }/> Slika
                      </Button>
                      </td>
                      <td className='text-center'>
                      <Button variant='info' size="sm" style={{ color: 'white' }}
                        onClick={ () => this.showEditModal(article) }>
                        <FontAwesomeIcon icon={ faEdit }/> Izmeni cenu
                      </Button>
                      </td>
                    </tr>
                  ), this) }
                </tbody>
              </Table>
          </Card.Body>
      </Card>
      <Modal size="lg" centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisibleState(false)}>
        <Modal.Header closeButton>
            <Modal.Title>
                Dodaj novi proizvod
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="name">Naziv</Form.Label>
              <Form.Control id="name" type="name" value={ this.state.addModal.name }
                onChange={ (e) => this.setAddModalStringFieldState("name", e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="description">Opis</Form.Label>
              <Form.Control id="description" as="textarea" value={ this.state.addModal.description }
                onChange={ (e) => this.setAddModalStringFieldState("description", e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="quantity">Količina</Form.Label>
              <Form.Control id="quantity" type="number" value={ this.state.addModal.quantity }
                onChange={ (e) => this.setAddModalQuantityState(e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="neto">Mera</Form.Label>
              <Form.Control id="neto" type="text" value={ this.state.addModal.neto }
                onChange={ (e) => this.setAddModalStringFieldState("neto", e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="price">Cena</Form.Label>
              <Form.Control id="price" type="number" value={ this.state.addModal.price }
                onChange={ (e) => this.setAddModalPriceState(e.target.value) } />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="imageKey">Slika</Form.Label>
              <Form.Control type="file" onChange={this.handleFileChange} />
            </Form.Group>
            <Form.Group>
              <Button variant="primary" onClick={ () => this.doAddArticle()}>
              <FontAwesomeIcon icon={ faPlus }/> Dodaj novi proizvod
              </Button>
            </Form.Group>
            { this.state.addModal.message ? (
              <Alert variant='danger' value = { this.state.editModal.message } />
            ) : ""}
        </Modal.Body>
      </Modal>

      <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false)}>
        <Modal.Header closeButton>
            <Modal.Title>
                Izmeni cenu proizvoda
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="price">Cena</Form.Label>
              <Form.Control id="price" type="number" value={ this.state.editModal.price }
                onChange={ (e) => this.setEditModalPriceState(e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Button variant="primary" onClick={ () => this.doEditArticle()}>
              <FontAwesomeIcon icon={ faPlus }/> Izmeni cenu
              </Button>
            </Form.Group>
            { this.state.editModal.message ? (
              <Alert variant='danger' value = { this.state.editModal.message } />
            ) : ""}
        </Modal.Body>
      </Modal>

      <Modal size="lg" centered show={ this.state.imageModal.visible } onHide={ () => this.setImageModalVisibleState(false)}>
        <Modal.Header closeButton>
            <Modal.Title>
                { this.state.imageModal.articleName }
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <img alt={ this.state.imageModal.articleName }
             src={ this.state.imageModal.articleImage ? require("../../images/" + this.state.imageModal.articleImage) : "" }  className="w-100 h-auto"   style={{ maxHeight: '100%', width: 'auto' }} />
        </Modal.Body>
      </Modal>
      <Modal size="sm" centered show={ this.state.checkModal.visible } onHide={ () => this.setCheckModalVisibleState(false)}>
        <Modal.Header closeButton>
            <Modal.Title>
                Potvrda 
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
              Da li ste sigurni?
              <Form.Group>
              <Button variant="primary" onClick={ () => this.doDeleteArticle()}>
                 Da
              </Button>
            </Form.Group>
        </Modal.Body>
      </Modal>
  </Container>
    );
  }

  showCheckModal(articlelId) {
    this.setCheckModalStringFieldState("articleId", articlelId)
    this.setCheckModalVisibleState(true);
  }

  showImageModal(articleImage, articleName) {
    this.setImageModalStringFieldState("articleImage", articleImage);
    this.setImageModalStringFieldState("articleName", articleName)
    this.setImageModalVisibleState(true);
}

  showAddModal() {
      this.setAddModalStringFieldState("name", "");
      this.setAddModalStringFieldState("description", "");
      this.setAddModalQuantityState(0);
      this.setAddModalStringFieldState("neto", "");
      this.setEditModalPriceState(0);
      this.setAddModalVisibleState(true);
  }

  doAddArticle() {
    const formData = new FormData();
    formData.append('file', this.state.addModal.file);
    formData.append('naziv', this.state.addModal.name);
    formData.append('opis', this.state.addModal.description);
    formData.append('kolicina', this.state.addModal.quantity);
    formData.append('mera', this.state.addModal.neto);
    formData.append('iznos', this.state.addModal.price);

    apiFile("/proizvodi", "post", formData, "prodavac")
    .then((res) => {
      if(res.data?.response.status === 401) {
        this.setLoggedInState(false);
        return;
      } else if (res.status === "error") {
        this.setAddModalStringFieldState("message", res.data.response?.data.message);
      }
      this.setAddModalVisibleState(false);
      this.getMyArticles();

    });
  }

  doEditArticle() {
    api("/proizvodi/" + this.state.editModal.articleId, "patch", {
      cena: this.state.editModal.price,
    }, "prodavac")
    .then((res) => {
      if(res.data?.response?.status === 401) {
        this.setLoggedInState(false);
        return;
      } else if (res.status === "error") {
        this.setEditModalStringFieldState("message", res.data.response?.data.message);
      }
      this.setEditModalVisibleState(false);
      this.getMyArticles();

    });
  }

  doDeleteArticle() {
    api("/proizvodi/" + this.state.checkModal.articleId, "delete", {}, "prodavac")
    .then((res) => {
      if(res.data?.response?.status === 401) {
        this.setLoggedInState(false);
        return;
      } else if (res.status === "error") {
        this.setEditModalStringFieldState("message", res.data.response?.data.message);
      }
      this.setCheckModalVisibleState(false);
      this.getMyArticles();

    });
  }

  showEditModal(article) {
    this.setAddModalQuantityState(0);
    this.setAddModalStringFieldState("neto", "");
    this.setEditModalPriceState(0);
    this.setEditModalStringFieldState("articleId", article.id)
    this.setEditModalVisibleState(true);
  }
}

export default ProdavacProizvodi;
