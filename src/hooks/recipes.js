import React, { useCallback, useReducer } from "react";
import {fetchApi} from "../funcs/fetchApi";

function reducer(state, action){
    switch (action.type){
        case "FETCHING_RECIPES":
            return {...state, loading: true}
        case "SET_RECIPES":
            return {...state, recipes: action.payload, loading: false}
        case "FETCHING_RECIPE_DETAILS":
            return {...state, loading: true}
        case "GET_RECIPE_DETAILS":
            return {...state, loading: false, loaded: [...state.loaded, action.target.id], recipes: state.recipes.map(r => r === action.target ? action.payload : r)}
        case "ADD_RECIPE":
            return {...state, loaded: [...state.loaded, action.payload.id], recipes : [...state.recipes, action.payload]}
        case "EDIT_RECIPE":
            return {...state, recipes: state.recipes.map(r => r.id === action.target.id ? action.payload : r)}
        case "DELETE_RECIPE":
            return {...state, recipes: state.recipes.filter(r => r.id !== action.target.id)}
        


        default:
            throw new Error("Unknown action type on useRecipes")
    }
}

export function useRecipes(){
    const [state, dispatch] = useReducer(reducer,{
        recipes : null,
        loading: false,
        loaded: []
    });
    return {
        recipes : state.recipes,
        fetchRecipes : async function(){
            if(state.loading || state.recipes !== null){
                return;
            }
            try{
                dispatch({type: "FETCHING_RECIPES"});
                const recipes = await fetchApi("recipes");
                dispatch({type: "SET_RECIPES", payload: recipes})
            }catch(err){
                dispatch({type:"SET_RECIPES", payload: "Loading error"});
                console.log(err);
                throw err
            }
        },
        getRecipeDetails: async function(recipe){
            if(state.loading || state.loaded.includes(recipe.id)){
                return
            }
            try{
                dispatch({type: "FETCHING_RECIPE_DETAILS"});
                const recipeDetails = await fetchApi("recipes/" + recipe.id);
                dispatch({type: "GET_RECIPE_DETAILS", target : recipe, payload: recipeDetails})
            }catch(err){
                console.log(err);
                throw err
            }
        },
        addRecipe: async function(recipe){
            const newRecipe = await fetchApi("recipes", {
                method : "POST",
                body : JSON.stringify(recipe),
                headers: {
                    Accept: "application/json",
                    "Content-Type" : "application/json"
                }
            });
            dispatch({type: "ADD_RECIPE", payload: newRecipe})
        },
        editRecipe: async function(targetedRecipe, newData){
            const editedRecipe = await fetchApi("recipes/" + targetedRecipe.id, {
                method: "PUT",
                headers:{
                    Accept: "application/json",
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(newData)
            });
            dispatch({type: "EDIT_RECIPE", target: targetedRecipe, payload: editedRecipe});
        },
        deleteRecipe: async function(targetedRecipe){
            await fetchApi("recipes/" + targetedRecipe.id, {method: "DELETE"});
            dispatch({type: "DELETE_RECIPE", target: targetedRecipe})
        }
        
    }
}