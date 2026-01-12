import { useEffect, useState } from "react";

export default function TaskForm({
  onFormSubmit,
  initialTitle = "",
  isEditing = false,
  onCancel,
}) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  function handleSubmit(e) {
    e.preventDefault();
    onFormSubmit({ title });
    if (!isEditing) setTitle(""); // Only clear if creating
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder={isEditing ? "Update Task Title" : "Task Title"}
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <button className="btn-primary flex-1">
          {isEditing ? "Update Task" : "Add Task"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 rounded px-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
