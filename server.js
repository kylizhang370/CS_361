// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from 'public', 'js', and 'css' directories
app.use(express.static('public'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'S3cur3*P@55w0rD_!',
  database: 'my_database',
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

app.get('/api/goals', (req, res) => {
  db.query('SELECT * FROM goals', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/api/records', (req, res) => {
    db.query('SELECT SUM(complete_goal) AS completed_goals, SUM(incomplete_goal) AS incomplete_goals FROM record', (err, results) => {
      if (err) throw err;
      // Send a response with a status code of 200 and the count of completed and incomplete goals as the body
      res.status(200).send({ completed_goals: results[0].completed_goals || 0, incomplete_goals: results[0].incomplete_goals || 0 });
    });
  });
  

app.post('/api/goals', (req, res) => {
  const { goal, start_day } = req.body;
  const query = 'INSERT INTO goals (goal, start_day) VALUES (?, ?)';
  db.query(query, [goal, start_day], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ status: 'success', message: 'Goal added.' });
  });
});

app.post('/api/goals/:goalId/complete', (req, res) => {
    const { goalId } = req.params;

    db.beginTransaction((err) => {
        if (err) {
            throw err;
        }

        const deleteGoalQuery = 'DELETE FROM goals WHERE goal_id = ?';
        db.query(deleteGoalQuery, [goalId], (err, deleteResult) => {
            if (err) {
                return db.rollback(() => {
                    throw err;
                });
            }

            const updateRecordQuery = 'INSERT INTO record (complete_goal, incomplete_goal) VALUES (?, 0) ON DUPLICATE KEY UPDATE complete_goal = complete_goal + 1';
            db.query(updateRecordQuery, [deleteResult.affectedRows], (err, updateResult) => {
                if (err) {
                    return db.rollback(() => {
                        throw err;
                    });
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            throw err;
                        });
                    }

                    console.log(`Goal with goal_id ${goalId} deleted from goals table and ${deleteResult.affectedRows} record added to the record table.`);
                    res.sendStatus(200);
                });
            });
        });
    });
});

app.post('/api/goals/:goalId/incomplete', (req, res) => {
    const { goalId } = req.params;
  
    db.beginTransaction((err) => {
      if (err) throw err;
  
      const updateRecordQuery = 'INSERT INTO record (complete_goal, incomplete_goal) VALUES (0, 1) ON DUPLICATE KEY UPDATE incomplete_goal = incomplete_goal + 1';
      db.query(updateRecordQuery, (err, results) => {
        if (err) {
          return db.rollback(() => {
            throw err;
          });
        }
  
        const deleteGoalQuery = 'DELETE FROM goals WHERE goal_id = ?';
        db.query(deleteGoalQuery, [goalId], (err, results) => {
          if (err) {
            return db.rollback(() => {
              throw err;
            });
          }
  
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                throw err;
              });
            }
  
            console.log('Goal deleted and record updated.');
            res.sendStatus(200);
          });
        });
      });
    });
  });
  
  app.delete('/api/goals/:goalId', (req, res) => {
    const { goalId } = req.params;
    console.log(`Received delete request for goalId: ${goalId}`);
  
    db.query('DELETE FROM goals WHERE goal_id = ?', [goalId], (err, result) => {
      if (err) {
        return db.rollback(() => {
          throw err;
        });
      }
  
      console.log(`Deleted goal with goal_id: ${goalId}`);
  
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            throw err;
          });
        }
  
        console.log('Transaction committed.');
        res.sendStatus(200);
      });
    });
  });  
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  
