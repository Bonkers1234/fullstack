import { useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h1>{props.header}</h1>
    </div>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>
       {text} 
      </td>
      <td>
       {value}
      </td>
    </tr>
  )
}

const Statistics = (props) => {
  if (isNaN(props.content.positive)){
    return (
      <p>
        No feedback given
      </p>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text={props.content.parts[0].text} value={props.content.parts[0].value} />
        <StatisticLine text={props.content.parts[1].text} value={props.content.parts[1].value} />
        <StatisticLine text={props.content.parts[2].text} value={props.content.parts[2].value} />
        <StatisticLine text="All" value={props.content.total} />
        <StatisticLine text="Average" value={props.content.average} />
        <StatisticLine text="Positive" value={`${props.content.positive} %`} />
      </tbody>
    </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good * 100) / total

  const feedbackGood = () => setGood(good + 1);
  const feedbackNeutral = () => setNeutral(neutral + 1);
  const feedbackBad = () => setBad(bad + 1);

  const main = {
    header: "give feedback",
    stats: "statistics",
    total: total,
    average: average,
    positive: positive,
    parts: [
      {
        text: "Good",
        value: good
      },
      {
        text: "Neutral",
        value: neutral
      },
      {
        text: "Bad",
        value: bad
      }
    ]
  }

  return (
    <div>
      <Header header={main.header} />
      <Button handleClick={feedbackGood} text={main.parts[0].text} />
      <Button handleClick={feedbackNeutral} text={main.parts[1].text} />
      <Button handleClick={feedbackBad} text={main.parts[2].text} />
      <Header header={main.stats} />
      <Statistics content={main} />
    </div>
  )
}

export default App