import { Container, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import api from "../../api/api"
import { faEdit, faListAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

class AdministratorDashboardCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      categories: [],
      addModal: {
        visible: false,
        name: "",
        parentCategoryId: undefined,
        message: "",
      },
      editModal: {
        visible: false,
        name: "",
        parentCategoryId: undefined,
        message: "",
        categoryId: "",
      }
    } 
    
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
                  <FontAwesomeIcon icon = { faListAlt } /> Kategorije 
              </Card.Title>

              <Table hover size="sm" bordered>
                <thead>
                  <tr>
                    <th colspan={ 2 }></th>
                    <th className="text-center">
                      <Button variant='primary' size="sm"
                        onClick={ () => this.showAddModal() }>
                        <FontAwesomeIcon icon={ faPlus }/> Dodaj
                      </Button>
                    </th>
                  </tr>
                  <tr>
                    <th>naziv</th>
                    <th>naziv roditeljske kategorije</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.categories.map(category => (
                    <tr>
                      <td>{ category.naziv }</td>
                      <td>{ category.roditeljska?.naziv }</td>
                      <td className='text-center'>
                      <Button variant='info' size="sm" style={{ color: 'white' }}
                        onClick={ () => this.showEditModal(category) }>
                        <FontAwesomeIcon icon={ faEdit }/> Izmeni
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
                Dodaj novu kategoriju
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="name">Naziv</Form.Label>
              <Form.Control id="name" type="name" value={ this.state.addModal.name }
                onChange={ (e) => this.setAddModalStringFieldState("name", e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="parentCategoryId">Roditeljska kategorija</Form.Label>
              <Form.Control id="parentCategoryId" as="select" value={ this.state.addModal.parentCategoryId }
                onChange={ (e) => this.setAddModalStringFieldState("parentCategoryId", e.target.value) }>
                <option value="undefined"> nema roditeljske kategorije </option>
                { this.state.categories.map(category => (
                  <option value={ category.id }>
                    { category.naziv }
                  </option>
                )) }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Button variant="primary" onClick={ () => this.doAddCategory()}>
              <FontAwesomeIcon icon={ faPlus }/> Dodaj novu kategoriju
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
                Izmeni kategoriju
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="name">Naziv</Form.Label>
              <Form.Control id="name" type="name" value={ this.state.editModal.name }
                onChange={ (e) => this.setEditModalStringFieldState("name", e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="parentCategoryId">Roditeljska kategorija</Form.Label>
              <Form.Control id="parentCategoryId" as="select" value={ this.state.editModal.parentCategoryId }
                onChange={ (e) => this.setEditModalStringFieldState("parentCategoryId", e.target.value) }>
                <option value="undefined"> nema roditeljske kategorije </option>
                { this.state.categories
                .filter(category => category.id !== this.state.editModal.categoryId )
                .map(category => (
                  <option value={ category.id }>
                    { category.naziv }
                  </option>
                )) }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Button variant="primary" onClick={ () => this.doEditCategory()}>
              <FontAwesomeIcon icon={ faPlus }/> Izmeni kategoriju
              </Button>
            </Form.Group>
            { this.state.editModal.message ? (
              <Alert variant='danger' value = { this.state.editModal.message } />
            ) : ""}
        </Modal.Body>
      </Modal>
  </Container>
    );
  }

  showAddModal() {
      this.setAddModalStringFieldState("name", "");
      this.setAddModalStringFieldState("parentCategoryId", undefined);
      this.setAddModalStringFieldState("message", "");
      this.setAddModalVisibleState(true);
  }

  doAddCategory() {
    api("/kategorije/admin", "post", {
      naziv: this.state.addModal.name,
      roditeljskaKategorijaId: this.state.addModal.parentCategoryId,
    }, "admin")
    .then((res) => {
      if(res.data?.response?.status === 401) {
        this.setLoggedInState(false);
        return;
      } else if (res.status === "error") {
        this.setAddModalStringFieldState("message", res.data.response.data.message);
      }
      this.setAddModalVisibleState(false);
      this.getCategories();

    });
  }

  doEditCategory() {
    api("/kategorije/admin/" + this.state.editModal.categoryId, "patch", {
      naziv: this.state.editModal.name,
      roditeljskaKategorijaId: this.state.editModal.parentCategoryId,
    }, "admin")
    .then((res) => {
      if(res.data?.response?.status === 401) {
        this.setLoggedInState(false);
        return;
      } else if (res.status === "error") {
        this.setEditModalStringFieldState("message", res.data.response.data.message);
      }
      this.setEditModalVisibleState(false);
      this.getCategories();

    });
  }

  showEditModal(category) {
    this.setEditModalStringFieldState("name", category.naziv);
    this.setEditModalStringFieldState("parentCategoryId", category.roditeljska?.id);
    this.setEditModalStringFieldState("message", "");
    this.setEditModalStringFieldState("categoryId", category.id);
    this.setEditModalVisibleState(true);
  }
}

export default AdministratorDashboardCategory;
