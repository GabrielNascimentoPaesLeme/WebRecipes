import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { RecipeContext } from "../context/ContextRecipes";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import { FaHeart, FaSun, FaMoon } from "react-icons/fa";
import logoLight from "../assets/logoReceitaLight.png";
import logoDark from "../assets/logoReceitaDark.png";

import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, state } = useContext(RecipeContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(`/search?q=${search}`);
  };

  return (
    <div>
      <Navbar className={`${theme === "light" ? "light" : "dark"}`} expand="lg">
        <Container>
          <Navbar.Brand>
            <NavLink
              to={"/"}
              className={`text-${theme === "light" ? "dark" : "light"}`}
            >
              <img
                src={`${theme === "light" ? logoLight : logoDark}`}
                alt="Receitas da Dail"
                style={{ height: "50px", fill: "white" }} // Ajuste o tamanho da logo conforme necessário
              />
            </NavLink>
          </Navbar.Brand>

          <Form
            className="d-flex me-auto ms-auto"
            onSubmit={(e) => handleSearch(e)}
          >
            <FormControl
              type="search"
              placeholder="Pesquise pelo nome, descrição ou ingrediente."
              className="me-2"
              aria-label="Search"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              Buscar
            </Button>
          </Form>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {state.isAuthenticated ? (
                <Dropdown style={{ display: "flex" }}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Olá, {state.user.username}!
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <NavLink to={"/criacao"}>Criar receita</NavLink>
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <a onClick={handleLogout}>Logout</a>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link>
                    <NavLink
                      to={"/login"}
                      className={`text-${theme === "light" ? "dark" : "light"}`}
                    >
                      Login
                    </NavLink>
                  </Nav.Link>
                  <Nav.Link>
                    <NavLink
                      to={"/register"}
                      className={`text-${theme === "light" ? "dark" : "light"}`}
                    >
                      Registre-se
                    </NavLink>
                  </Nav.Link>
                </>
              )}

              <div className="d-flex align-items-center ms-3">
                <div
                  role="button"
                  onClick={toggleTheme}
                  className="theme-icon d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <FaSun fill={"#dfdd82"} />
                  <FaMoon fill={"#1759a0"} />
                </div>
                <div className={`ball ball-${theme}`}></div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
