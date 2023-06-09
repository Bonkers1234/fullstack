import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = ({ usersData }) => {
  if (usersData.isLoading) {
    return <div>Please wait while data is loading...</div>
  } else if (usersData.isError) {
    return <div>Error fetching data from server!</div>
  }

  const users = usersData.data

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <th>Name</th>
            <th>blogs created</th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
