import Axios from 'axios';
import {urlMongo} from '../environments/environment';

function getAllTag(dbName){
    return Axios.get(urlMongo+dbName+"/tags");
}

function getTagCount(){
    return Axios.get(urlMongo+"/user/info");
}

export {getAllTag, getTagCount};