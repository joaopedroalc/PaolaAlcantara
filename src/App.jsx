import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import HomeConsultas from "./pages/HomeConsultas";
import AddEdit from "./pages/AddEdit";
import AddEditConsultas from "./pages/AddEditConsultas";
import View from "./pages/View";
import ViewConsultas from "./pages/ViewConsultas";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./context/UserContext";

function App({ setUser, infosUser }) {
  return (
    <UserContext.Provider value={{ infosUser }}>
      <BrowserRouter>
        <div className='App'>
          <Header setUser={setUser} infosUser={infosUser} />
          <ToastContainer position='top-center' />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/homeconsultas/:id' component={HomeConsultas} />
            <Route path='/add' component={AddEdit} />
            <Route path='/update/:id' component={AddEdit} />
            <Route path='/consultas/:id' component={AddEditConsultas} />
            <Route
              path='/updateconsultas/:idconsultas'
              component={AddEditConsultas}
            />
            <Route path='/view/:id' component={View} />
            <Route path='/viewconsultas/:id' component={ViewConsultas} />
          </Switch>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
