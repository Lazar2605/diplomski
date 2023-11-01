import React from 'react';
import { Nav } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';
import Cart from '../Cart/Cart';
import CartKorisnik from '../Cart/CartKorisnik';

export class MainMenuItem {
    constructor(text, link) {
        this.text = text;
        this.link = link;
    }
}

export class MainMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
        };
    }

    setItems(items) {
        this.setState({
            items: items,
        });
    }

    render() {
        return (
            <Nav variant="tabs">
                <HashRouter>
                    {this.state.items.map(this.makeNavLink)}
                    { this.props.showCart ? <Cart /> : this.props.showCartKorisnik ? <CartKorisnik /> : "" }
                </HashRouter>
            </Nav>
        );
    }

    makeNavLink(item) {
        return (
            <Link to = { item.link } className = "nav-link"  key = {item.text}>
                { item.text }
            </Link>
        )

    }
}