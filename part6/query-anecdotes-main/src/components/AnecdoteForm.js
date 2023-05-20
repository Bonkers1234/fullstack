
import { useQueryClient, useMutation } from "react-query"
import { createNew } from "../requests"
import { useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(createNew, {
    onSuccess: (element) => {
      queryClient.invalidateQueries('anecdotes')
      dispatch({ type: 'SET', payload: `anecdote '${element.content}' created!`})
      setTimeout(() => {
        dispatch({ type: 'RESET'})
      }, 5000);
    },
    onError: (error) => {
      dispatch({ type: 'SET', payload: error.response.data.error })
      setTimeout(() => {
        dispatch({ type: 'RESET'})
      }, 5000);
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
