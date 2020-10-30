import Axios from 'axios';
import {urlMongo, urlNoDb} from '../environments/environment';

function get(){
    return Axios.get(urlNoDb);
}

function put(data){
    return Axios.put(urlNoDb,data);
}

export {get, put};