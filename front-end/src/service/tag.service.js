import Axios from 'axios';
import {urlMongo} from '../environments/environment';

function getAllPOSTag(){
    return Axios.get(urlMongo+"/tags");
}

export {getAllPOSTag};