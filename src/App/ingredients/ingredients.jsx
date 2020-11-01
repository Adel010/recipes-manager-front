import React, { useState } from "react";
import { Loader } from "../../ui/loader";
import PropTypes from "prop-types";
import { ApiErrors } from "../../funcs/fetchApi";

export function Ingredients({ingredients, onDelete, addNewIngredient}){
    
    return <div>
        <h1>Ingredients</h1>
        {ingredients ? 
        <ul className="ingredients-list">
            {ingredients.map(i => <Ingredient key={i.id} ingredient={i} onDelete={onDelete} />)}
        </ul>
        : <Loader />}
        <AddIngredient ingredients={ingredients} fetchAndAddToState={addNewIngredient}/>
    </div>
}

Ingredients.propTypes = {
    ingredients: PropTypes.array
}

function Ingredient({ingredient, onDelete}){
    const [loadingDel, setLoadingDel] = useState(false);
    const hadndeleDelete = async function(event){
        event.preventDefault();
        setLoadingDel(true);
        await onDelete(ingredient);
    }

return <li>{ingredient.title} <button className="btn danger-btn" onClick={hadndeleDelete} disabled={loadingDel}>{loadingDel? <Loader size="small" color="white"/> : "X"}</button></li>
}

function AddIngredient({ingredients, fetchAndAddToState}){
    const [error, setError] = useState(null);

    const handleSubmit = async function(event){
        event.preventDefault();
        let sortedIngredients = await ingredients.slice().sort((a,b)=>{
            return a.id - b.id
        });
        let addedIngredient = {id: sortedIngredients[sortedIngredients.length - 1].id + 1};
        const data = new FormData(event.target);
        for(let entrie of data){
            addedIngredient = { ...addedIngredient, [entrie[0]]: entrie[1]}
        }
        try{
            await fetchAndAddToState(addedIngredient);
            event.target.reset()
        }catch(err){
            if(err instanceof ApiErrors  && err.responsStatus === 422){
                setError("over-write")
            }else{
                setError("Server connexion error.");
            }
        }
    }
    function handleTitleChange(){
        if(error === "over-write"){
            setError(null)
        }
    }
    return <form onSubmit={handleSubmit} className="add-ingredient-form">
        <input type="text" name="title" id="ingredient-name" onChange={handleTitleChange} required/>
        <input type="text" name="unit" id="ingredient-unit"/>
        <button type="submit">ADD</button>
        {error === "over-write" ? <div className="error-message"><p>Ingredient already exists.</p></div>
        : error ? <div className="error-message"><p>{error}</p></div>
        : ""}
    </form>
}