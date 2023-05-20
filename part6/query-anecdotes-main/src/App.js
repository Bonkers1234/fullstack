import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery, useQueryClient, useMutation } from 'react-query'
import { getAll, updateVote } from './requests'

import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateVoteMutation = useMutation(updateVote, {
    onSuccess: (element) => {
      queryClient.invalidateQueries('anecdotes')
      dispatch({ type: 'SET', payload: `anecdote '${element.content}' voted!`})
      setTimeout(() => {
        dispatch({ type: 'RESET' })
      }, 5000);
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    updateVoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery('anecdotes', getAll, {
    refetchOnWindowFocus: false,
    retry: false
  })

  console.log('results',result)

  if (result.isLoading) {
    return <div>Loading data, please stand by...</div>
  } else if (result.isError) {
    return <div><h2>anecdote service not available due to problems in server</h2></div>
  }

  const anecdotes = result.data


  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
