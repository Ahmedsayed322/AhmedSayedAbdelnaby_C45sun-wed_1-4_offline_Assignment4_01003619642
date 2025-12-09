const fs = require('fs/promises');
const crypto = require('crypto');
const path = require('path');
const port = 3000;
const express = require('express');
const app = express();
const usersFile = path.resolve('users.json');
//////////////////////////////////////////////////////////////////
//middlewares
const checkUser = async (req, res, next) => {
  const data = await readFile();

  if (req.body.email) {
    const { email } = req.body;
    checkUserExists = data.find((rec) => rec.email === email.trim());
    if (checkUser) {
      req.user = checkUserExists;
    }
  }
  next();
};
app.use(express.json());
//////////////////////////////////////////////////////////////////
//helpers
const readFile = async () => {
  return await fs
    .readFile(usersFile)
    .then((data) => JSON.parse(data))
    .catch(() => []);
};
const writeFile = async (data) => {
  await fs
    .writeFile(usersFile, JSON.stringify(data))
    .catch((e) => console.log(e));
};

////////////////////////////////////////////////////////////////////
// (async () => {
//   const data = await readFile();
//  await  writeFile(data);
// })();
////////////////////////////////////////////////////////////////////
//1-Add User
app.post('/user', checkUser, async (req, res, next) => {
  try {
    const loadData = await readFile();
    const { name, age, email } = req.body;
    const id = crypto.randomUUID();
    if (!name.trim() || !age.toString().trim() || !email.trim()) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!email.includes('@') || !email.includes('.com')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (age < 5 || age > 100) {
      return res.status(400).json({ message: 'Invalid age' });
    }
    if (req.user) {
      return res.status(409).json({ message: 'User already exists' });
    }
    loadData.push({ id, email: email.trim(), name, age });
    await writeFile(loadData);
    return res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'error occurred' });
  }
});
////////////////////////////////////////////////////////////////////
//2-edit user
app.patch('/user/:id', checkUser, async (req, res, next) => {
  try {
    let data = await readFile();
    const changes = req.body;
    const { id } = req.params;
    let userIndex = await data.findIndex((ele) => ele.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'user not found' });
    }
    let updates = '';
    for (key in changes) {
      updates += key + ',';
      if (!changes[key].trim()) {
        return res.status(400).json({ message: `${key} Can not be empty` });
      }
      if (key === 'email') {
        if (req.user) {
          return res.status(409).json({ message: 'User email already exist' });
        }
        if (!changes.email.includes('@') || !changes.email.includes('.com')) {
          return res.status(400).json({ message: 'Invalid email format' });
        }
      }
      if (key === 'age') {
        if (changes.age < 5 || changes.age > 100) {
          return res.status(400).json({ message: 'Invalid age' });
        }
      }
    }
    data[userIndex] = {
      ...data[userIndex],
      ...changes,
    };
    await writeFile(data);
    res.status(200).json({
      message: `user ${updates.substring(
        0,
        updates.length - 1,
      )} updated successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: 'error occurred' });
  }
});
////////////////////////////////////////////////////////////////////
//3-delete user by id
app.delete('/user/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await readFile();
    const checkUser = await data.findIndex((ele) => ele.id === id);
    if (checkUser === -1) {
      return res.status(404).json({ message: 'user ID not found' });
    }
    data.splice(checkUser, 1);
    writeFile(data);
    res.status(201).json({ message: 'user deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'error occurred' });
  }
});
////////////////////////////////////////////////////////////////////
//4-get user by name
app.get('/user/getByName', async (req, res, next) => {
  try {
    const data = await readFile();
    const { name } = req.query;
    const user = await data.find((ele) => ele.name == name);
    if (!user) {
      return res.status(404).json({ message: 'user name not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'error occurred' });
  }
});
////////////////////////////////////////////////////////////////////
//5-get all users
app.get('/user', async (req, res, next) => {
  try {
    res.status(200).sendFile(usersFile);
  } catch (err) {
    res.status(500).json({ error: 'error occurred' });
  }
});
////////////////////////////////////////////////////////////////////
//-6 filter on age
app.get('/user/filter', async (req, res, next) => {
  try {
    const data = await readFile();
    const { minAge } = req.query;
    const users = await data.filter((ele) => ele.age >= minAge);
    if (!users.length) {
      return res.status(404).json({ message: 'no user found' });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'error occurred' });
  }
});
/////////////////////////////////////////////////////////////////////
//-7
app.get('/user/:id', async (req, res, next) => {
  try {
    const data = await readFile();
    const { id } = req.params;
    const user = await data.find((ele) => ele.id === id);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'error occurred' });
  }
});
/////////////////////////////////////////////////////////////////////
app.all('{/*cici}', (req, res) => {
  res.send('t7ya masr');
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
