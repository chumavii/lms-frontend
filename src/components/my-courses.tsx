import { useEffect, useState } from "react";
import { Loader2, AlertCircle, User as UserIcon } from "lucide-react";
import { type Enrollment, getMyEnrollments } from "../services/api";

function MyCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }

    async function fetchEnrollments() {
      try {
        setLoading(true);
        const myEnrollments = await getMyEnrollments();
        setEnrollments(myEnrollments);
      } catch (err: any) {
        console.error("Failed to fetch enrollments:", err);
        setError(err.message || "Failed to load enrollments");
      }finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin w-6 h-6 text-[#4e8ccf]" />
        <span className="ml-2 text-[#4e8ccf]">Loading your courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="page-div">
      <h2 className="text-2xl font-bold mb-6 text-[#4e8ccf]">My Courses</h2>

      {enrollments.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any courses yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {enrollments.map((enrollment) => (
            <li
              key={enrollment.id}
              className="card flex flex-col justify-start items-start text-left p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{enrollment.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{enrollment.description.slice(0, 75).trimEnd()}...</p>

              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <UserIcon className="w-4 h-4 text-[#f97316]" />
                {enrollment.instructorName}
              </p>

              {enrollment.progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-[#f97316] h-3 rounded-full"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCourses;
