import {ModelsList} from "./pages/ModelsList.jsx";
import {Link, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {Login} from "./pages/Login.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import {PageNotFound} from "./pages/PageNotFound.jsx";
import {ModelDetails} from "./pages/ModelDetails.jsx";
import {ModelEdit} from "./pages/ModelEdit.jsx";
import {ModelAdd} from "./pages/ModelAdd.jsx";
import './App.css';

function App() {

  return <Router>
              <div>
                  <nav>
                      <div className="nav-wrapper" style={{backgroundColor: '#ff6e40'}}>
                          <Link to="/" className="brand-logo center">Modèles</Link>
                      </div>
                  </nav>
                  <Routes>
                      <Route exact path="/" element={
                          <PrivateRoute>
                              <ModelsList />
                          </PrivateRoute>
                      }/>
                      <Route exact path="/login" element={<Login />} />
                      <Route exact path="/models" element={
                          <PrivateRoute>
                              <ModelsList />
                          </PrivateRoute>
                      }/>
                      <Route path="/models/:id" element={
                          <PrivateRoute>
                              <ModelDetails />
                          </PrivateRoute>
                      }/>
                      <Route path="models/edit/:id" element={
                          <PrivateRoute role="ROLE_ADMIN">
                              <ModelEdit />
                          </PrivateRoute>
                      }/>
                      <Route path="model/add" element={
                          <PrivateRoute role="ROLE_ADMIN">
                              <ModelAdd />
                          </PrivateRoute>
                      }/>
                      <Route path="*" element={<PageNotFound />} />
                  </Routes>
              </div>
        </Router>
}

export default App
