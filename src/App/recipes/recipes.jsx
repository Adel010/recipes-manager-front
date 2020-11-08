import React, { useState } from "react";
import { Loader } from "../../ui/loader";
import { Modal } from "../../ui/Modal";
import { RecipeForm } from "./RecipeForm";


export function Recipes({recipes, getRecipeDetails, ingredients, fetchIngredients, editRecipe, deleteRecipe}){
    return <div className="recipes-container">
        {recipes ? recipes.map(r =><Recipe key={r.id} recipe={r} getRecipeDetails={getRecipeDetails} ingredients={ingredients} fetchIngredients={fetchIngredients} editRecipe={editRecipe} deleteRecipe={deleteRecipe} />) : <div className="center"><Loader /></div>}
    </div>
}


function Recipe({recipe, getRecipeDetails, ingredients, fetchIngredients, editRecipe, deleteRecipe}){
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const handleClick = async function(e){
        e.preventDefault();
        try{
            setLoadingData(true);
            setModalOpen(true);
            await getRecipeDetails(recipe);
            setLoadingData(false)
        }catch(err){
            console.log(err);
            setLoadingData(false);
        }
    }

    return <div id={"recipe-" + recipe.id} className="recipe-card">
        <h3>{recipe.title}</h3>
        <p>{recipe.short}</p>
        <div><button onClick={handleClick} className="btn standard-btn" >Details</button></div>
        {modalOpen && <RecipeDetail loadingData={loadingData} recipe={recipe} ingredients={ingredients} modalOpener={setModalOpen} fetchIngredients={fetchIngredients} editRecipe={editRecipe} deleteRecipe={deleteRecipe} />}
        
    </div>
}

function RecipeDetail({recipe, modalOpener, ingredients, fetchIngredients, loadingData, editRecipe, deleteRecipe }){
    const [editing, setEditing] = useState(false);
    const regex = /\n/gi;

    return <Modal isOpen={modalOpener}>
        {editing ? <EditRecipeForm fetchIngredients={fetchIngredients} ingredients={ingredients} recipe={recipe} editRecipe={editRecipe} /> :
            <>
            <h3>{recipe.title}</h3>
            <p>{recipe.short}</p>
            {loadingData ? <Loader size="medium" color="white" /> :
            
                <>
                    <h4>Ingredients</h4>
                    <ul>
                        {recipe.ingredients.map(i => <li key={i.id}>
                            <p>{i.quantity + (i.unit ? " " + i.unit : "") + " " + i.title}</p>
                        </li>)}
                    </ul>
                    <p dangerouslySetInnerHTML={{__html: recipe.content.replace(regex, "<br/>")}}></p>
                    <div className="edit-button-container">
                        <button className="btn standard-btn" onClick={() => setEditing(true)}>Edit</button>
                        <button className="btn danger-btn" onClick={() => deleteRecipe(recipe)}>DELETE</button>
                    </div>
                </>
            }
        </>}
    </Modal>
}

function EditRecipeForm({recipe, ingredients, fetchIngredients, editRecipe}){
    return <>
        <RecipeForm ingredints={ingredients} recipe={recipe} fetchIngredients={fetchIngredients} editRecipe={editRecipe}/>
    </>
}