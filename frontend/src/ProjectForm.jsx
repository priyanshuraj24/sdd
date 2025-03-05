import { useState } from "react";

function ProjectForm({ onFormSubmit, defaultProject }) {
  const [title, setTitle] = useState(
    defaultProject ? defaultProject.title : ""
  );
  const [description, setDescription] = useState(
    defaultProject ? defaultProject.description : ""
  );
  const [owner, setOwner] = useState(
    defaultProject ? defaultProject.owner : ""
  );
  const [department, setDepartment] = useState(
    defaultProject ? defaultProject.department : ""
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onFormSubmit) {
            onFormSubmit({ title, description, owner, department });
          }
        }}
        className=""
      >
        <div className="form-input">
          <label htmlFor="project-title">Project Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="project-title"
            value={title}
            placeholder="Enter project title"
          />
        </div>

        <div className="form-input">
          <label htmlFor="description">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            placeholder="Enter description"
          />
        </div>
        <div className="form-input">
          <label htmlFor="project-owner">Owner</label>
          <input
            onChange={(e) => setOwner(e.target.value)}
            value={owner}
            type="text"
            id="project-owner"
            placeholder="Enter project owner"
          />
        </div>
        <div className="form-input">
          <label htmlFor="project-department">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            id="project-department"
            placeholder="Enter project department"
          />
        </div>
        <button className="btn-primary mt-4">Submit</button>
      </form>
    </div>
  );
}

export default ProjectForm;
