import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const NavBar = () => {
  const padding = {
    paddingRight: 5,
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Nav className="me-auto">
          <Link className="navbar-brand link-primary" style={padding} to="/">
            blogs
          </Link>
          <Link
            className="navbar-brand link-primary"
            style={padding}
            to="/users"
          >
            users
          </Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default NavBar
