import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import './App.css';  // Make sure to import your new CSS file

const API_URL = 'http://172.205.200.116:5000/users';

function App() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '' });
  const [isEdit, setIsEdit] = useState(false);

  const fetchUsers = async () => {
    const response = await axios.get(API_URL);
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShow = (user = { id: null, name: '', email: '' }) => {
    setCurrentUser(user);
    setIsEdit(!!user.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser({ id: null, name: '', email: '' });
  };

  const handleSave = async () => {
    if (isEdit) {
      await axios.put(`${API_URL}/${currentUser.id}`, currentUser);
    } else {
      await axios.post(API_URL, currentUser);
    }
    fetchUsers();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Management</h1>
        <Button variant="primary" onClick={() => handleShow()}>
          Add New User
        </Button>
      </header>

      <div className="user-cards">
        {users.map((user) => (
          <div className="card" key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <div className="card-actions">
              <Button variant="outline-primary" onClick={() => handleShow(user)}>
                Edit
              </Button>
              <Button variant="outline-danger" onClick={() => handleDelete(user.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
