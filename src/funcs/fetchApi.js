/**
 * Un objet représentant les erreurs de l'api
 */
export class ApiErrors{
    constructor(errors){
        this.errors = errors
    }
}

/**
 * 
 * @param {String} endpoint 
 * @param {Object} options 
 */

export async function fetchApi(endpoint, options = {}){
    const respons = await fetch("http://localhost:3333/" + endpoint,{
        credentials: "include",
        headers: {
            Accept: "application/json"
        },
        ...options
    } );
    if(respons.status === 204){ //status 204 : no body (pas de contenu)
        return null
    }
    const responsData = await respons.json();
    if(respons.ok){
        return responsData
    }else{
        if(responsData.errors){
            throw new ApiErrors(responsData.errors)
        }
    }
}