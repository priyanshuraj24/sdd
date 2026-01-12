import { useState } from "react";

export default function TaskForm({ onFormSubmit }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onFormSubmit({ title });
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Task Title"
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button className="btn-primary">Add Task</button>
    </form>
  );
}
