import axios from 'axios';
import { ApiConfig } from '../config/apiconfig';

export default function api(path, method, body, role) {
    return new Promise((resolve) => {
        const requestData = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : getToken(role),
                
            }
        };


        axios(requestData)
        .then(res => responseHandler(res, resolve, requestData))
        .catch(err => {
            const response = {
                status: 'error',
                data: err
            };
            resolve(response);

            });
        });
    
}

export function apiFile(path, method, body, role) {

    return new Promise((resolve) => {
        const requestData = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: body,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : getToken(role),
            }
        };


        axios(requestData)
        .then(res => responseHandler(res, resolve, requestData))
        .catch(err => {
            const response = {
                status: 'error',
                data: err
            };
            resolve(response);

            });
        });
    
}

function responseHandler(res, resolve, requestData) {
    if (res.status < 200 || res.status >= 300) {
        //STATUS CODE 401 - Bad Token:
        //TODO: Refresh tokena i pokušati ponovo
        // Ne možemo da osvvežimo token, preumseriti na login!

        if (res.status === 401) {
            //refreshToken(requestData, resolve);
        }

        const response = {
            status: 'error',
            data: res.data
        };

        return resolve(response);
    }

    if (res.data.statusCode < 0) {

        const response = {
            status: 'ok',
            data: res.data
        };

        return resolve(response);
    }

    resolve(res.data);
}

function getToken(role) {
    const token = localStorage.getItem('api_token' + role);
    return 'Bearer ' + token;
}

export function saveToken(role, token) {
    localStorage.setItem('api_token' + role, token);
}

export function saveUser(role, user) {
    localStorage.setItem('logged ' + role , JSON.stringify(user));
}

export function getUser(role) {
    return JSON.parse(localStorage.getItem('logged ' + role));
}

export function saveRole(role) {
    localStorage.setItem('role', role);
}

export function logOut(role) {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('api_token' + role);
}

