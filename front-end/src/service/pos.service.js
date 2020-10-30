import Axios from 'axios';

function get(){
    return Axios.get(`http://localhost:3001`);
}

function put(data){
    return Axios.put(`http://localhost:3001`,data);
}

export {get, put};