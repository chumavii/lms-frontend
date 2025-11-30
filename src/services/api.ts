const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Course {
    id: number;
    title: string;
    name?: string;
    description: string;
    instructorName: string;
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
