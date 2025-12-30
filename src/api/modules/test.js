import {get,post,postJson} from '../axios';

export function myGet(params){
    return get('/get', params);
}

export function myPost(params){
    return post('/postTest', params);
}
export function myPostJson(params){
    return postJson('/postJson', params);
}
