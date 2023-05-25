function filterGoals(filter) {
    const goals = document.querySelectorAll('#todo li');
    goals.forEach(goal => {
      switch (filter) {
        case 'complete':
          if (goal.querySelector('input').checked) {
            goal.style.display = 'flex';
          } else {
            goal.style.display = 'none';
          }
          break;
        case 'incomplete':
          if (!goal.querySelector('input').checked) {
            goal.style.display = 'flex';
          } else {
            goal.style.display = 'none';
          }
          break;
        default:
          goal.style.display = 'flex';
      }
    });
  }
  
  function markAsDone(goal) {
    goal.querySelector('.progress-bar').style.width = '100%';
    goal.querySelector('.percentage').textContent = '100%';
  }
  
  function addGoal(goal) {
    const goalList = document.getElementById('goals-list');
    const li = document.createElement('li');
    li.id = `goal-${goal.goal_id}`; // Updated to use 'goal_id' instead of 'id'
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.value = goal.goal_id; // Updated to use 'goal_id' instead of 'id'
  
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(`${goal.goal} - ${goal.start_day}`));
    goalList.appendChild(li);
  }
  
  async function fetchGoals() {
    try {
      document.getElementById('goals-list').innerHTML = '';
      const response = await fetch('http://localhost:3000/api/goals');
      const goals = await response.json();
      goals.forEach((goal) => {
        addGoal(goal);
      });
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }
  
  async function fetchRecords() {
    try {
      const response = await fetch('http://localhost:3000/api/records');
      const data = await response.json();
      document.getElementById('completed-count').textContent = data.completed_goals;
      document.getElementById('incomplete-count').textContent = data.incomplete_goals; // Add this line
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  }
  
  async function markAsComplete(goalId) {
    const response = await fetch(`http://localhost:3000/api/goals/${goalId}/complete`, {
      method: 'POST'
    });
  
    if (!response.ok) {
      alert('Failed to mark goal as complete.');
      return;
    }
  
    // Ensure records are fetched after the goal is marked as complete.
    await fetchRecords();
  }
  
  async function markAsIncomplete(goalId) {
    const response = await fetch(`http://localhost:3000/api/goals/${goalId}/incomplete`, {
      method: 'POST'
    });
  
    if (!response.ok) {
      alert('Failed to mark goal as incomplete.');
      return;
    }
  
    // Ensure records are fetched after the goal is marked as incomplete.
    await fetchRecords();
  }  
  
  async function deleteGoal(goalId) {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: 'DELETE'
    });
  
    if (!response.ok) {
      alert('Failed to delete goal.');
      return;
    }
  
    await fetchGoals();
  }
  
  fetch('/api/goals/complete')
    .then(response => response.json())
    .then(data => {
      const completedCountElement = document.getElementById('completed-count');
      completedCountElement.textContent = data.completed_goals;
    })
    .catch(error => console.error('Error:', error));
  
  
  window.onload = function () {
    fetchGoals();
    fetchRecords();
  
    document.getElementById('complete-btn').addEventListener('click', async function () {
      const checkedGoals = document.querySelectorAll('#goals-list input:checked');
      for (const goal of checkedGoals) {
        const response = await markAsComplete(goal.value);
        if (response) {
          goal.parentElement.remove();
        }
      }
      // Refresh after all goals have been processed
    fetchGoals();
    fetchRecords();
  });

  document.getElementById('incomplete-btn').addEventListener('click', async function () {
    const checkedGoals = document.querySelectorAll('#goals-list input:checked');
    for (const goal of checkedGoals) {
      await markAsIncomplete(goal.value);
      goal.parentElement.remove();
    }
    // Refresh after all goals have been processed
    fetchGoals();
    fetchRecords();
  });
  

  document.getElementById('reset-btn').addEventListener('click', function () {
    fetchGoals();
    fetchRecords();
  });
};
