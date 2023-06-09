import { useNotificationValue } from '../contexts/GeneralContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const message = useNotificationValue()
  if (!message) {
    return
  }

  const style = message.type === 'error' ? 'danger' : 'success'

  return <Alert variant={style}>{message.text}</Alert>
}

export default Notification
