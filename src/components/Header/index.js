import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <ul className="nav-content">
        <li className="link-item">
          <Link className="route-link" to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="login-website-logo-desktop-image"
              alt="website logo"
            />
          </Link>
        </li>

        <li className="topic-link-item">
          <Link className="route-link" to="/">
            <h1>Home</h1>
          </Link>

          <Link className="route-link" to="/jobs">
            <h1>Jobs</h1>
          </Link>
        </li>

        <li className="link-item">
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
