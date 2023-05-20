
import { useDispatch } from "react-redux"
import { initializeAppend } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const NewAnecdote = () => {
    const dispatch = useDispatch()  

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(initializeAppend(content))
        dispatch(setNotification(`'${content}' has been added!`, 5))
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
            <div>
                <input name='anecdote'/>
            </div>
            <button type='submit'>create</button>
            </form>
        </>
    )
}


export default NewAnecdote






