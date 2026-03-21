"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Stethoscope,
  UserPlus,
  Calendar,
  FileText,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */

type Availability = {
  day: string;
  start: string;
  end: string;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  availability: Availability[];
};

type Nurse = {
  id: string;
  name: string;
  department: string;
  availability: Availability[];
};

type SectionType = "hero" | "text" | "image";

export type BlogSection = {
  id: string;
  type: SectionType;
  title?: string;
  content?: string;
  image?: string;
};

type Blog = {
  id: string;
  title: string;
  sections: BlogSection[];
};

type Person = Doctor | Nurse;

/* ---------------- COMPONENT ---------------- */

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "doctors" | "nurses" | "availability" | "blog"
  >("dashboard");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  /* ---------------- DOCTOR / NURSE ---------------- */

  const addDoctor = () =>
    setDoctors((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Doctor Name",
        specialty: "General",
        availability: [],
      },
    ]);

  const addNurse = () =>
    setNurses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Nurse Name",
        department: "Emergency",
        availability: [],
      },
    ]);

  const addAvailability = (id: string, type: "doctor" | "nurse") => {
    const slot: Availability = {
      day: "Monday",
      start: "08:00",
      end: "16:00",
    };

    if (type === "doctor") {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, availability: [...d.availability, slot] }
            : d
        )
      );
    } else {
      setNurses((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, availability: [...n.availability, slot] }
            : n
        )
      );
    }
  };

  /* ---------------- BLOG ---------------- */

  const addBlog = () => {
    const blog: Blog = {
      id: crypto.randomUUID(),
      title: "New Article",
      sections: [],
    };
    setBlogs((prev) => [blog, ...prev]);
  };

  const updateBlog = (updated: Blog) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
    setSelectedBlog(updated);
  };

  const addSection = (type: SectionType) => {
    if (!selectedBlog) return;

    const section: BlogSection = {
      id: crypto.randomUUID(),
      type,
      title: "",
      content: "",
    };

    updateBlog({
      ...selectedBlog,
      sections: [...selectedBlog.sections, section],
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex min-h-screen bg-gray-100 mt-10">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold">Clinic Panel</h1>

        <nav className="space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => setActiveTab("dashboard")} />
          <NavItem icon={Stethoscope} label="Doctors" onClick={() => setActiveTab("doctors")} />
          <NavItem icon={UserPlus} label="Nurses" onClick={() => setActiveTab("nurses")} />
          <NavItem icon={Calendar} label="Availability" onClick={() => setActiveTab("availability")} />
          <NavItem icon={FileText} label="Blog CMS" onClick={() => setActiveTab("blog")} />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 space-y-6">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <motion.div className="grid grid-cols-3 gap-6">
            <Stat title="Doctors" value={doctors.length} />
            <Stat title="Nurses" value={nurses.length} />
            <Stat title="Blogs" value={blogs.length} />
          </motion.div>
        )}

        {/* DOCTORS */}
        {activeTab === "doctors" && (
          <Section title="Doctors" action={{ label: "Add", onClick: addDoctor }}>
            {doctors.map((d) => (
              <Card key={d.id}>
                <div>
                  <input
                    value={d.name}
                    onChange={(e) =>
                      setDoctors((prev) =>
                        prev.map((doc) =>
                          doc.id === d.id
                            ? { ...doc, name: e.target.value }
                            : doc
                        )
                      )
                    }
                  />
                  <input
                    value={d.specialty}
                    onChange={(e) =>
                      setDoctors((prev) =>
                        prev.map((doc) =>
                          doc.id === d.id
                            ? { ...doc, specialty: e.target.value }
                            : doc
                        )
                      )
                    }
                  />
                </div>

                <button onClick={() => addAvailability(d.id, "doctor")}>
                  + Slot
                </button>
              </Card>
            ))}
          </Section>
        )}

        {/* AVAILABILITY */}
        {activeTab === "availability" && (
          <Section title="Schedules">
            <Grid>
              {[...doctors, ...nurses].map((p: Person) => (
                <Card key={p.id}>
                  <div>
                    <h3>{p.name}</h3>
                    {p.availability.map((a, i) => (
                      <p key={i}>
                        {a.day} {a.start}-{a.end}
                      </p>
                    ))}
                  </div>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* BLOG */}
        {activeTab === "blog" && (
          <div className="grid grid-cols-3 gap-6">
            <div>
              <button onClick={addBlog}>+ Blog</button>

              {blogs.map((b) => (
                <div key={b.id} onClick={() => setSelectedBlog(b)}>
                  {b.title}
                </div>
              ))}
            </div>

            <div className="col-span-2 space-y-4">
              {selectedBlog && (
                <>
                  <input
                    value={selectedBlog.title}
                    onChange={(e) =>
                      updateBlog({ ...selectedBlog, title: e.target.value })
                    }
                  />

                  <div className="flex gap-2">
                    <Btn onClick={() => addSection("hero")} label="Hero" />
                    <Btn onClick={() => addSection("text")} label="Text" />
                    <Btn onClick={() => addSection("image")} label="Image" />
                  </div>

                  {selectedBlog.sections.map((sec) => (
                    <BlogSectionEditor
                      key={sec.id}
                      section={sec}
                      onChange={(updated: BlogSection) => {
                        updateBlog({
                          ...selectedBlog,
                          sections: selectedBlog.sections.map((s) =>
                            s.id === sec.id ? updated : s
                          ),
                        });
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------- BLOG SECTION ---------------- */

type BlogSectionEditorProps = {
  section: BlogSection;
  onChange: (updated: BlogSection) => void;
};

function BlogSectionEditor({ section, onChange }: BlogSectionEditorProps) {
  return (
    <div className="bg-white p-4 border rounded-xl space-y-2">
      <div className="flex gap-2 text-sm text-gray-500">
        <Layers size={14} /> {section.type}
      </div>

      {(section.type === "hero" || section.type === "text") && (
        <>
          <input
            value={section.title}
            onChange={(e) =>
              onChange({ ...section, title: e.target.value })
            }
          />
          <textarea
            value={section.content}
            onChange={(e) =>
              onChange({ ...section, content: e.target.value })
            }
          />
        </>
      )}

      {section.type === "image" && (
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange({ ...section, image: URL.createObjectURL(file) });
          }}
        />
      )}
    </div>
  );
}

/* ---------------- UI ---------------- */

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
};

function NavItem({ icon: Icon, label, onClick }: NavItemProps) {
  return (
    <button onClick={onClick} className="flex gap-2 w-full">
      <Icon size={18} /> {label}
    </button>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h2>{title}</h2>
        {action && <button onClick={action.onClick}>{action.label}</button>}
      </div>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white p-4 border flex justify-between">{children}</div>;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 border">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

function Btn({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}