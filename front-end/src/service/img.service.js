import Axios from 'axios';
import {urlMongo} from '../environments/environment';

function get(){
    return Axios.get(urlMongo+"/img");
}

function put(data){
    return Axios.put(urlMongo+"/img",data);
}

function getImg(id){
    return Axios.get(urlMongo+"/img/file/"+id);
}

export {get, put, getImg};