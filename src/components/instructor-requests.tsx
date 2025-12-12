import { useEffect, useState, useMemo, useRef } from "react";
import {
    Loader2,
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Filter,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface InstructorRequest {
    requestedAt: string | number | Date;
    id: number;
    fullName?: string;
    email?: string;
    status: string;
    dateRequested?: string;
}

function InstructorRequests() {
    const [requests, setRequests] = useState<InstructorRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("0"); // Default: Pending
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const token = localStorage.getItem("token");

    async function fetchRequests() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}/instructorrequests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load instructor requests");
            const data = await res.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(id: number, action: "approve" | "reject") {
        setActionLoading(id);
        try {
            const res = await fetch(`${BASE_URL}/instructorrequests/${id}/${action}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error(`Failed to ${action} request`);
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    // Filtered requests based on search + status
    const filteredRequests = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return requests.filter(
            (r) =>
                (!statusFilter || r.status == statusFilter) &&
                (!term ||
                    r.fullName?.toLowerCase().includes(term) ||
                    r.email?.toLowerCase().includes(term))
        );
    }, [requests, searchTerm, statusFilter]);

    // Click outside to close filter dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                <span className="ml-2 text-gray-500">Loading instructor requests...</span>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
            </div>
        );

    const getStatusText = (status: string) =>
        status == "0" ? "Pending" :
        status == "1" ? "Approved" :
        status == "2" ? "Denied" :
        "Unknown";

    const getStatusColor = (status: string) =>
        status == "0" ? "text-yellow-500" :
        status == "1" ? "text-[#1f3349]" :
        status == "2" ? "text-red-500" :
        "text-gray-500";

    return (
        <div className="page-div">
            <div className="page-header">
                <h2>Instructor Requests</h2>
                <p>Review and manage instructor role requests</p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                <div className="flex items-center gap-3 relative flex-1 sm:flex-none" ref={filterRef}>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200 hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    />

                    <button
                        className="p-2 rounded hover:bg-gray-200"
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        <Filter className="w-5 h-5" />
                    </button>

                    {showFilters && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                            <label className="block mb-2 text-sm font-medium">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-input w-full"
                            >
                                <option value="0">Pending</option>
                                <option value="1">Approved</option>
                                <option value="2">Denied</option>
                                <option value="">All</option>
                            </select>
                            <button
                                onClick={() => setStatusFilter("0")}
                                className="mt-2 text-sm underline text-blue-500"
                            >
                                Reset to Pending
                            </button>
                        </div>
                    )}

                    <button
                        onClick={fetchRequests}
                        className="flex items-center gap-1 text-[#f97316] hover:text-[#ea580c] transition"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>
            </div>

            {/* Cards */}
            {filteredRequests.length === 0 ? (
                <p className="text-gray-500">There are no pending instructor requests found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredRequests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border border-gray-100"
                        >
                            <div>
                                <h3 className="text-md font-semibold text-gray-800 mb-1">
                                    {req.fullName || "Unnamed User"}
                                </h3>
                                <p className="text-xs text-gray-600 mb-1">{req.email}</p>
                                <p className="text-xs text-gray-500 mb-1">
                                    Requested: {new Date(req.requestedAt).toLocaleDateString()}
                                </p>
                                <p className={`text-xs font-medium ${getStatusColor(req.status)}`}>
                                    Status: {getStatusText(req.status)}
                                </p>
                            </div>

                            <div className="flex justify-start gap-2 mt-4">
                                <button
                                    onClick={() => handleAction(req.id, "approve")}
                                    disabled={actionLoading === req.id}
                                    className="flex items-center gap-1 bg-[#f97316] hover:bg-[#ea580c] text-white px-3 py-1.5 rounded-md text-sm transition disabled:opacity-60"
                                >
                                    {actionLoading === req.id ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, "reject")}
                                    disabled={actionLoading === req.id}
                                    className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-md text-sm transition disabled:opacity-60"
                                >
                                    {actionLoading === req.id ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                    ) : (
                                        <XCircle className="w-4 h-4" />
                                    )}
                                    Deny
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default InstructorRequests;
