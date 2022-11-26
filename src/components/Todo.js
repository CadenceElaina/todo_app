import React, { useState, useRef, useEffect } from "react";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current
}

/* display one of two possible "templates", rather than the single template it's used so far:

-The "view" template, when we are just viewing a todo; this is what we've used in the tutorial thus far.
-The "editing" template, when we are editing a todo. We're about to create this. */

export default function Todo(props) {
    const [isEditing, setEditing] = useState(false)
    const [newName, setNewName] = useState('');
    const editFieldRef = useRef(null);
    const editButtonRef = useRef(null);

    const wasEditing = usePrevious(isEditing);

    function handleChange(e) {
        setNewName(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();
        props.editTask(props.id, newName)
        setNewName('');
        setEditing(false);
    }
    const editingTemplate = (
        <form className="stack-small" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="todo-label" htmlFor={props.id}>
                    New name for {props.name}
                </label>
                <input
                    id={props.id}
                    className="todo-text"
                    type="text"
                    value={newName}
                    onChange={handleChange}
                    ref={editFieldRef}
                />
            </div>
            <div className="btn-group">
                <button
                    type="button"
                    className="btn todo-cancel"
                    onClick={() => setEditing(false)} /* returns user back to "view" template */
                >
                    Cancel
                    <span className="visually-hidden">renaming {props.name}</span>
                </button>
                <button type="submit" className="btn btn__primary todo-edit">
                    Save
                    <span className="visually-hidden">new name for {props.name}</span>
                </button>
            </div>
        </form>
    );
    const viewTemplate = (
        <div className="stack-small">
            <div className="c-cb">
                <input
                    id={props.id}
                    type="checkbox"
                    defaultChecked={props.completed}
                    onChange={() => props.toggleTaskCompleted(props.id)}
                />
                <label className="todo-label" htmlFor={props.id}>
                    {props.name}
                </label>
            </div>
            <div className="btn-group">
                <button
                    type="button"
                    className="btn"
                    onClick={() => setEditing(true)}
                    ref={editButtonRef}
                >
                    Edit <span className="visually-hidden">{props.name}</span>
                </button>
                <button
                    type="button"
                    className="btn btn__danger"
                    onClick={() => props.deleteTask(props.id)}
                >
                    Delete <span className="visually-hidden">{props.name}</span>
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        if (!wasEditing && isEditing) {
            editFieldRef.current.focus(); //React reads the current value of the editFieldRef
            //and moves browser focus to it.
        }
        if (wasEditing && !isEditing) {
            editButtonRef.current.focus();
        }

        /* console.log("side effect");
        console.log("main render"); */
    }, [wasEditing, isEditing]); //with this array as 2nd argument - list of values useEffect() should depend on
    // - useEffect() will only run when one of those values changes. 

    return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>
}