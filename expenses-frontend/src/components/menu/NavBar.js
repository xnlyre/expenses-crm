import "../../css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import socket from "../../http/socket";
import api from "../../http/axios";
import { Navbar, Nav, Form, FormControl, Container } from "react-bootstrap";

function SearchBar(props) {
  const [eurBalance, setEurBalance] = useState(0);
  const [mdlBalance, setMdlBalance] = useState(0);
  const [tasksNumber, setTasksNumber] = useState(0);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  function Logout() {
    localStorage.setItem("jwt", "");
    navigate("/");
  }

  const reloadPage = () => {
    setReload(!reload);
  };

  useEffect(() => {
    api.get(`/auth/users/${localStorage.getItem("userId")}`).then((res) => {
      setEurBalance(parseFloat(res.data.user.eurBalance).toFixed(2));
      setMdlBalance(parseFloat(res.data.user.mdlBalance).toFixed(2));
      console.log(res.data);
    });
  });

  useEffect(() => {
    api
      .get("/tasks?seen=false", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      })
      .then((res) => {
        setTasksNumber(res.data.count);
      });
    socket.on("reload-page", () => {
      reloadPage();
    });
  }, [socket, reload]);

  return (
    <Navbar bg="dark" variant="dark" style={{ zIndex: 3 }}>
      <Container fluid>
        <Navbar.Brand>EXPENSES CRM</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link href="/profile">
              <FontAwesomeIcon icon={faUser} />
            </Nav.Link>
            <Nav.Link href="/tasks" className="pe-0">
              <FontAwesomeIcon icon={faBell} />
            </Nav.Link>
            {tasksNumber > 0 ? (
              <Navbar.Text>
                <button
                  style={{
                    borderRadius: "50%",
                    width: "15px",
                    height: "15px",
                    fontSize: "8px",
                    backgroundColor: "red",
                    color: "white",
                    border: 0,
                  }}
                  className=""
                >
                  {tasksNumber}
                </button>
              </Navbar.Text>
            ) : null}
            <Navbar.Text className="ms-5">
              EUR balance: {eurBalance}
            </Navbar.Text>
            <Navbar.Text className="ms-5">
              MDL balance: {mdlBalance}
            </Navbar.Text>
          </Nav>
          <Nav></Nav>
          <Form className="d-flex me-5">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={(e) => props.changeSearch(e.target.value)}
            />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SearchBar;

{
  /* <header
      className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow"
      style={{ zIndex: 2 }}
    >
      <a
        className="navbar-brand col-md-3 col-lg-2 me-0 px-3"
        style={{ paddingTop: "10px", paddingBottom: "8px" }}
        href="#"
      >
        REACTOR
      </a>
      <button
        className="navbar-toggler position-absolute d-md-none collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <input
        id="search_input"
        className="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
        onChange={(e) => props.changeSearch(e.target.value)}
      />
      <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          <a className="nav-link px-3" onClick={() => Logout}>
            Sign out
          </a>
        </div>
      </div>
    </header> */
}
