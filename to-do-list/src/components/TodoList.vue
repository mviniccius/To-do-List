<template>
  <div class="p-6 max-w-lg mx-auto bg-white shadow-xl rounded-xl">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
      To-Do List - teste vaga
    </h1>

    <section class="flex space-x-3 mb-8">
      <input
        type="text"
        v-model="newTaskTitle"
        placeholder="Digite a nova tarefa..."
        class="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        @click="createTask"
        :disabled="!newTaskTitle.trim()"
        class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
      >
        Cadastrar
      </button>
    </section>

    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

    <section>
      <h2 class="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
        Tarefas Cadastradas
      </h2>

      <div v-if="isLoading" class="text-center text-gray-500">
        Carregando tarefas...
      </div>

      <div
        v-else-if="tasks.length === 0"
        class="text-center text-gray-500 p-4 border rounded-md"
      >
        Nenhuma tarefa encontrada.
      </div>

      <ul class="space-y-3">
        <li
          v-for="task in tasks"
          :key="task._id"
          class="flex items-center p-3 border rounded-lg justify-between transition duration-150"
          :class="{
            'bg-green-50/50 border-green-200': task.completed,
            'bg-gray-50': !task.completed,
          }"
        >
          <div class="flex items-center space-x-3">
            <input
              type="checkbox"
              :checked="task.completed"
              @change="toggleCompletion(task)"
              class="form-checkbox h-5 w-5 text-indigo-600 rounded"
            />

            <template v-if="editingTaskId === task._id">
              <input
                type="text"
                v-model="editingTaskTitle"
                @keyup.enter="editTaskTitle(task)"
                @blur="editTaskTitle(task)"
                class="p-1 border border-indigo-400 rounded-md focus:outline-none"
                v-focus
              />
            </template>

            <span
              v-else
              :class="{
                'line-through text-gray-500': task.completed,
                'text-gray-800': !task.completed,
              }"
            >
              {{ task.title }}
            </span>
          </div>

          <div class="space-x-2">
            <button
              v-if="editingTaskId !== task._id"
              @click="startEdit(task)"
              class="text-blue-500 hover:text-blue-700 p-1 rounded transition duration-150"
              title="Editar Tarefa"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>

            <button
              @click="deleteTask(task._id)"
              class="text-red-500 hover:text-red-700 p-1 rounded transition duration-150"
              title="Excluir Tarefa"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const apiUrl = "http://localhost:3000/api/todos";

const newTaskTitle = ref("");
const tasks = ref([]);
const isLoading = ref(false);
const error = ref(null);

const editingTaskId = ref(null);
const editingTaskTitle = ref("");

const vFocus = {
  mounted: (el) => el.focus(),
};

const fetchTasks = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Falha ao buscar tarefas no servidor.");
    tasks.value = await response.json();
  } catch (err) {
    console.error("Erro de busca:", err);
    error.value =
      "Erro ao carregar tarefas. Verifique se o backend está rodando.";
  } finally {
    isLoading.value = false;
  }
};

const createTask = async () => {
  if (!newTaskTitle.value.trim()) return;

  error.value = null;
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle.value }),
    });

    if (response.ok) {
      const newTask = await response.json();

      tasks.value.unshift(newTask);
      newTaskTitle.value = "";
    } else {
      const err = await response.json();
      throw new Error(err.message || "Erro desconhecido ao cadastrar.");
    }
  } catch (err) {
    console.error("Erro de cadastro:", err);
    error.value = `Erro ao cadastrar: ${err.message}`;
  }
};

const toggleCompletion = async (task) => {
  task.completed = !task.completed;

  try {
    const response = await fetch(`${apiUrl}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: task.completed }),
    });

    if (!response.ok) {
      task.completed = !task.completed;
      throw new Error("Falha ao atualizar o status da tarefa.");
    }
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    error.value = `Erro ao atualizar status: ${err.message}`;
    task.completed = !task.completed;
  }
};

const startEdit = (task) => {
  // 1. Ativa o modo de edição para esta tarefa
  editingTaskId.value = task._id;
  // 2. Pré-carrega o input com o título atual
  editingTaskTitle.value = task.title;
};

const editTaskTitle = async (task) => {
  const newTitle = editingTaskTitle.value.trim();

  if (!newTitle) {
    alert("O título não pode ser vazio!");
    // Saímos do modo de edição, mas o título não foi alterado no banco
    editingTaskId.value = null;
    return;
  }

  if (newTitle === task.title) {
    // Título não mudou, apenas saia do modo de edição
    editingTaskId.value = null;
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    if (response.ok) {
      // Atualiza o título no array local reativo
      task.title = newTitle;
      // Desativa o modo de edição
      editingTaskId.value = null;
    } else {
      throw new Error("Falha ao atualizar o nome da tarefa.");
    }
  } catch (err) {
    console.error("Erro ao editar título:", err);
    error.value = `Erro ao editar: ${err.message}`;
    // Se falhar, é melhor recarregar a lista para ter o estado correto do backend.
    fetchTasks();
  }
};

const deleteTask = async (id) => {
  error.value = null;
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      tasks.value = tasks.value.filter((task) => task._id !== id);
    } else {
      throw new Error("Falha ao excluir a tarefa.");
    }
  } catch (err) {
    console.error("Erro ao deletar:", err);
    error.value = `Erro ao deletar: ${err.message}`;
  }
};

onMounted(fetchTasks);
</script>
