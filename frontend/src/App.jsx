import { useState } from "react";

import "./App.css";
import { useEffect } from "react";
import ProjectForm from "./ProjectForm";
import Modal from "./Modal";
import { MdOutlineEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const BASE_URL = "http://localhost:5000";
function App() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState();

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
            </div>
          ))}
        </>
      )}

      {!projects.length && <div>No project.</div>}
    </div>
  );
}

export default App;
