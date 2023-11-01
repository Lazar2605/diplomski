import React from "react";
import { MainMenu, MainMenuItem } from "../MainMenu/MainMenu";

export default class RoledMainMenu extends React.Component {
    render() {
        let items = [];
        switch (this.props.role) {
            case "korisnik" : items = this.getKorisnikMenuItems(); break;
            case "prodavac" : items = this.getProdavacMenuItems(); break;
            case "admin" : items = this.getAdminMenuItems(); break;
            default: items = this.getVisitorMenuItems(); break;
        }

        let showCart = true;
        let showCartKorisnik = false;
        
        if (this.props.role === "korisnik") {
            showCart = false;
            showCartKorisnik = true;
        } else if(this.props.role === "admin"){
            showCart = false;
            showCartKorisnik = false;
        } else if(this.props.role === "prodavac"){
            showCart = false;
            showCartKorisnik = false;
        }


        return <MainMenu items={ items } showCart={showCart} showCartKorisnik={showCartKorisnik} />
    }

    getKorisnikMenuItems() {
        return [
            new MainMenuItem("Početna", "/korisnik"),
            new MainMenuItem("Moje porudžbine", "/korisnik/porudzbine"),
            new MainMenuItem("Odjavi se", "/korisnik/logout"),
        ];
    }

    getProdavacMenuItems() {
        return [            
            new MainMenuItem("Dashboard", "/prodavac/dashboard"),
            new MainMenuItem("Odjavi se", "/prodavac/logout"),
        ];
    }

    getAdminMenuItems() {
        return [
            new MainMenuItem("Dashboard", "/admin/dashboard"),
            new MainMenuItem("Odjavi se", "/admin/logout"),
        ];
    }

    getVisitorMenuItems() {
        return [
            new MainMenuItem("Početna", "/"),
            new MainMenuItem("Prijava", "/korisnik/login"),
            new MainMenuItem("Registrovanje kupca", "/korisnik/register-kupac"),
            new MainMenuItem("Registrovanje prodavca", "/korisnik/register-prodavac"),
        ];
    }
}