const User = ({ id, usersData }) => {
  if (usersData.isLoading) {
    return <div>Please wait while data is loading...</div>
  } else if (usersData.isError) {
    return <div>Error fetching data from server!</div>
  }

  const user = usersData.data.find((object) => object.id === id)

  if (!user) {
    return <div>Sorry could not find the user...</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs:</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
