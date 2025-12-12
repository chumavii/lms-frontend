import { useEffect, useState } from 'react';
import { Trash2, Edit2, Search } from 'lucide-react';
import { getCourses, deleteCourse } from '../services/api';
import type { Course } from '../services/api';

function AdminManageCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            setLoading(true);
            const data = await getCourses();
            setCourses(data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteCourse(id);
            setCourses(courses.filter(c => c.id !== id));
            setDeleteConfirm(null);
        } catch (err: any) {
            setError(err.message || 'Failed to delete course');
        }
    }

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page-div">
                <div className="text-center py-12">
                    <p className="text-gray-600">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-div">
            <div className="page-header">
                <h2>Manage All Courses</h2>
                <p>View and manage all courses in the system</p>
            </div>

            {error && (
                <div className="error-banner">
                    <p className="error-text">{error}</p>
                </div>
            )}

            <div className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title or instructor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600">No courses found</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Instructor</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map(course => (
                                <tr key={course.id}>
                                    <td className="font-semibold">{course.title}</td>
                                    <td className="text-sm text-gray-600">{course.description.substring(0, 50)}...</td>
                                    <td>{course.instructorName}</td>
                                    <td>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            Published
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="p-2 text-gray-600 hover:text-blue-600 transition"
                                                title="Edit course"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(course.id)}
                                                className="p-2 text-gray-600 hover:text-red-600 transition"
                                                title="Delete course"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {deleteConfirm !== null && (
                <>
                    <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-sm z-50 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminManageCourses;
