
import { createSlice } from "@reduxjs/toolkit"
import anecdoteServices from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteUp(state, action) {
      const anecdote = action.payload
      return state.map(a =>
        a.id !== anecdote.id ? a : anecdote
      )
    },
    createAnecdote(state, action) {
        state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteUp, createAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteServices.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const initializeAppend = (content) => {
  return async dispatch => {
    const anecdoteNew = await anecdoteServices.createNew(content)
    dispatch(createAnecdote(anecdoteNew))
  }
}

export const initializeVote = (anecdote) => {
  return async dispatch => {
    const anecdoteToChange = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdoteChanged = await anecdoteServices.addVote(anecdoteToChange)
    dispatch(voteUp(anecdoteChanged))
  }
}

export default anecdoteSlice.reducer

