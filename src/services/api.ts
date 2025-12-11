const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Course {
    id: number;
    title: string;
    name?: string;
    description: string;
    instructorName: string;
    instructorEmail?: string;
    status?: string;
}

export interface User {
    fullName: string;
    email: string;
    roles: string;
    isApproved: boolean;
}

export interface Enrollment {
    id: string;
    userId: string;
    fullName: string;
    courseId: number;
    title: string;
    description: string;
    progress: number;
    createdAt: string;
    instructorName?: string;
    instructorEmail?: string;
}

// Fetch all courses
export async function getCourses(): Promise<Course[]> {
    const response = await fetch(`${BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return await response.json();
}

// Fetch all users (admin)
export async function getUsers(): Promise<User[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/auth/users`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
}

// Fetch current student's enrollments
export async function getMyEnrollments(): Promise<Enrollment[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/enrollments/myenrollments`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch enrollments");
    return await response.json();
}

// Enroll in a course
export async function enroll(courseId: number): Promise<Enrollment> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/enrollments/enroll/${courseId}/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "Enrollment failed");
    }

    return await response.json();
}

// Create a new course (instructor/admin)
export async function createCourse(courseData: {
    title: string;
    description: string;
    isDraft: boolean;
}): Promise<Course> {
    const token = localStorage.getItem("token");
    const payload = {
        Title: courseData.title,
        Description: courseData.description,
        IsDraft: courseData.isDraft
    };
    const response = await fetch(`${BASE_URL}/courses`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create course");
    }

    return await response.json();
}

// Get a single course by ID
export async function getCourseById(id: number): Promise<Course> {
    const response = await fetch(`${BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return await response.json();
}

// Update an existing course (instructor/admin)
export async function updateCourse(id: number, courseData: {
    title: string;
    description: string;
}): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/courses/update/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to update course");
    }
}

// Delete a course (admin only)
export async function deleteCourse(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete course");
    }
}

// Publish a course (admin only)
export async function publishCourse(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/courses/publish/${id}`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to publish course");
    }
}

// Reassign a course to a different instructor (admin only)
export async function reassignCourse(courseId: number, instructorId: string): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/courses/reassign/`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, instructorId })
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to reassign course");
    }

    return await response.json();
}

// Get all draft courses (admin only) - returns all instructors' drafts
export async function getDraftCourses(): Promise<Course[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/courses/draft`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch draft courses');
    return await response.json();
}

// Get instructor's draft courses (instructor only) - returns only current instructor's drafts
export async function getMyDraftCourses(): Promise<Course[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/courses/my-drafts`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch your draft courses');
    return await response.json();
}
