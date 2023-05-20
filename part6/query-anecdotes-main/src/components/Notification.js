
import { useNotificationValue } from "../NotificationContext"

const Notification = () => {
const checkNotification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!checkNotification) return null

  return (
    <div style={style}>
      {checkNotification}
    </div>
  )
}

export default Notification
