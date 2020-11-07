import React, { useCallback, useReducer } from "react";
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
            return { ...state, ingredients: [action.payload, ...state.ingredients]}
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
        fetchIngredients : useCallback(async function(){
            if(state.loading || state.ingredients){ //prevent reloading (fetching)
                return
            }
            try{
                const ingredients = await fetchApi("ingredients");
                dispatch({type: "SET_INGREDIENTS", payload : ingredients});
            }catch(e){
                dispatch({type: "SET_INGREDIENTS", payload : "Loading error"});
                console.error(e);
            }
           
        },[state]),
        deleteIngredient : useCallback(async function(ingredient){
            await fetchApi("ingredients/" + ingredient.id, { method : "DELETE"});
            dispatch({type: "DELETE_INGREDIENT", payload: ingredient})
        }, []),
        addIngredient : useCallback(async function(newIngredient){
            try{
                await fetchApi("ingredients", {
                    method : "POST",
                    body : JSON.stringify(newIngredient),
                    headers: {
                        Accept: "application/json",
                        "Content-Type" : "application/json"
                    }
                });
                dispatch({type: "ADD_INGREDIENT", payload : newIngredient })

            }catch(err){
                throw err
            }
        },[]),
        editIngredient : useCallback(async function(ingredient, editedIngredient){
            try{
                await fetchApi("ingredients/" + ingredient.id, {
                    method: "PUT",
                    headers:{
                        Accept: "application/json",
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(editedIngredient)
            });
            }catch(err){
                throw err
            }
            
            dispatch({type : "UPDATE_INGREDIENT" , target : ingredient, payload : editedIngredient});
        }, [])
    }
}