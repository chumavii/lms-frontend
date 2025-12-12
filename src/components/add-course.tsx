import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { createCourse } from '../services/api';

function AddCourse() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' ? (value ? parseInt(value) : '') : value
        }));
    }

    async function handleSubmit(e: React.FormEvent, isDraft: boolean = false) {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.title.trim()) {
            setError('Course title is required');
            return;
        }

        if (!formData.description.trim()) {
            setError('Course description is required');
            return;
        }

        setLoading(true);

        try {
            await createCourse({
                title: formData.title,
                description: formData.description,
                isDraft: isDraft
            });

            setSuccess(true);
            setFormData({
                title: '',
                description: '',
            });

            // Redirect based on publish status
            setTimeout(() => {
                navigate(isDraft ? '/manage-courses' : '/course-list');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create course');
            console.error('Course creation error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-div">
            <div className="page-header">
                <h2>Create New Course</h2>
                <p>Add a new course to share your knowledge with students</p>
            </div>

            <div className="max-w-2xl">
                {/* Success Banner */}
                {success && (
                    <div className="success-banner mb-6 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="success-text">Course created successfully! Redirecting...</p>
                        </div>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="error-banner mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="error-text">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
                    {/* Title Field */}
                    <div className="form-group mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Course Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Advanced React Development"
                            className="text-input modern w-full"
                            maxLength={100}
                        />
                        <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                    </div>

                    {/* Description Field */}
                    <div className="form-group mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Course Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what students will learn in this course..."
                            className="text-input modern w-full resize-none h-32"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                    </div>



                    {/* Form Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-700 font-semibold">Publishing Options</p>
                            <p className="text-xs text-blue-600 mt-1">
                                <strong>Save as Draft:</strong> Course goes to admin review queue before publishing.
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                <strong>Publish Now:</strong> Course is immediately published and visible to students.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-orange-400 text-orange-600 font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save as Draft'
                            )}
                        </button>
                        <button
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={loading}
                            className="btn-primary modern flex-1 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                'Publish Now'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/course-list')}
                            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Additional Info Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Your course will be created</p>
                                <p className="text-xs text-gray-600">The course will be available for students to enroll</p>
                            </div>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Add course content</p>
                                <p className="text-xs text-gray-600">Upload videos, materials, and assignments to your course</p>
                            </div>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Monitor student progress</p>
                                <p className="text-xs text-gray-600">Track engagement and completion rates on your dashboard</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AddCourse;