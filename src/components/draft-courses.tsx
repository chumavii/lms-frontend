import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle, Trash2, Eye } from "lucide-react";
import { publishCourse, deleteCourse } from "../services/api";

interface DraftCourse {
    id: number;
    title: string;
    description: string;
    instructorName: string;
    instructorEmail: string;
    status: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DraftCourses() {
    const [courses, setCourses] = useState<DraftCourse[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<DraftCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch draft courses
    const fetchDraftCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/courses/draft`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch draft courses");
            }

            const data = await response.json();
            setCourses(data);
            setFilteredCourses(data);
        } catch (err: any) {
            setError(err.message || "Failed to load draft courses");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDraftCourses();
    }, []);

    // Search filter
    useEffect(() => {
        if (!searchTerm) {
            setFilteredCourses(courses);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredCourses(
                courses.filter(
                    c =>
                        c.title.toLowerCase().includes(term) ||
                        c.instructorName.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, courses]);

    // Handle publish
    const handlePublish = async (courseId: number) => {
        setActionLoading(courseId);
        setActionError(null);
        try {
            await publishCourse(courseId);
            setSuccessMessage("Course published successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
            
            // Remove from list
            setCourses(courses.filter(c => c.id !== courseId));
            setFilteredCourses(filteredCourses.filter(c => c.id !== courseId));
        } catch (err: any) {
            setActionError(err.message || "Failed to publish course");
        } finally {
            setActionLoading(null);
        }
    };

    // Handle delete
    const handleDelete = async (courseId: number) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        setActionLoading(courseId);
        setActionError(null);
        try {
            await deleteCourse(courseId);
            setSuccessMessage("Course deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
            
            // Remove from list
            setCourses(courses.filter(c => c.id !== courseId));
            setFilteredCourses(filteredCourses.filter(c => c.id !== courseId));
        } catch (err: any) {
            setActionError(err.message || "Failed to delete course");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="page-div">
                <div className="page-header">
                    <h2>Draft Courses</h2>
                    <p>Review and publish courses awaiting approval</p>
                </div>
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                    <span className="ml-2 text-gray-500">Loading draft courses...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-div">
            <div className="page-header">
                <h2>Draft Courses</h2>
                <p>Review and publish courses awaiting approval</p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="success-banner mb-6 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="success-text">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="error-banner mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="error-text">{error}</p>
                </div>
            )}

            {actionError && (
                <div className="error-banner mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="error-text">{actionError}</p>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6 flex w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Search by course name or instructor"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-input modern w-full"
                />
            </div>

            {/* No Courses */}
            {filteredCourses.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                    <Eye className="w-12 h-12 text-blue-400 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-600 font-medium">No draft courses found</p>
                    <p className="text-gray-500 text-sm">All courses have been published or there are no courses awaiting review.</p>
                </div>
            ) : (
                /* Courses Table */
                <div className="table-container overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Instructor</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
                                <tr key={course.id}>
                                    <td className="font-semibold text-gray-900">{course.title}</td>
                                    <td>
                                        <div>
                                            <p className="text-gray-900 font-medium">{course.instructorName}</p>
                                            <p className="text-xs text-gray-500">{course.instructorEmail}</p>
                                        </div>
                                    </td>
                                    <td className="text-gray-600 text-sm max-w-xs truncate">{course.description}</td>
                                    <td>
                                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                            {course.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePublish(course.id)}
                                                disabled={actionLoading === course.id}
                                                className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {actionLoading === course.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                Publish
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                disabled={actionLoading === course.id}
                                                className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {actionLoading === course.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DraftCourses;
