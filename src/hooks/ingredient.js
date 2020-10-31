import React, { useReducer } from "react";
import { fetchApi } from "../funcs/fetchApi";

function reducer(state, action){
    switch (action.type){
        case "FETCHING_INGREDIENTS":
            return { ...state, loading : true}
        case "SET_INGREDIENTS":
           return { ...state, ingredients: action.payload, loading: false}
        case "DELETE_INGREDIENT":
            return { ...state, ingredients: state.ingredients.filter(i => i !== action.payload) }
        case "ADD_INGREDIENT":
            return { ...state, ingredients: [...state.ingredients, action.payload]}
        case "UPDATE_INGREDIENT":
            return { ...state, ingredients: state.ingredients.map(i => i === action.target ? action.payload: i)}
        default:
            throw new Error("Unknown action type")
    }
}

export function useIngredients(){
    const [state, dispatch] = useReducer(reducer,{
        ingredients: null,
        loading : false
    });
    return {
        ingredients : state.ingredients,
        fetchIngredients : async function(){
            if(state.loading || state.ingredients){ //prevent reloading (fetching)
                return
            }
            try{
                const ingredients = await fetchApi("ingredients");
                dispatch({type: "SET_INGREDIENTS", payload : ingredients})
            }catch(e){
                dispatch({type: "SET_INGREDIENTS", payload : "Loading error"});
                console.error(e);
            }
           
        },
        deleteIngredient : async function(ingredient){
            await fetchApi("ingredients/" + ingredient.id, { method : "GET"});
            dispatch({type: "DELETE_INGREDIENT", payload: ingredient})
        }
    }
}