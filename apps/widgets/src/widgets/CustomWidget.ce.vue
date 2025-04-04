<template>
    <div class="goals-widget">
      <div class="header">
        <h2>Daily Goals</h2>
        <div class="progress-ring">
          <svg width="60" height="60">
            <circle
              class="progress-ring__circle-bg"
              stroke-width="4"
              fill="transparent"
              r="26"
              cx="30"
              cy="30"
            />
            <circle
              class="progress-ring__circle"
              :style="progressRingStyle"
              stroke-width="4"
              fill="transparent"
              r="26"
              cx="30"
              cy="30"
            />
          </svg>
          <span class="progress-text">{{ completionPercentage }}%</span>
        </div>
      </div>
  
      <div class="goals-container">
        <div class="add-goal">
          <input 
            v-model="newGoal" 
            @keyup.enter="addGoal"
            placeholder="Add a new goal..."
            type="text"
          />
          <button @click="addGoal" class="add-button">
            <span class="plus">+</span>
          </button>
        </div>
  
        <div v-if="isLoading" class="loading-state">
          Loading initial goals...
        </div>
  
        <TransitionGroup v-else name="list" tag="div" class="goals-list">
          <div 
            v-for="goal in goals" 
            :key="goal.id"
            class="goal-item"
            :class="{ 'completed': goal.completed }"
          >
              <input 
                type="checkbox" 
                v-model="goal.completed"
                @change="updateProgress"
              />
              <span class="goal-text">{{ goal.text }}</span>
  
            <button @click="removeGoal(goal.id)" class="delete-button">
              <span class="delete-icon">×</span>
            </button>
          </div>
        </TransitionGroup>
      </div>
  
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ completedGoals }}</span>
          <span class="stat-label">Completed</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ remainingGoals }}</span>
          <span class="stat-label">Remaining</span>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  
  interface Goal {
    id: number;
    text: string;
    completed: boolean;
  }
  
  interface Todo {
    id: number;
    title: string;
    completed: boolean;
  }
  
  const goals = ref<Goal[]>([]);
  const newGoal = ref('');
  const isLoading = ref(false);
  let nextId = 1;
  
  const fetchInitialTodos = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
      const todos: Todo[] = await response.json();
      
      goals.value = todos.map(todo => ({
        id: nextId++,
        text: todo.title,
        completed: todo.completed
      }));
      
      saveGoals();
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const addGoal = () => {
    if (newGoal.value.trim()) {
      goals.value.push({
        id: nextId++,
        text: newGoal.value.trim(),
        completed: false
      });
      newGoal.value = '';
      saveGoals();
    }
  };
  
  const removeGoal = (id: number) => {
    goals.value = goals.value.filter(goal => goal.id !== id);
    saveGoals();
  };
  
  const updateProgress = () => {
    saveGoals();
  };
  
  const saveGoals = () => {
    localStorage.setItem('dailyGoals', JSON.stringify(goals.value));
  };
  
  const completedGoals = computed(() => {
    return goals.value.filter(goal => goal.completed).length;
  });
  
  const remainingGoals = computed(() => {
    return goals.value.length - completedGoals.value;
  });
  
  const completionPercentage = computed(() => {
    if (goals.value.length === 0) return 0;
    return Math.round((completedGoals.value / goals.value.length) * 100);
  });
  
  const progressRingStyle = computed(() => {
    const circumference = 2 * Math.PI * 26;
    const offset = circumference - (completionPercentage.value / 100) * circumference;
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: offset.toString()
    };
  });
  
  onMounted(async () => {

      await fetchInitialTodos();
    
  });
  </script>
  
  <style scoped>
  .goals-widget {
    background: #ffffff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 320px;
    margin: 0 auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.5em;
  }
  
  .progress-ring {
    position: relative;
    width: 60px;
    height: 60px;
  }
  
  .progress-ring__circle-bg {
    stroke: #e0e0e0;
  }
  
  .progress-ring__circle {
    stroke: #4CAF50;
    transform-origin: center;
    transform: rotate(-90deg);
    transition: stroke-dashoffset 0.3s ease;
  }
  
  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8em;
    color: #666;
  }
  
  .add-goal {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  input[type="text"] {
    background: transparent;
    color: black;
    flex: 1;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1em;
    transition: border-color 0.3s ease;
  }
  
  input[type="text"]:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  .add-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: #4CAF50;
    color: white;
    font-size: 1.5em;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .add-button:hover {
    transform: scale(1.05);
  }
  
  .goals-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .goal-item {
    display: grid;
    grid-template-columns: 40px 1fr 30px;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .goal-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .goal-text {
    text-align: start;
    white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
    color: #2c3e50;
  }
  
  .completed .goal-text {
    text-decoration: line-through;
    color: #888;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: #ff5252;
    font-size: 1.2em;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .goal-item:hover .delete-button {
    opacity: 1;
  }
  
  .stats {
    display: flex;
    justify-content: space-around;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e0e0e0;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-size: 1.5em;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .stat-label {
    font-size: 0.8em;
    color: #666;
  }
  
  /* Animations */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  
  .list-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }
  
  /* Checkbox styling */
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid #4CAF50;
    appearance: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
  }
  
  input[type="checkbox"]:checked {
    background: #4CAF50;
  }
  
  input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .loading-state {
    text-align: center;
    padding: 20px;
    color: #666;
    font-style: italic;
  }
  </style> 