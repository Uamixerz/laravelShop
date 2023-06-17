import { Link } from 'react-router-dom';
import './DefaultHeader.css';
import { useDispatch, useSelector } from 'react-redux';
import { AuthUserActionType, IAuthUser } from '../../auth/types';
import http from '../../../http';
import { APP_ENV } from '../../../env';

const DefaultHeader = () => {
  const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
  const dispatch = useDispatch();
  const LogOut = () => {
    delete http.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    dispatch({ type: AuthUserActionType.LOGOUT_USER });
  }

  return (
    <>

      <header data-bs-theme="dark">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Магазин
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Головна
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/categories/create">
                    Створити категорію
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/products/create">
                    Створити товар
                  </Link>
                </li>
              </ul>

              <ul className='navbar-nav'>
                {isAuth ? (
                  <>
                    <li className="nav-item">
                      <img src={`${APP_ENV.BASE_URL}storage/uploads/${user?.image}`} alt="Фотка" width={50} />
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" aria-current="page" to="/profile">
                        {user?.email}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" onClick={LogOut} aria-current="page" to="/">
                        Вихід
                      </Link>
                    </li>
                  </>
                ) :
                  (
                    <>


                      <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/login">
                          Вхід
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/register">
                          Реєстрація
                        </Link>
                      </li>
                    </>
                  )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default DefaultHeader;