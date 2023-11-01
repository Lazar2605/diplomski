import React from 'react';
import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Container, Card, Col, Row, Form, Button, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from "../../api/api";
import { Link } from 'react-router-dom';
import SingleArticlePreview from '../SingleArticlePreview/SingleArticlePreview';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

export default class CategoryPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            category: {
                naziv: "",
                id: "",
            },
            subcategories: [],
            message: "",
            filters: {
                keywords: "",
                minPrice: 0,
                maxPrice: 100000,
                order: "{'cena.iznos':1}",
            },
            currentPage: 1,
            totalPages: 0,
            prodavac: {
                address: { 
                    city: "",
                }
            },
        };
    }

    render() {
        const pages = [];
        for (let i = 1; i <= this.state.totalPages; i++) {
            pages.push(
                <Pagination.Item key={i} onClick={() => {
                                                            this.setCurrentPage(i);
                                                            this.getCategoryData();
                                                        }}>
                    {i}
                </Pagination.Item>
            );
        }
        return (
            <Container>
                <RoledMainMenu role="posetilac" />
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon = { faListAlt }></FontAwesomeIcon> { this.state.category?.naziv }
                    </Card.Title>
                    { this.printOptionalMesssage() }

                    { this.showSubcategories() }

                    <Row>
                        <Col xs="12" md="4" lg="3">
                            { this.printFilters() }
                        </Col>
                        <Col xs="12" md="8" lg="9">
                            { this.showArticles() }
                        </Col>
                    </Row>
                    <Pagination className="justify-content-center mt-3 ml-auto" style = {{ marginLeft: "25%" }}>
                        {pages}
                    </Pagination>
                </Card.Body>
            </Card>
        </Container>
        );
    }

    setNewFilter(newFilter) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }))
    }

    setNewCity(prodavac) {
        this.setState(Object.assign(this.state, {
            prodavac: prodavac,
        }))
    }

    filterKeywordsChanged(event) {
        const newFilter = (Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));

        this.setNewFilter(newFilter);

    }

    filterCityChanged(event) {
        const newCity = (Object.assign(this.state.prodavac, {
            address: {
                city: event.target.value
            },
        }));

        this.setNewCity(newCity);

    }

    filterPriceMinChanged(event) {
        const newFilter = (Object.assign(this.state.filters, {
            minPrice: Number(event.target.value),
        }));

        this.setNewFilter(newFilter);
    }

    filterPriceMaxChanged(event) {
        const newFilter = (Object.assign(this.state.filters, {
            maxPrice: Number(event.target.value),
        }));

        this.setNewFilter(newFilter);
    }

    filterOrderChanged(event) {
        const newFilter = (Object.assign(this.state.filters, {
            order: event.target.value,
        }));

        this.setNewFilter(newFilter);
    }

    applyFilters(city) {
        this.getCategoryData(city);
    }
    

    printFilters() {
         return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">Pretraga:</Form.Label>
                    <Form.Control type="text" id="keywords" 
                                  value= { this.state.filters.keywords} 
                                  onChange={(e) => this.filterKeywordsChanged(e)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="city">Lokacija:</Form.Label>
                    <Form.Control type="text" id="city" 
                                  value= { this.state.prodavac.address.city } 
                                  onChange={(e) => this.filterCityChanged(e)} />
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                        <Form.Label htmlFor="minPrice">Minimalna cena:</Form.Label>
                            <Form.Control type="number" id="minPrice"
                                          step="1" min="0" max="99999" 
                                          value={ this.state.filters.minPrice }
                                          onChange= { (e) => this.filterPriceMinChanged(e) }/>
                        </Col>
                        <Col xs="12" sm="6">
                        <Form.Label htmlFor="maxPrice">Maksimalna cena:</Form.Label>
                            <Form.Control type="number" id="maxPrice"
                                          step="1" min="1" max="100000" 
                                          value={ this.state.filters.maxPrice }
                                          onChange= { (e) => this.filterPriceMaxChanged(e) }/>
                        </Col>
                    </Row>
                </Form.Group>
                <div style={{ marginBottom: '10px' }}></div>
                <Form.Group>
                    <Form.Control as="select" id="sortOrder"
                                    value = { this.state.filters.order }
                                    onChange= { (e) => this.filterOrderChanged(e) }>
                        <option value='{"cena.iznos":1}'>Sortiraj po rastućoj ceni</option>
                        <option value='{"cena.iznos":-1}'>Sortiraj po opadajućoj ceni</option>
                        <option value='{"naziv":1}'>Sortiraj po nazivu u rastućem redosledu</option>
                        <option value='{"naziv":-1}'>Sortiraj po nazivu u opadajućem redosledu</option>
                    </Form.Control>
                </Form.Group>
                    <div style={{ marginBottom: '10px' }}></div>

                <Form.Group>
                   <Button variant="primary" className="w-100" onClick={() => { 
                                                                                this.setCurrentPage(1);
                                                                                this.applyFilters(); } }> 
                        <FontAwesomeIcon icon = { faSearch } /> Pretraži
                    </Button>
                </Form.Group>
            </>
         )
    }

    printOptionalMesssage() {
        if(this.state.message === "") {
            return;
        }
        return( 
            <Card.Text>
                { this.state.message }
            </Card.Text> 
        )
    }

    showSubcategories() {
        if (this.state.subcategories?.length === 0) {
            return;
        }

        return (
            <Row>
                {this.state.subcategories?.map(this.singleCategory)}
            </Row>
        )
    }

    singleCategory(category) {
        return (
          <Col lg="3" md="4" sm="6" xs="12">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title as="p">
                  { category.naziv }
                </Card.Title>
                <Link to = {`/kategorija/${ category.id}`} className="btn btn-primary w-100 btn-sm">
                Otvori kategoriju
                </Link>
              </Card.Body>
            </Card>
          </Col>
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
          <SingleArticlePreview article={article} visible="false"/>
        );
    }

    componentDidMount() {

        this.getCategoryData();
    }

    componentDidUpdate(oldProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }

        this.getCategoryData();
    }

    setErrorMessage(message) {
        const newState = Object.assign(this.state, {
            message: message
        });

        this.setState(newState);
    }

    setCategoryData(category) {
        const newState = Object.assign(this.state, {
            category: category
        });

        this.setState(newState);
    }

    
    setSubCategories(subcategories) {
        const newState = Object.assign(this.state, {
            subcategories: subcategories
        });

        this.setState(newState);
    }

    setArticles(articles) {
        const newState = Object.assign(this.state, {
            articles: articles
        });

        this.setState(newState);
    }

    setCurrentPage(currentPage) {
        const newState = Object.assign(this.state, {
            currentPage: currentPage
        });

        this.setState(newState);
    }

    setTotalPages(totalPages) {
        const newState = Object.assign(this.state, {
            totalPages: totalPages
        });

        this.setState(newState);
    }

    getCategoryData() {
        api("kategorije/" + this.props.match.params.cId, "get", {})
        .then(res => {
            if (!res.data) {
                const categoryData = {
                    id: res.id,
                    naziv: res.naziv,
                }

                this.setCategoryData(categoryData);

                const subcategories = res.cerkeKategorije.map(kategorija => {
                    return {
                        id: kategorija.id,
                        naziv: kategorija.naziv,
                    }
                })

                this.setSubCategories(subcategories);
            } 
            if(res.status === "error") {
                this.setErrorMessage(res.data.response?.data.message);
            } 
        })
        api("proizvodi/kategorija/" + this.props.match.params.cId + 
        "?keywords="+ this.state.filters.keywords + 
        "&minCena=" + this.state.filters.minPrice + "&maxCena=" + this.state.filters.maxPrice +
        "&sort=" + this.state.filters.order + "&kljucneReci=" + this.state.filters.keywords + 
        "&limit=6&page=" + this.state.currentPage + "&populate=prodavac&populate2=kategorija", "get", {})
        .then(res => {
            if(!res.data) {
                this.setCurrentPage(res.currentPage);
                this.setTotalPages(res.totalPages);
                let proizvodi = res.items.map((proizvod) => ({
                    proizvodId: proizvod.id,
                    naziv: proizvod.naziv,
                    opis: proizvod.opis,
                    cena: {
                        kolicina: proizvod.cena.kolicina,
                        mera: proizvod.cena.mera,
                        iznos: proizvod.cena.iznos,
                    },
                    slika: proizvod.slikaKljuc,
                    prodavac: {
                        adresa: {
                            grad: proizvod.prodavac.adresa.grad,
                        },
                        id: proizvod.prodavac.id,
                        cenaDostave: proizvod.prodavac.cenaDostave,
                        nazivPG: proizvod.prodavac.nazivPG
                    }

                }))

                if(this.state.prodavac.address.city !== "")
                    proizvodi = proizvodi.filter(proizvod => proizvod.prodavac.adresa.grad === this.state.prodavac.address.city)
                this.setArticles(proizvodi);
            }
            if(res.status === "error") {
                this.setErrorMessage(res.data.response?.data.message);
            } 
        })


    }
}