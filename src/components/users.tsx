import { useEffect, useState, useRef } from "react";
import { type User, getUsers } from "../services/api";
import { Loader2, AlertCircle, Filter, ChevronDown } from "lucide-react";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    return (
      (!roleFilter || u.roles.includes(roleFilter)) &&
      (!search ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const toggleSelect = (email: string) => {
    setSelectedUsers((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      setShowActions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    setActionLoading(action);
    setError(undefined);

    try {
      for (const userEmail of selectedUsers) {
        const actionLower = action.toLowerCase();
        const res = await fetch(`${BASE_URL}/auth/users/${actionLower}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || `Failed to ${action} user`);
        }
      }

      // Refresh users list after successful action
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      setShowActions(false);
      setSelectedUsers([]);
    } catch (err: any) {
      setError(err.message || `Failed to perform ${action}`);
      console.error("Action error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const renderStatus = (isApproved: boolean) => {
    return isApproved ? "Active" : "Inactive";
  };

  return (
    <div className="page-div">
      <div className="page-header">
        <h2>Users</h2>
        <p>Manage platform users and their access</p>
      </div>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-auto">
          <button
            disabled={selectedUsers.length === 0 || actionLoading !== null}
            onClick={() => setShowActions((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 w-full sm:w-auto justify-between rounded-lg font-medium transition-all ${
              selectedUsers.length === 0 || actionLoading !== null
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-[#1f3349] to-[#355475] text-white hover:shadow-lg"
            }`}
          >
            Actions <ChevronDown className="w-4 h-4" />
          </button>

          {showActions && selectedUsers.length > 0 && (
            <div className="absolute mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-2xl z-10 p-2 flex flex-col gap-1">
              {["Activate", "Deactivate", "Delete"].map((a, idx) => (
                <button
                  key={a}
                  onClick={() => handleAction(a)}
                  disabled={actionLoading !== null}
                  className={`flex items-center gap-2 text-left w-full px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-60 ${
                    idx === 2 
                      ? "bg-red-50 text-red-600 hover:bg-red-100" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {actionLoading === a ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4" />
                  )}
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full sm:w-auto gap-2 items-center relative" ref={filterRef}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200 hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          />
          <button
            className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-10">
              <label className="block mb-3 text-sm font-semibold text-gray-700">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
              >
                <option value="">All Roles</option>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                onClick={() => setRoleFilter("")}
                className="mt-3 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-500">Loading users...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && !error && (
        <div className="table-container hidden sm:block">
          <table>
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    onChange={(e) =>
                      setSelectedUsers(
                        e.target.checked
                          ? filteredUsers.map((u) => u.email)
                          : []
                      )
                    }
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.email}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => toggleSelect(user.email)}
                    />
                  </td>
                  <td className="font-semibold text-gray-900">{user.fullName}</td>
                  <td className="text-gray-600">{user.email}</td>
                  <td>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      user.isApproved 
                        ? "bg-green-50 text-green-700" 
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {renderStatus(user.isApproved)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && !error && (
        <div className="sm:hidden flex flex-col gap-3">
          {filteredUsers.map((user) => (
            <div key={user.email} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={selectedUsers.includes(user.email)}
                  onChange={() => toggleSelect(user.email)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
                </span>
                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                  user.isApproved 
                    ? "bg-green-50 text-green-700" 
                    : "bg-yellow-50 text-yellow-700"
                }`}>
                  {renderStatus(user.isApproved)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
