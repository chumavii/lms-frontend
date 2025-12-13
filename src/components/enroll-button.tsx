import { useState } from "react";

interface EnrollButtonProps {
  courseId: number;
  onSuccess?: () => void;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EnrollButton({ courseId, onSuccess }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEnroll() {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/enrollments/enroll/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Enrollment failed");
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="btn-enroll px-4 py-2"
      >
        {loading ? "Enrolling..." : "Enroll"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default EnrollButton;
