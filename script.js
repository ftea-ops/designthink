// DOM要素を取得
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const newCategoryInput = document.getElementById('newCategoryInput');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const filterSelect = document.getElementById('filterSelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// カテゴリを管理
let categories = JSON.parse(localStorage.getItem('categories')) || ['仕事', '個人', '勉強', 'その他'];

// カテゴリをselectに追加
function updateCategorySelect() {
    categorySelect.innerHTML = '<option value="">カテゴリを選択</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// フィルタselectを更新
function updateFilterSelect() {
    filterSelect.innerHTML = '<option value="all">すべて</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filterSelect.appendChild(option);
    });
}

// 初期化
updateCategorySelect();
updateFilterSelect();

// カテゴリ追加
addCategoryBtn.addEventListener('click', () => {
    const newCat = newCategoryInput.value.trim();
    if (newCat && !categories.includes(newCat)) {
        categories.push(newCat);
        localStorage.setItem('categories', JSON.stringify(categories));
        updateCategorySelect();
        updateFilterSelect();
        newCategoryInput.value = '';
    }
});

// タスクをソート：未完了を上、完了を下
function sortTasks() {
    const tasks = Array.from(taskList.children);
    const incompleteTasks = tasks.filter(task => !task.classList.contains('completed'));
    const completeTasks = tasks.filter(task => task.classList.contains('completed'));
    taskList.innerHTML = '';
    incompleteTasks.forEach(task => taskList.appendChild(task));
    completeTasks.forEach(task => taskList.appendChild(task));
}

// タスクを追加する関数
function addTask() {
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    if (taskText === '') return;

    // 新しいタスク要素を作成
    const li = document.createElement('li');
    li.className = `task-item ${priority}`;

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = `カテゴリ: ${category || '未設定'} | 優先度: ${priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}`;

    taskDetails.appendChild(span);
    taskDetails.appendChild(meta);

    const completeBtn = document.createElement('button');
    completeBtn.textContent = '完了';
    completeBtn.className = 'complete-btn';
    completeBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
        // 完了状態に応じてリストを再ソート
        sortTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
    });

    li.appendChild(taskDetails);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // 入力フィールドをクリア
    taskInput.value = '';
    categorySelect.value = '';
    prioritySelect.value = 'low';
}

// 追加ボタンにイベントリスナーを追加
addTaskBtn.addEventListener('click', addTask);

// Enterキーでタスクを追加
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
