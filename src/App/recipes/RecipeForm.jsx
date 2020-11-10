import React, { useEffect, useState } from "react";
import { Loader } from "../../ui/loader";


export function RecipeForm ({recipe, ingredints, fetchIngredients, addRecipe, editRecipe, isOpen, setEditing}){
    useEffect(function(){
        if(!ingredints){
            fetchIngredients()
        }
    });
    const [newRecipe, setNewRecipe] = useState({
        title: recipe? recipe.title : "",
        short: recipe? recipe.short : "",
        content: recipe? recipe.content : "",
        ingredients: recipe? recipe.ingredients : []
    });
    const [loading, setLoading] = useState(false);
    const fetchedIngredients = ingredints;
    const filtredIngredients = (fetchedIngredients || []).filter(ing => {
        return !newRecipe.ingredients.some(i => i.id === ing.id)
    });
    function handleSelect(e){
        setNewRecipe(r => ({...r, ingredients : [...r.ingredients, {...filtredIngredients.filter(ing => ing.id === parseInt(e.target.value))[0], quantity : 0} ]}));
    }
    function handleIngredientDelete(ingredientID){
        setNewRecipe(r => ({...r, ingredients : r.ingredients.filter(i => i.id !== parseInt(ingredientID))}));
        filtredIngredients.push(fetchedIngredients.map(ing => ing.id === parseInt(ingredientID))[0]);
    }
    function handleQuantityChange(changingIng, e){
        // console.log(typeof e.target.value);
        setNewRecipe(r => ({...r, ingredients: r.ingredients.map(ing => ing.id === changingIng.id ? {...ing, quantity : parseInt(e.target.value)} : ing)}))
    }
    function handleTitleChange(e){
        setNewRecipe(r => ({...r, title : e.target.value}))
    }
    function handleShortChange(e){
        setNewRecipe(r => ({...r, short : e.target.value}))
    }
    function handleContentChange(e){
        setNewRecipe(r => ({...r, content : e.target.value}))
    }
    async function handleSubmit(e){
        setLoading(true);
        e.preventDefault();
        if(isNew){
            addRecipe(newRecipe);
            isOpen(false);
        }else{
            await editRecipe(recipe, newRecipe);
            setEditing(false)
        }
        setLoading(false)
    }
    const isNew = recipe ? null : true;
    return <div className="recipe-form-container">
        <h2>{isNew ? "Create a new recipe" : "Edit recipe"}</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-col-left">
                <label>
                    Title<input type="text" name="title" value={newRecipe.title} onChange={handleTitleChange} required/>
                </label>
                <label>
                    Short description<textarea name="short" value={newRecipe.short} onChange={handleShortChange} required/>
                </label>
                <label>
                    Steps<textarea name="content" value={newRecipe.content} onChange={handleContentChange} required/>
                </label>
                <button type="submit" className="btn standard-btn">{loading ? <Loader color="white" size="small" /> : "SAVE"}</button>
            </div>
            <div className="form-col-right">
                <h3>Ingredients</h3>
                {newRecipe.ingredients.map(i => <IngredientRow ingredient={i} key={i.id} onDelete={handleIngredientDelete} onQuantityChange={handleQuantityChange} />)}
                {ingredints ? <select name="new-ingredient" id="new-ingredient" onChange={handleSelect}>
                    <option>Select a new ingredient</option>
                        {filtredIngredients.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
                </select> : <Loader color="white"/>}
            </div>
        </form>
    </div>
}

function IngredientRow({ingredient, onDelete, onQuantityChange}){

    return <div className="ingredient-row">
        {ingredient.title} <input type="number" name="quantity" value={ingredient.quantity} onChange={(e) => onQuantityChange(ingredient, e)} /> {ingredient.unit} <button className="btn danger-btn" onClick={() => onDelete(ingredient.id)}>Delete</button>
    </div>
}