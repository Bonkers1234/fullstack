
import { useState } from 'react'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Statistic = (props) => {
  return (
    <div>
      has {props.stat} votes
    </div>
  )
}

const Most = ({anecdotes, votes}) => {
  let temp = 0;
  let index = 0;
  for(let i = 0; i < votes.length; i++){
    if(temp <= votes[i]){
      temp = votes[i];
      index = i;
    }
  }
  return (
    <div>
      <h2>Anecdote with most votes</h2>
      {anecdotes[index]}
      <Statistic stat={votes[index]} />
    </div>
  )
}

const Random = ({anecdote, votes}) => {
  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdote}
      <Statistic stat={votes} />
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(8).fill(0))

  const changeAnecdote = () => setSelected(getRandomInt(0, 7))
  const anecdoteVote = () => {
    const copy = [...votes];

    copy[selected] += 1;
    setVotes(copy);
  }
  
  return (
    <div>
      <Random anecdote={anecdotes[selected]} votes={votes[selected]} />
      <br></br>
      <Button handleClick={anecdoteVote} text="Vote" />
      <Button handleClick={changeAnecdote} text="Next anecdote" />
      <Most anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App