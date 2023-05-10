
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
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

Notification.propTypes = {
  message: PropTypes.object.isRequired
}


export default Notification

