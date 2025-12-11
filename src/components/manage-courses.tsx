import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle, SquarePen, Trash2, Eye } from "lucide-react";
import { useAuth } from "../contexts/auth-context";

interface InstructorCourse {
    id: number;
    title: string;
    description: string;
    status: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ManageCourses() {
    const { fullName } = useAuth();
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<InstructorCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Fetch instructor's courses
    const fetchMyCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/courses/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch your courses");
            }

            const data = await response.json();
            setCourses(data);
            setFilteredCourses(data);
        } catch (err: any) {
            setError(err.message || "Failed to load your courses");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCourses();
    }, []);

    // Search filter
    useEffect(() => {
        if (!searchTerm) {
            setFilteredCourses(courses);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredCourses(
                courses.filter(c => c.title.toLowerCase().includes(term))
            );
        }
    }, [searchTerm, courses]);

    // Handle delete
    const handleDelete = async (courseId: number) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        setActionLoading(courseId);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Failed to delete course");
            }

            setCourses(courses.filter(c => c.id !== courseId));
            setFilteredCourses(filteredCourses.filter(c => c.id !== courseId));
        } catch (err: any) {
            setError(err.message || "Failed to delete course");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="page-div">
                <div className="page-header">
                    <h2>My Courses</h2>
                    <p>Manage and edit your published courses</p>
                </div>
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                    <span className="ml-2 text-gray-500">Loading your courses...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-div">
            <div className="page-header">
                <h2>My Courses</h2>
                <p>Manage and edit your courses</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-banner mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="error-text">{error}</p>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6 flex w-full max-w-sm gap-3">
                <input
                    type="text"
                    placeholder="Search your courses"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-input modern w-full"
                />
                <Link
                    to="/add-course"
                    className="px-4 py-3 bg-gradient-to-r from-[#1f3349] to-[#355475] text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
                >
                    + Add Course
                </Link>
            </div>

            {/* No Courses */}
            {filteredCourses.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                    <SquarePen className="w-12 h-12 text-blue-400 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-600 font-medium">No courses yet</p>
                    <p className="text-gray-500 text-sm mb-4">Create your first course to start teaching</p>
                    <Link
                        to="/add-course"
                        className="inline-block px-6 py-2 bg-gradient-to-r from-[#1f3349] to-[#355475] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                        Create Course
                    </Link>
                </div>
            ) : (
                /* Courses Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{course.title}</h3>
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                                    course.status === "Published" 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-yellow-100 text-yellow-700"
                                }`}>
                                    {course.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                            
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                                <button
                                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                                >
                                    <SquarePen className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(course.id)}
                                    disabled={actionLoading === course.id}
                                    className="px-3 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {actionLoading === course.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageCourses;
