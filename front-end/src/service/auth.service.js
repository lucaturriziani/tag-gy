import Axios from 'axios';
import {urlMongo} from '../environments/environment';

function login(username, password){
    return Axios.post(urlMongo+"/login",{
        username: username,
        password: password
    });
}

export {login}