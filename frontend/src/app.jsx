import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Fetch users
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoadingUsers(false);
      });
  }, []);

  // Fetch skills
  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setLoadingSkills(false);
      })
      .catch(err => {
        console.error('Error fetching skills:', err);
        setLoadingSkills(false);
      });
  }, []);

  // Handle user form submission
  const handleUserSubmit = (e) => {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setUsers([...users, data.user]); // Update user list
        setUsername('');
        setEmail('');
      })
      .catch(err => console.error('Error creating user:', err));
  };

  // Handle skill form submission
  const handleSkillSubmit = (e) => {
    e.preventDefault();
    fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: skillName, description: skillDescription }),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setSkills([...skills, data.skill]); // Update skill list
        setSkillName('');
        setSkillDescription('');
      })
      .catch(err => console.error('Error creating skill:', err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Freelancer SkillHub</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* User Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <form onSubmit={handleUserSubmit} className="mb-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="border p-2 mr-2 mb-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 mr-2 mb-2"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
          </form>

          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <ul className="list-disc pl-5">
              {users.map(user => (
                <li key={user.id}>
                  {user.username} ({user.email})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Skill Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <form onSubmit={handleSkillSubmit} className="mb-6">
            <input
              type="text"
              placeholder="Skill Name"
              value={skillName}
              onChange={e => setSkillName(e.target.value)}
              className="border p-2 mr-2 mb-2"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={skillDescription}
              onChange={e => setSkillDescription(e.target.value)}
              className="border p-2 mr-2 mb-2"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Skill</button>
          </form>

          {loadingSkills ? (
            <p>Loading skills...</p>
          ) : (
            <ul className="list-disc pl-5">
              {skills.map(skill => (
                <li key={skill.id}>
                  {skill.name} - {skill.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
