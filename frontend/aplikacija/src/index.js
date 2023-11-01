import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import HomePage from './components/HomePage/HomePage';
import { HashRouter, Route, Switch} from 'react-router-dom';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { UserRegistrationPageKorisnik } from './components/UserRegistrationPages/UserRegistrationPageKorisnik';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorDashboardCategory from './components/AdministratorDashboardCategory/AdministratorDashboardCategory';
import AdministratorDashboardProdavac from './components/AdministratorDashboardProdavac/AdministratorDashboardProdavac';
import AdministratorDashboardArticle from './components/AdministratorDashboardArticle/AdministratorDashboardArticle';
import ProdavacPage from './components/ProdavacPage/ProdavacPage';
import ProdavacProizvodi from './components/ProdavacProizvodi/ProdavacProizvodi';
import HomePageKupac from './components/HomePage/HomePageKupac';
import CategoryPageKupac from './components/CategoryPage/CategoryPageKupac';
import OrdersPage from './components/OrdersPage/OrdersPage';
import OrdersPageProdavac from './components/OrdersPage/OrdersPageProdavac';
import CommentsPageProdavac from './components/CommentsPageProdavac/CommentsPageProdavac';
import ProdavacProfilePage from './components/ProdavacProfilePage/ProdavacProfilePage';
import ProdavacProfilePageKupac from './components/ProdavacProfilePage/ProdavacProfilePageKupac';
import { UserRegistrationPageProdavac } from './components/UserRegistrationPages/UserRegistrationPageProdavac';
import { AdministratorLogoutPage } from './components/AdministratorLogoutPage/AdministratorLogoutPage';
import { KupacLogoutPage } from './components/KupacLogoutPage/KupacLogoutPage';
import { ProdavacLogoutPage } from './components/ProdavacLogoutPage/ProdavacaLogoutPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path = "/" component = { HomePage } />
        <Route path = "/prodavac-profile" component = { ProdavacProfilePage } />
        <Route path = "/prodavac-profile-log" component = { ProdavacProfilePageKupac } />
        <Route path = "/korisnik/login" component = { UserLoginPage } />
        <Route path = "/admin/logout" component = { AdministratorLogoutPage } />
        <Route path = "/korisnik/logout" component = { KupacLogoutPage } />
        <Route path = "/prodavac/logout" component = { ProdavacLogoutPage } />
        <Route path = "/korisnik/register-kupac" component = { UserRegistrationPageKorisnik } />
        <Route path = "/korisnik/register-prodavac" component = { UserRegistrationPageProdavac } />
        <Route path = "/kategorija/:cId" component = { CategoryPage} />
        <Route exact path = "/admin/dashboard" component = { AdministratorDashboard} />
        <Route path = "/admin/dashboard/kategorije" component = { AdministratorDashboardCategory } />
        <Route path="/admin/dashboard/proizvodi" component={ AdministratorDashboardArticle } />
        <Route path="/admin/dashboard/prodavci" component={ AdministratorDashboardProdavac } />
        <Route exact path = "/prodavac/dashboard" component = { ProdavacPage} />
        <Route path = "/prodavac/dashboard/moji-proizvodi" component = { ProdavacProizvodi } />
        <Route path = "/prodavac/dashboard/porudzbine" component= { OrdersPageProdavac } />
        <Route path = "/prodavac/dashboard/komentari" component= { CommentsPageProdavac } />
        <Route exact path = "/korisnik" component = { HomePageKupac} />
        <Route path = "/korisnik/kategorija/:cId" component = { CategoryPageKupac } />
        <Route path = "/korisnik/porudzbine" component = { OrdersPage } />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
   document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
