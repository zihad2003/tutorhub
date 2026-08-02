import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton, Input } from "../components/ui";
import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Edit3, 
  Sparkles, 
  Image as ImageIcon,
  Atom,
  Globe,
  Calculator,
  Palette,
  Code2,
  GraduationCap,
  BookOpen,
  MapPin,
  Star,
  Users,
  Briefcase,
  ArrowRight,
  FolderPlus,
  DollarSign,
  Layers,
  RotateCcw
} from "lucide-react";
import { TUTORS } from "../data/tutors";
import { getStoredCategories, saveStoredCategories, INITIAL_CATEGORIES } from "../data/categoriesData";

const ICON_MAP = {
  Atom,
  Globe,
  Calculator,
  Palette,
  Code2,
  GraduationCap,
  BookOpen
};

const PRESET_PHOTOS = [
  { label: "Science", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150&h=150&fit=crop" },
  { label: "Literature", url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=150&h=150&fit=crop" },
  { label: "Finance", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&h=150&fit=crop" },
  { label: "Arts", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=150&h=150&fit=crop" },
  { label: "Coding", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop" },
  { label: "Exam", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&h=150&fit=crop" },
  { label: "Music", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop" },
  { label: "Sports", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&h=150&fit=crop" }
];

export function Categories({ onNavigate }) {
  const [categories, setCategoriesState] = useState(() => {
    try {
      const stored = getStoredCategories();
      return stored && stored.length > 0 ? stored : INITIAL_CATEGORIES;
    } catch (err) {
      console.error(err);
      return INITIAL_CATEGORIES;
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Add Category Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subjectsInput, setSubjectsInput] = useState("");
  const [salaryRange, setSalaryRange] = useState("৳8,000 - ৳15,000/mo");
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [status, setStatus] = useState("active");
  const [toastMessage, setToastMessage] = useState(null);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const updateCategories = (newCats) => {
    setCategoriesState(newCats);
    saveStoredCategories(newCats);
  };

  const resetToDefaults = () => {
    updateCategories(INITIAL_CATEGORIES);
    showToast("Reset categories to default list!");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCategory = (e) => {
    if (e) e.preventDefault();
    if (!name || !name.trim()) {
      showToast("⚠️ Please enter a Category Name");
      return;
    }

    const subjectsList = subjectsInput.trim() 
      ? subjectsInput.split(",").map(s => s.trim()) 
      : (description.trim() ? description.split(",").map(s => s.trim()) : [name.trim()]);

    const newCat = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim() || "Custom tuition category",
      count: "0 Tutors",
      status: status,
      image: selectedPhoto,
      iconName: "BookOpen",
      color: "#2563eb",
      subjects: subjectsList,
      activeJobs: 0,
      avgSalary: salaryRange || "৳6,000 - ৳12,000/mo"
    };

    updateCategories([newCat, ...categories]);
    setName("");
    setDescription("");
    setSubjectsInput("");
    setIsAddModalOpen(false);
    showToast(`Added "${newCat.name}" category successfully!`);
  };

  const handleDelete = (e, id, catName) => {
    e.stopPropagation();
    updateCategories(categories.filter(c => c.id !== id));
    showToast(`Deleted "${catName}"`);
  };

  const handleToggleStatus = (e, id) => {
    e.stopPropagation();
    const updated = categories.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "active" ? "inactive" : "active";
        showToast(`Category status changed to ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    });
    updateCategories(updated);
  };

  const startEdit = (e, cat) => {
    e.stopPropagation();
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
  };

  const saveEdit = (e, id) => {
    e.stopPropagation();
    const updated = categories.map(c => {
      if (c.id === id) {
        return { ...c, name: editName.trim() || c.name, description: editDescription.trim() };
      }
      return c;
    });
    updateCategories(updated);
    setEditingId(null);
    showToast("Category updated!");
  };

  const safeCategories = Array.isArray(categories) ? categories : INITIAL_CATEGORIES;

  const filteredCategories = safeCategories.filter(c => 
    c && c.name && (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const getCategoryIcon = (cat) => {
    if (cat && typeof cat.icon === "function") return cat.icon;
    if (cat && cat.iconName && ICON_MAP[cat.iconName]) return ICON_MAP[cat.iconName];
    return BookOpen;
  };

  // Helper to match tutors to a category
  const getMatchingTutors = (cat) => {
    if (!cat) return TUTORS;
    const catNameLower = (cat.name || "").toLowerCase();
    return TUTORS.filter(t => 
      t && t.subjects && t.subjects.some(sub => 
        catNameLower.includes(sub.toLowerCase()) || 
        (cat.description && cat.description.toLowerCase().includes(sub.toLowerCase()))
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          
          {/* Back Navigation */}
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="mb-6 text-sm font-semibold hover:underline"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl animate-fade-in">
              <Sparkles size={16} className="text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Category Management</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                Manage subject categories, tags, and custom photos available across TutorHub.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Total: {safeCategories.length}
              </span>
              <SecondaryButton onClick={resetToDefaults} size="sm">
                <RotateCcw size={14} className="mr-1 inline" /> Reset Defaults
              </SecondaryButton>
              <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
                <Plus size={16} className="mr-1.5 inline" /> Add Category
              </PrimaryButton>
            </div>
          </div>

          {/* Search & Filter Header */}
          <div className="mt-8 flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: C.border }}>
            <h2 className="text-lg font-semibold" style={{ color: C.text }}>
              All Categories ({filteredCategories.length})
            </h2>
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: C.border }}
              />
            </div>
          </div>

          {/* Categories Grid or Empty State */}
          {filteredCategories.length === 0 ? (
            <div className="mt-8 rounded-2xl border p-12 text-center bg-gray-50/50" style={{ borderColor: C.border }}>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <BookOpen size={28} />
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">No Categories Showing</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                {searchQuery 
                  ? `No category matching "${searchQuery}". Try clearing search.` 
                  : "No active categories found. Click below to load default categories or add a new one."}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {searchQuery ? (
                  <SecondaryButton onClick={() => setSearchQuery("")}>Clear Search</SecondaryButton>
                ) : (
                  <PrimaryButton onClick={resetToDefaults}>
                    <RotateCcw size={16} className="mr-1.5 inline" /> Load Default Categories
                  </PrimaryButton>
                )}
                <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
                  <Plus size={16} className="mr-1.5 inline" /> Add New Category
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((cat) => {
                const IconComp = getCategoryIcon(cat);
                const isEditing = editingId === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className="group flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-300 bg-white cursor-pointer"
                    style={{ borderColor: C.border }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Relevant Photo Thumbnail */}
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-inner group-hover:scale-105 transition-transform">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600"
                            style={{ display: cat.image ? "none" : "flex" }}
                          >
                            <IconComp size={20} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded border px-2 py-1 text-sm font-semibold"
                              />
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description..."
                                className="w-full rounded border px-2 py-1 text-xs"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                {cat.name}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-1">{cat.description || "Tuition Category"}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[11px] font-medium text-blue-600">
                                  {cat.count}
                                </span>
                                {cat.activeJobs ? (
                                  <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
                                    {cat.activeJobs} jobs
                                  </span>
                                ) : null}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status Badge Toggle */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(e, cat.id)}
                        title="Click to toggle status"
                        className="shrink-0"
                      >
                        <Badge tone={cat.status === "active" ? "success" : "neutral"}>
                          {cat.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: C.border }}>
                      <span className="text-[11px] text-gray-400 font-medium group-hover:text-blue-500 flex items-center gap-1">
                        View details <ArrowRight size={12} />
                      </span>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700"
                            >
                              <X size={14} /> Cancel
                            </button>
                            <button
                              type="button"
                              onClick={(e) => saveEdit(e, cat.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                              <Check size={14} /> Save
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={(e) => startEdit(e, cat)}
                              className="flex items-center gap-1 rounded p-1 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                              title="Edit category"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, cat.id, cat.name)}
                              className="flex items-center gap-1 rounded p-1 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700"
                              title="Delete category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-white/20 p-2 text-white">
                  <FolderPlus size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Add New Category</h2>
                  <p className="text-xs text-blue-100">Fill in the details to create a new subject category.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleAddCategory} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Higher Mathematics, Robotics & AI..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description / Overview
                </label>
                <Input
                  placeholder="e.g. Specializing in advanced calculus, geometry, and linear algebra..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Sub-subjects / Topics */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Layers size={14} className="text-blue-600" />
                  Sub-Subjects / Topics (comma separated)
                </label>
                <Input
                  placeholder="e.g. Calculus, Trigonometry, Algebra, Geometry"
                  value={subjectsInput}
                  onChange={(e) => setSubjectsInput(e.target.value)}
                />
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <DollarSign size={14} className="text-emerald-600" />
                  Estimated Monthly Salary Range
                </label>
                <Input
                  placeholder="e.g. ৳8,000 - ৳15,000/mo"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                />
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <ImageIcon size={14} />
                  Choose Relevant Category Photo
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_PHOTOS.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(photo.url)}
                      className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-all ${
                        selectedPhoto === photo.url ? "border-blue-600 scale-105 shadow-md ring-2 ring-blue-300" : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={photo.url} alt={photo.label} className="h-full w-full object-cover" />
                      {selectedPhoto === photo.url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/40 text-white">
                          <Check size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between rounded-lg border p-3 bg-gray-50">
                <span className="text-xs font-semibold text-gray-700">Category Status</span>
                <button
                  type="button"
                  onClick={() => setStatus(status === "active" ? "inactive" : "active")}
                  className="inline-flex items-center gap-1.5"
                >
                  <Badge tone={status === "active" ? "success" : "neutral"}>
                    {status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <SecondaryButton type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" onClick={handleAddCategory}>
                  <Check size={16} className="mr-1.5 inline" /> Save & Add Category
                </PrimaryButton>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CATEGORY DETAIL MODAL */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="h-16 w-16 rounded-xl border-2 border-white/40 object-cover shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                      {(selectedCategory.status || "active").toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-blue-100">{selectedCategory.description}</p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-6 flex flex-wrap gap-4 border-t border-white/20 pt-4 text-xs font-medium text-blue-100">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-blue-300" />
                  <span><strong>{selectedCategory.count || "0 Tutors"}</strong> Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-emerald-300" />
                  <span><strong>{selectedCategory.activeJobs || 15}</strong> Active Tuition Requests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Avg Rate: <strong>{selectedCategory.avgSalary || "৳8,000/mo"}</strong></span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              
              {/* Sub-subjects / Topics */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Subjects & Topics Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedCategory.subjects || [selectedCategory.name]).map((sub, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tutors List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Tutors Teaching {selectedCategory.name}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      onNavigate("tutors");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View All Tutors <ArrowRight size={12} />
                  </button>
                </div>

                <div className="space-y-3">
                  {getMatchingTutors(selectedCategory).slice(0, 3).map((tutor) => (
                    <div
                      key={tutor.id}
                      className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={tutor.img}
                          alt={tutor.name}
                          className="h-12 w-12 rounded-full object-cover border"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                            {tutor.name}
                            <span className="flex items-center text-xs font-normal text-amber-500">
                              <Star size={12} className="fill-amber-400 mr-0.5" /> {tutor.rating}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {tutor.location}</span>
                            <span>• {tutor.experience} exp</span>
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {tutor.subjects.map(s => (
                              <span key={s} className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">৳{tutor.fee}/hr</span>
                        <div className="mt-1">
                          <SecondaryButton
                            onClick={() => {
                              setSelectedCategory(null);
                              onNavigate("tutors");
                            }}
                          >
                            Select
                          </SecondaryButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Tuition Requests */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Recent Tuition Requests in {selectedCategory.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border bg-white p-3.5 shadow-sm">
                    <div className="flex justify-between text-xs font-semibold text-blue-600 mb-1">
                      <span>Class 9-10 Student</span>
                      <span>৳8,000/mo</span>
                    </div>
                    <p className="text-xs font-medium text-gray-800">Need experienced tutor for 4 days/week</p>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin size={10} /> Dhanmondi, Dhaka
                    </p>
                  </div>
                  <div className="rounded-xl border bg-white p-3.5 shadow-sm">
                    <div className="flex justify-between text-xs font-semibold text-blue-600 mb-1">
                      <span>HSC Candidate</span>
                      <span>৳12,000/mo</span>
                    </div>
                    <p className="text-xs font-medium text-gray-800">Special focus on board exam preparation</p>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin size={10} /> Uttara, Dhaka
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t p-4 bg-white">
              <SecondaryButton onClick={() => setSelectedCategory(null)}>
                Close
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  setSelectedCategory(null);
                  onNavigate("tutors");
                }}
              >
                Browse All Tutors in {selectedCategory.name} &rarr;
              </PrimaryButton>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
