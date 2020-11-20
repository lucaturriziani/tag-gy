import Axios from 'axios';
import {urlMongo} from '../environments/environment';

function getAllPOSTag(){
    return Axios.get(urlMongo+"/tags");
}

function getCollsName(){
    return Axios.get(urlMongo+"/collections");
}

export {getAllPOSTag, getCollsName};