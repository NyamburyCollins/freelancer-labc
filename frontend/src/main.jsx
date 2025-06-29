// src/Main.jsx
import React, { useEffect, useState } from 'react';

const Main = () => {
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);

  // Fetch users and skills from the Flask backend
  useEffect(() => {
    // Fetch Users
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Users:', data);
        setUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));

    // Fetch Skills
    fetch('/api/skills')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Skills:', data);
        setSkills(data);
      })
      .catch(error => console.error('Error fetching skills:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="mb-8">
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.id} className="mb-2">{user.name}</li>
          ))
        ) : (
          <li>No users found.</li>
        )}
      </ul>

      <h1 className="text-2xl font-bold mb-4">Skills</h1>
      <ul>
        {skills.length > 0 ? (
          skills.map(skill => (
            <li key={skill.id} className="mb-2">{skill.name}</li>
          ))
        ) : (
          <li>No skills found.</li>
        )}
      </ul>
    </div>
  );
};

export default Main;

