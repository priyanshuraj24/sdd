import { useState } from "react";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdOutlineEdit,
} from "react-icons/md";
import "./App.css";
import Modal from "./Modal";
import ProjectForm from "./ProjectForm";
import TaskForm from "./TaskForm";

const BASE_URL = "http://localhost:5000";
function App() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState();
  const [tasks, setTasks] = useState([]);
  const [activeProjectForTasks, setActiveProjectForTasks] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/project`);
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.log(e);
        alert("Couldn't fetch projects, Please make sure server is running.");
      }
    })();
  }, []);
  async function handleCreateProject(project) {
    const res = await fetch(`${BASE_URL}/project`, {
      method: "POST",
      body: JSON.stringify(project),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await res.json();
    projects.unshift(data);
    setShowModal(false);
  }

  async function handleEdit(project) {
    setShowModal(true);
    const res = await fetch(`${BASE_URL}/project`, {
      method: "PATCH",
      body: JSON.stringify({ _id: projects[editIndex]._id, ...project }),
      headers: {
        "content-type": "application/json",
      },
    });

    setProjects((s) => {
      for (let i = 0; i < s.length; i++) {
        if (s[i]._id === s[editIndex]._id) {
          s[i] = project;
        }
      }

      return s;
    });
    closeModal();

    const data = await res.json();
    console.log(data);
  }

  function closeModal() {
    setEditIndex(undefined);
    setShowModal(false);
  }

  // Task Management Functions
  async function fetchTasks(projectId) {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${projectId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
        console.error("Expected array of tasks, got:", data);
      }
    } catch (e) {
      console.log(e);
      alert("Couldn't fetch tasks.");
    }
  }

  async function handleCreateTask({ title }) {
    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        body: JSON.stringify({ title, projectId: activeProjectForTasks._id }),
        headers: { "content-type": "application/json" },
      });
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
    } catch (e) {
      console.log(e);
      alert("Couldn't create task.");
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await fetch(`${BASE_URL}/tasks/${taskId}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (e) {
      console.log(e);
      alert("Couldn't delete task.");
    }
  }

  async function handleUpdateTask(taskId, updates) {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: { "content-type": "application/json" },
      });
      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
      setEditingTask(null); // Clear edit mode if checking done
    } catch (e) {
      console.log(e);
      alert("Couldn't update task.");
    }
  }

  function openTaskModal(project) {
    setActiveProjectForTasks(project);
    fetchTasks(project._id);
    setShowTaskModal(true);
  }

  function closeTaskModal() {
    setShowTaskModal(false);
    setActiveProjectForTasks(null);
    setTasks([]);
  }

  return (
    <div className="max-w-md m-auto p-6">
      <Modal
        className="bg-white w-[400px] rounded-md border border-gray-200 p-4"
        show={showModal}
      >
        <div className="flex  items-center mb-2 justify-between">
          <h2 className="text-2xl font-medium">Project Form</h2>
          <button
            onClick={closeModal}
            className="h-6 w-6  center rounded-full border border-gray-400"
          >
            <IoClose />
          </button>
        </div>
        <ProjectForm
          onFormSubmit={
            editIndex != undefined ? handleEdit : handleCreateProject
          }
          defaultProject={
            editIndex != undefined ? projects[editIndex] : undefined
          }
        />
      </Modal>

      {/* Task Modal */}
      <Modal
        className="bg-white w-[500px] rounded-md border border-gray-200 p-4"
        show={showTaskModal}
      >
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-xl font-medium">
            Tasks for {activeProjectForTasks?.title}
          </h2>
          <button
            onClick={closeTaskModal}
            className="h-6 w-6 center rounded-full border border-gray-400"
          >
            <IoClose />
          </button>
        </div>

        <div className="mb-4">
          <TaskForm
            onFormSubmit={(data) => {
              if (editingTask) {
                handleUpdateTask(editingTask._id, data);
              } else {
                handleCreateTask(data);
              }
            }}
            initialTitle={editingTask?.title || ""}
            isEditing={!!editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {tasks.length === 0 && (
            <p className="text-gray-500 text-center">No tasks yet.</p>
          )}
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`flex justify-between items-center bg-gray-50 p-2 mb-2 rounded border border-gray-100 ${
                task.status === "Done" ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleUpdateTask(task._id, {
                      status: task.status === "Done" ? "To Do" : "Done",
                    })
                  }
                  className="text-xl text-blue-500"
                >
                  {task.status === "Done" ? (
                    <MdCheckBox />
                  ) : (
                    <MdCheckBoxOutlineBlank />
                  )}
                </button>
                <div>
                  <div
                    className={`font-medium ${
                      task.status === "Done" ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingTask(task);
                    // Optional: Scroll to top of list or form
                  }}
                  className="text-blue-500 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <button
        onClick={() => {
          setShowModal(true);
        }}
        className="btn-primary mb-4"
      >
        Add Project
      </button>
      <h1 className="text-3xl font-medium mb-2">Projects</h1>

      {!!projects.length && (
        <>
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="border border-gray-400 rounded p-4 relative mb-4"
            >
              <div className="text-lg font-medium">{project.title}</div>
              <div className="my-1 text-sm">
                <span>
                  <b className="font-medium">Owner:</b> {project.owner}
                </span>{" "}
                <span>
                  <b className="font-medium">Department:</b>{" "}
                  {project.department}
                </span>
              </div>
              <div className="mt-2">{project.description}</div>
              <button
                onClick={() => {
                  setEditIndex(index);
                  setShowModal(true);
                }}
                className="absolute center w-8 h-8 -right-4 -top-4 border border-gray-300 bg-white rounded-full"
              >
                <MdOutlineEdit />
              </button>
              <button
                onClick={() => openTaskModal(project)}
                className="absolute center w-24 h-8 bottom-4 right-4 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 text-sm"
              >
                View Tasks
              </button>
            </div>
          ))}
        </>
      )}

      {!projects.length && <div>No project.</div>}
    </div>
  );
}

export default App;
