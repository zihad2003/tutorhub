export const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Science & Math",
    description: "Physics, Chemistry, Higher Math, Biology, General Science",
    count: "124 Tutors",
    status: "active",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150&h=150&fit=crop",
    iconName: "Atom",
    color: "#2563eb",
    subjects: ["Physics", "Chemistry", "Higher Mathematics", "Biology", "General Science"],
    activeJobs: 28,
    avgSalary: "৳8,000 - ৳15,000/mo"
  },
  {
    id: 2,
    name: "Languages & Literature",
    description: "English Grammar, Spoken English, Bangla, French, IELTS Prep",
    count: "86 Tutors",
    status: "active",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=150&h=150&fit=crop",
    iconName: "Globe",
    color: "#7c3aed",
    subjects: ["English Language", "English Literature", "Bangla 1st & 2nd", "IELTS", "Spoken English"],
    activeJobs: 19,
    avgSalary: "৳6,000 - ৳12,000/mo"
  },
  {
    id: 3,
    name: "Commerce & Accounting",
    description: "Accounting, Finance, Economics, Business Studies, Management",
    count: "45 Tutors",
    status: "active",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&h=150&fit=crop",
    iconName: "Calculator",
    color: "#059669",
    subjects: ["Financial Accounting", "Finance & Banking", "Economics", "Business Organization"],
    activeJobs: 14,
    avgSalary: "৳7,500 - ৳14,000/mo"
  },
  {
    id: 4,
    name: "Arts & Humanities",
    description: "History, Sociology, Civics, Geography, Fine Arts, Logic",
    count: "32 Tutors",
    status: "active",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=150&h=150&fit=crop",
    iconName: "Palette",
    color: "#ea580c",
    subjects: ["Bangladesh & Global Studies", "Islamic History", "Sociology", "Civics", "Psychology"],
    activeJobs: 9,
    avgSalary: "৳5,500 - ৳10,000/mo"
  },
  {
    id: 5,
    name: "Programming & IT",
    description: "Python, Web Development, C++, Java, Data Science, ICT",
    count: "58 Tutors",
    status: "active",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop",
    iconName: "Code2",
    color: "#0284c7",
    subjects: ["HSC ICT", "Python Programming", "Web Development (HTML/CSS/JS)", "C++ Data Structures"],
    activeJobs: 22,
    avgSalary: "৳10,000 - ৳20,000/mo"
  },
  {
    id: 6,
    name: "Admission Test Prep",
    description: "BUET, Medical, Dhaka University, IBA, SAT, GRE",
    count: "92 Tutors",
    status: "active",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&h=150&fit=crop",
    iconName: "GraduationCap",
    color: "#dc2626",
    subjects: ["Engineering Admission", "Medical Admission", "DU A/B Unit", "IBA BBA", "SAT General"],
    activeJobs: 35,
    avgSalary: "৳12,000 - ৳25,000/mo"
  },
];

export function getStoredCategories() {
  try {
    const raw = localStorage.getItem("tutorhub_categories");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading tutorhub_categories:", e);
  }
  return INITIAL_CATEGORIES;
}

export function saveStoredCategories(categories) {
  try {
    // Sanitize categories to ensure no React component functions are stored
    const sanitized = categories.map(c => {
      const { icon, ...rest } = c;
      return rest;
    });
    localStorage.setItem("tutorhub_categories", JSON.stringify(sanitized));
    window.dispatchEvent(new Event("tutorhub_categories_updated"));
  } catch (e) {
    console.error("Error saving tutorhub_categories:", e);
  }
}
