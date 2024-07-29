document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab-button');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      showTab(tabId);
    });
  });

  function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');

    // Activate the clicked tab button
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
  }

  // Initialize with the first tab active
  showTab('this-week');
  
  // Contract management
  const settingsButton = document.getElementById('settingsButton');
  const settingsModal = document.getElementById('settingsModal');
  const closeButton = settingsModal.querySelector('.close');
  const contractForm = document.getElementById('contractForm');
  const addContractButton = document.getElementById('addContractButton');
  const contractsList = document.getElementById('contractsList');

  let contracts = [];

  // Load contracts from storage
  chrome.storage.sync.get('contracts', function(data) {
    contracts = data.contracts || [];
    renderContracts();
  });

  settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
  });

  closeButton.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  contractForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const contractId = document.getElementById('contractId').value;
    const contract = {
      id: contractId || Date.now().toString(),
      name: document.getElementById('contractName').value,
      minHours: document.getElementById('minHours').value,
      invoiceEmail: document.getElementById('invoiceEmail').value
    };

    if (contractId) {
      // Update existing contract
      const index = contracts.findIndex(c => c.id === contractId);
      contracts[index] = contract;
    } else {
      // Add new contract
      contracts.push(contract);
    }

    chrome.storage.sync.set({contracts: contracts}, function() {
      renderContracts();
      settingsModal.style.display = 'none';
      contractForm.reset();
    });
  });

  addContractButton.addEventListener('click', () => {
    document.getElementById('contractId').value = '';
    contractForm.reset();
    settingsModal.style.display = 'block';
  });

  function renderContracts() {
    contractsList.innerHTML = '';
    contracts.forEach(contract => {
      const contractElement = document.createElement('div');
      contractElement.className = 'contract-item';
      contractElement.innerHTML = `
        <span>${contract.name}</span>
        <div>
          <button class="edit-contract" data-id="${contract.id}">Edit</button>
          <button class="delete-contract" data-id="${contract.id}">Delete</button>
        </div>
      `;
      contractsList.appendChild(contractElement);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-contract').forEach(button => {
      button.addEventListener('click', editContract);
    });
    document.querySelectorAll('.delete-contract').forEach(button => {
      button.addEventListener('click', deleteContract);
    });
  }

  function editContract(e) {
    const contractId = e.target.getAttribute('data-id');
    const contract = contracts.find(c => c.id === contractId);
    document.getElementById('contractId').value = contract.id;
    document.getElementById('contractName').value = contract.name;
    document.getElementById('minHours').value = contract.minHours;
    document.getElementById('invoiceEmail').value = contract.invoiceEmail;
    settingsModal.style.display = 'block';
  }

  function deleteContract(e) {
    const contractId = e.target.getAttribute('data-id');
    contracts = contracts.filter(c => c.id !== contractId);
    chrome.storage.sync.set({contracts: contracts}, function() {
      renderContracts();
    });
  }

  // Task management (to be implemented)
  // This will involve creating a new modal or page for adding/editing tasks
  // and storing them in chrome.storage.sync along with their associated contract

let tasks = [];

// Load tasks from storage
chrome.storage.sync.get('tasks', function(data) {
  tasks = data.tasks || [];
  renderTasks();
});

function addTask(contractId, description, date, hours) {
  const task = {
    id: Date.now().toString(),
    contractId,
    description,
    date,
    hours
  };
  tasks.push(task);
  saveTasks();
}

function editTask(taskId, description, date, hours) {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], description, date, hours };
    saveTasks();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks();
}

function saveTasks() {
  chrome.storage.sync.set({tasks: tasks}, function() {
    renderTasks();
  });
}

function renderTasks() {
  // Implement this function to display tasks in your UI
  // You'll need to create a new section in your HTML to show tasks
}

// Implement UI for adding, editing, and deleting tasks
// This could involve creating new modals or inline forms in your existing tabs

});