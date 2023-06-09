
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.message)
  if (!message.text) {
    return
  }

  const style = {
    color: message.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style} className='notification'>
      {message.text}
    </div>
  )
}


export default Notification

