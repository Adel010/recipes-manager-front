import React, { useRef, useState, memo } from "react";
import { Loader } from "../../ui/loader";
import PropTypes from "prop-types";
import { ApiErrors } from "../../funcs/fetchApi";

export function Ingredients({ingredients, onDelete, addNewIngredient, onEdit}){
    
    return <div>
        <h1>Ingredients</h1>
        {ingredients ? 
        <ul className="ingredients-list">
            {ingredients.map(i => <Ingredient key={i.id} ingredient={i} onDelete={onDelete} onEdit={onEdit}/>)}
        </ul>
        : <Loader />}
        <AddIngredient ingredients={ingredients} fetchAndAddToState={addNewIngredient}/>
    </div>
}

Ingredients.propTypes = {
    ingredients: PropTypes.array
}

const Ingredient = memo(function({ingredient, onDelete, onEdit}){
    const [loadingDel, setLoadingDel] = useState(false);
    const [editing, setEditing] = useState(false);
    const [titleValue, setTitleValue] = useState(ingredient.title || "");
    const [unitValue, setUnitValue] = useState(ingredient.unit || "");
    const [editErr, setEditErr] = useState(null);
    const editFormRef = useRef(null);
    const [editLoading, setEditLoading] = useState(false);

    const handleInputChange = function(e){
        if(e.target.name === "title"){
            setTitleValue(e.target.value);
            setEditErr(false)
        }else{
            setUnitValue(e.target.value)
        }
    }
    const hadndeleDelete = async function(event){
        event.preventDefault();
        setLoadingDel(true);
        await onDelete(ingredient);
    }
    const handleEdit = async function (){
        if(editing){
            const data = new FormData(editFormRef.current);
            let editedIngredient = {...ingredient};
            for(let entrie of data){
                editedIngredient = {...editedIngredient, [entrie[0]]:entrie[1]}
            }
            try{
                setEditLoading(true);
                await onEdit(ingredient,editedIngredient);
                setEditing(false);
            }catch(err){
                setEditLoading(false);
                setEditing(true);
                console.log(err);
                setEditErr( () => {
                    if(err.errors[0].rule === "unique"){
                        return (editedIngredient.title + " already exists")
                    }else{
                        return err.errors[0].message
                    }
                })
            }
            setEditLoading(false)
        }else{
            setEditing(true)
        }
    }

    return <li><div className="ingredient-content">{editing ? <div className="edit-ingredient form-container"><form className="edit-ingredient-form" ref={editFormRef} onSubmit={handleEdit}><label htmlFor={"edit-ingredient-title-" + ingredient.id}>Title</label><input className={editErr && "input-error"} type="text" name="title" id={"edit-ingredient-title-" + ingredient.id} value={titleValue} onChange={handleInputChange} /><label htmlFor={"edit-ingredient-unit-" + ingredient.id}>Unit</label><input type="text" name="unit" id={"edit-ingredient-unit-" + ingredient.id} value={unitValue} onChange={handleInputChange}/></form>{editErr && <div className="edit-error-message">{editErr}</div>}</div> : ingredient.title}</div><div className="btn-groupe"><button className={editing ? "btn confirm-btn" :"btn standard-btn"} onClick={() => handleEdit()}>{editing && editLoading ? <Loader size="small" color="white" /> : editing ? "Save" : "Edit"}</button><button className="btn danger-btn" onClick={hadndeleDelete} disabled={loadingDel}>{loadingDel? <Loader size="small" color="white"/> : "X"}</button></div></li>
});

const AddIngredient = memo(function ({ingredients, fetchAndAddToState}){
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async function(event){
        setLoading(true);
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
            event.target.reset();
        }catch(err){
            if(err instanceof ApiErrors  && err.responsStatus === 422){
                setError("over-write")
            }else{
                setError("Server connexion error.");
            }
        }
        setLoading(false)

    }
    function handleTitleChange(){
        if(error === "over-write"){
            setError(null)
        }
    }
    return <div className="form-container">
        <h3>Add new ingredient</h3>
        <form onSubmit={handleSubmit} className="add-ingredient-form">
            <label htmlFor="ingredient-name">Title</label>
            <input type="text" name="title" id="ingredient-name" onChange={handleTitleChange} className={error && "input-error"} required/>
            <label htmlFor="ingredient-unit">Unit</label>
            <input type="text" name="unit" id="ingredient-unit" />
            <button type="submit" className="btn standard-btn">{loading ? <Loader size="small" color="white" /> : "ADD"}</button>
            {error === "over-write" ? <div className="error-message"><p>Ingredient already exists.</p></div>
            : error ? <div className="error-message"><p>{error}</p></div>
            : ""}
        </form>
    </div>
})

// function EditIngredient ({ingredient}){
//     const [titleValue, setTitleValue] = useState(ingredient.title);
//     const [unitValue, setUnitValue] = useState(ingredient.unit);
//     const editFormRef = useRef(null);

//     const handleChange = function(e){
//         if(e.target.name === "title"){
//             setTitleValue(e.target.value)
//         }else{
//             setUnitValue(e.target.value)
//         }
//     }
    
//     return <div className="edit-ingredient form-container">
//         <form className="edit-ingredient-form" ref={editFormRef}>
//             <label htmlFor={"edit-ingredient-title-" + ingredient.id}>Title</label>
//             <input type="text" name="title" id={"edit-ingredient-title-" + ingredient.id} value={titleValue} onChange={handleChange}/>
//             <label htmlFor={"edit-ingredient-unit-" + ingredient.id}>Unit</label>
//             <input type="text" name="unit" id={"edit-ingredient-unit-" + ingredient.id} value={unitValue} onChange={handleChange}/>
//         </form>
//     </div>
// }