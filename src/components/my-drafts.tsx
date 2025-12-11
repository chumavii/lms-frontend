import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle, Eye, Trash2, Clock } from "lucide-react";
import { getMyDraftCourses, deleteCourse, type Course } from "../services/api";

function MyDrafts() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch instructor's draft courses
    const fetchMyDrafts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyDraftCourses();
            setCourses(data);
            setFilteredCourses(data);
        } catch (err: any) {
            setError(err.message || "Failed to load your draft courses");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDrafts();
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
        if (!window.confirm("Are you sure you want to delete this draft course?")) return;

        setActionLoading(courseId);
        try {
            await deleteCourse(courseId);
            setSuccessMessage("Draft deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
            
            setCourses(courses.filter(c => c.id !== courseId));
            setFilteredCourses(filteredCourses.filter(c => c.id !== courseId));
        } catch (err: any) {
            setError(err.message || "Failed to delete draft");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="page-div">
                <div className="page-header">
                    <h2>My Drafts</h2>
                    <p>Courses pending admin review and approval</p>
                </div>
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                    <span className="ml-2 text-gray-500">Loading your drafts...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-div">
            <div className="page-header">
                <h2>My Drafts</h2>
                <p>Courses pending admin review and approval</p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="success-banner mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
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

            {/* Search Bar */}
            <div className="mb-6 flex w-full max-w-sm gap-3">
                <input
                    type="text"
                    placeholder="Search your drafts"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-input modern w-full"
                />
                <Link
                    to="/add-course"
                    className="px-4 py-3 bg-gradient-to-r from-[#1f3349] to-[#355475] text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
                >
                    + New Course
                </Link>
            </div>

            {/* No Drafts */}
            {filteredCourses.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                    <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-600 font-medium">No draft courses</p>
                    <p className="text-gray-500 text-sm mb-4">All your courses are published or you haven't created any drafts yet</p>
                    <Link
                        to="/add-course"
                        className="inline-block px-6 py-2 bg-gradient-to-r from-[#1f3349] to-[#355475] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                        Create Course
                    </Link>
                </div>
            ) : (
                /* Draft Courses Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white border-2 border-yellow-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{course.title}</h3>
                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex-shrink-0 ml-2">
                                    {course.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                            
                            {/* Status Info */}
                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4">
                                <p className="text-xs text-yellow-700 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Awaiting admin approval
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
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

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">About Draft Courses</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Draft courses are submitted for admin review and approval</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Once approved, your course will be published and visible to all students</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>You can delete a draft if you'd like to modify and resubmit it</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Check your "My Courses" page to see all published courses</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default MyDrafts;
