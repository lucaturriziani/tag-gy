import Axios from 'axios';
import {urlMongo} from '../environments/environment';

function get(){
    return Axios.get(urlMongo);
}

function put(data){
    return Axios.put(urlMongo,data);
}

export {get, put};