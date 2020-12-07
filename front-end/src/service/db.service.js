import Axios from 'axios';
import {urlMongo} from '../environments/environment';

function getAllTag(dbName){
    return Axios.get(urlMongo+dbName+"/tags");
}

function getCollsName(){
    return Axios.get(urlMongo+"/collections");
}

export {getAllTag, getCollsName};