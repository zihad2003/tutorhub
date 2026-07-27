import { C } from "../constants/tokens";
import { Badge, PrimaryButton, Input } from "../components/ui";
import { useState } from "react";
import { Plus, BookOpen, Trash2 } from "lucide-react";

export function Categories({ onNavigate }) {
  const [categories, setCategories] = useState([
    { id: 1, name: "Science & Math", count: "124 Tutors", status: "active" },
    { id: 2, name: "Languages & Literature", count: "86 Tutors", status: "active" },
    { id: 3, name: "Commerce & Accounting", count: "45 Tutors", status: "active" },
    { id: 4, name: "Arts & Humanities", count: "32 Tutors", status: "active" },
    { id: 5, name: "Programming & IT", count: "58 Tutors", status: "active" },
    { id: 6, name: "Admission Test Prep", count: "92 Tutors", status: "active" },
  ]);

  const [newCategory, setNewCategory] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        { id: Date.now(), name: newCategory.trim(), count: "0 Tutors", status: "active" }
      ]);
      setNewCategory("");
    }
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Category Management</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                Manage subject categories and tuition tags available on the platform.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Enter new category name (e.g. Higher Mathematics)..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <PrimaryButton type="submit">
              <Plus size={16} className="mr-1.5 inline" /> Add Category
            </PrimaryButton>
          </form>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
                style={{ borderColor: C.border }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: C.text }}>{cat.name}</h3>
                    <p className="text-xs" style={{ color: C.textSecondary }}>{cat.count}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="success">Active</Badge>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
