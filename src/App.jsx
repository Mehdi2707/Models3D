import {ModelsList} from "./pages/ModelsList.jsx";
import {Route, BrowserRouter as Router, Routes, Link} from "react-router-dom";
import {Login} from "./pages/Login.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import {PageNotFound} from "./pages/PageNotFound.jsx";
import {ModelDetails} from "./pages/ModelDetails.jsx";
import {ModelEdit} from "./pages/ModelEdit.jsx";
import {ModelAdd} from "./pages/ModelAdd.jsx";
import {Navbar} from "./components/Navbar.jsx";
import './App.css';
import { Register } from "./pages/Register.jsx";
import { useState } from "react";
import { checkTokenAuthentication } from "./helpers/checkTokenAuthentication.js";
import { Logout } from "./components/Logout.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(checkTokenAuthentication());

    return <Router>
                <div>
                    <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                    <Routes>
                        <Route exact path="/" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <ModelsList />
                            </PrivateRoute>
                        }/>
                        <Route exact path="/models/tag/:tag" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <ModelsList />
                            </PrivateRoute>
                        }/>
                        <Route exact path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route exact path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
                        <Route exact path="/logout" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Logout setIsAuthenticated={setIsAuthenticated} />
                            </PrivateRoute>
                        } />
                        <Route exact path="/models" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <ModelsList />
                            </PrivateRoute>
                        }/>
                        <Route path="/models/:id" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <ModelDetails />
                            </PrivateRoute>
                        }/>
                        <Route path="models/edit/:id" element={
                            <PrivateRoute isAuthenticated={isAuthenticated} role="ROLE_ADMIN">
                                <ModelEdit />
                            </PrivateRoute>
                        }/>
                        <Route path="model/add" element={
                            <PrivateRoute isAuthenticated={isAuthenticated} role="ROLE_ADMIN">
                                <ModelAdd />
                            </PrivateRoute>
                        }/>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
        </Router>
}

export default App
