import React, { useState } from "react";
import { format } from "date-fns";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [name, setName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [isTaskListOpen, setIsTaskListOpen] = useState(true);
  
  // Search and category state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Define available categories
  const availableCategories = ["Kerja", "Rumah", "Wajib", "Acara", "Sekolah"];

  // Add a new task
  const handleAddTask = () => {
    if (newTask && selectedCategories.length > 0) {
      const dateAdded = format(new Date(), "eeee, MMMM do, yyyy h:mm a");
      const newTaskItem = {
        id: Date.now(),
        name: newTask,
        category: selectedCategories[0], // Only allow first selected category
        dateAdded,
        done: false,
      };
      setTasks([...tasks, newTaskItem]);
      toast.success(`Task "${newTask}" added!`, { autoClose: 2000 });
      setNewTask("");
      setSelectedCategories([]);
    }
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    const deletedTask = tasks.find((task) => task.id === id);
    setTasks(tasks.filter((task) => task.id !== id));
    toast.error(`Task "${deletedTask.name}" deleted!`, { autoClose: 2000 });
  };

  // Toggle task completion
  const handleToggleDone = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
    
    const completedTask = updatedTasks.find((task) => task.id === id);
    if (completedTask.done) {
      toast.success(`Kamu menyelesaikan "${completedTask.name}" dengan category "${completedTask.category}" !`, { autoClose: 3000 });
    } else {
      toast.info(`"${completedTask.name}" telah ditandai belum selesai.`, { autoClose: 3000 });
    }
  };

  // Edit task
  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setEditingTaskId(id);
    setEditedTask(taskToEdit.name);
  };

  // Save edited task
  const handleSaveEdit = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, name: editedTask }
        : task
    );
    setTasks(updatedTasks);
    toast.success(`Task "${editedTask}" updated!`, { autoClose: 2000 });
    setEditingTaskId(null);
    setEditedTask("");
  };

  // Toggle task list open/close
  const handleToggleTaskList = () => {
    setIsTaskListOpen(!isTaskListOpen);
  };

  // Handle user submitting their name in modal
  const handleSetName = () => {
    if (name.trim()) {
      setIsNameSet(true);
    }
  };

  // Handle category selection for filters
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  // Filter tasks based on search and selected categories
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(task.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-10">
      {/* Modal to enter name */}
      {!isNameSet && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Masukkan Nama Kamu</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your name"
            />
            <button
              onClick={handleSetName}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <ToastContainer />

      <div className="w-full max-w-lg">
        {/* Greeting with name */}
        {isNameSet && (
          <h1 className="text-right text-lg font-semibold text-gray-800 mb-4">
            Hai, selamat datang {name}!
          </h1>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">To-Do List App</h1>

        {/* Input Task */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* Modern Category Selection */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-2">Select a Category :</h3>
            <div className="flex space-x-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Task
          </button>
        </div>

        {/* Toggle Task List Visibility */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Your Tasks</h2>
          <button onClick={handleToggleTaskList}>
            {isTaskListOpen ? (
              <FiChevronUp className="text-gray-600 text-2xl" />
            ) : (
              <FiChevronDown className="text-gray-600 text-2xl" />
            )}
          </button>
        </div>

        {/* Search Input */}
        {isTaskListOpen && (
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="mb-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* Task List */}
        {isTaskListOpen && (
          <div>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex justify-between items-center border-b py-2 ${
                  task.done ? "bg-green-100" : ""
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-lg ${task.done ? "line-through" : ""}`}>
                    {task.name}
                  </span>
                  <span className="text-sm text-gray-600">{task.category}</span>
                  <span className="text-xs text-gray-500">{task.dateAdded}</span>
                </div>
                <div className="flex gap-2">
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        className="border rounded-lg px-2"
                        placeholder="Edit task"
                      />
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="bg-blue-500 text-white px-2 rounded-lg"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleDone(task.id)}
                        className="bg-green-500 text-white px-2 rounded-lg"
                      >
                        {task.done ? "Undo" : "Done"}
                      </button>
                      <button
                        onClick={() => handleEditTask(task.id)}
                        className="bg-yellow-500 text-white px-2 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-white px-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
            {filteredTasks.length === 0 && (
              <p className="text-gray-500">No tasks found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
