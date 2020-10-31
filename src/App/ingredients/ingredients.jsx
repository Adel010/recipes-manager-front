import React, { useState } from "react";
import { Loader } from "../../ui/loader";
import PropTypes from "prop-types";

export function Ingredients({ingredients, onDelete}){
    
    return <div>
        <h1>Ingredients</h1>
        {ingredients ? 
        <ul className="ingredients-list">
            {ingredients.map(i => <Ingredient key={i.id} ingredient={i} onDelete={onDelete} />)}
        </ul>
        : <Loader />}
        
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

function AddIngredient(){
    return <form>
        <input type="text"/>
    </form>
}