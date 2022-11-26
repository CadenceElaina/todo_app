import React, { useState } from "react";


function Form(props) {
    const [name, setName] = useState("");
    function handleChange(e) {
        setName(e.target.value);
        /*   console.log("you are typing right?") */
        /*  console.log(e.target.value); */
    }
    /* Note: One thing you'll notice is that you are able to submit empty tasks by just pressing the Add button without entering a task name. Can you think of a way to disallow empty tasks from being added? As a hint, you probably need to add some kind of check into the handleSubmit() function.*/
    function handleSubmit(e) {
        e.preventDefault();
        if (name === '') {
            alert('You cannot add empty tasks!');

        }
        else {
            props.addTask(name);
        }
        setName('')//sets the input back to empty string on submit
        /* alert("yooooooooooo"); */
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="label-wrapper">
                <label htmlFor="new-todo-input" className="label__lg">
                    What needs to be done?
                </label>
            </h2>
            <input
                type="text"
                id="new-todo-input"
                className="input input__lg"
                name="text"
                autoComplete="off"
                value={name}
                onChange={handleChange}
            />
            <button type="submit" className="btn btn__primary btn__lg">
                Add
            </button>
        </form>
    );
}

export default Form;