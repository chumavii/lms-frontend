import { useEffect, useState, useRef } from "react";
import { type User, getUsers } from "../services/api";
import { Loader2, AlertCircle, Filter, ChevronDown } from "lucide-react";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

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

  const handleAction = (action: string) => {
    console.log("Action:", action, "on", selectedUsers);
    setShowActions(false);
    setSelectedUsers([]);
  };

  const renderStatus = (isApproved: boolean) => {
    return isApproved ? "Active" : "Inactive";
  };

  return (
    <div className="page-div sm:p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#4e8ccf]">Users</h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 w-full">
        <div className="relative w-full sm:w-auto">
          <button
            disabled={selectedUsers.length === 0}
            onClick={() => setShowActions((prev) => !prev)}
            className={`btn-primary flex items-center gap-2 px-4 py-2 w-full sm:w-auto justify-between ${
              selectedUsers.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Actions <ChevronDown className="w-4 h-4" />
          </button>

          {showActions && selectedUsers.length > 0 && (
            <div className="absolute mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 flex flex-col gap-1">
              {["Activate", "Deactivate", "Change role", "Delete"].map((a) => (
                <button
                  key={a}
                  onClick={() => handleAction(a)}
                  className="text-left w-full px-2 py-1 hover:bg-gray-100 rounded text-sm"
                >
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
            className="text-input flex-1 max-w-sm"
          />
          <button
            className="p-2 rounded hover:bg-gray-200"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter className="w-5 h-5" />
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
              <label className="block mb-2 text-sm font-medium">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-input w-full"
              >
                <option value="">All Roles</option>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                onClick={() => setRoleFilter("")}
                className="mt-2 text-sm underline text-blue-500"
              >
                Reset
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
        <div className="overflow-x-auto rounded-lg border border-gray-200 hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
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
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => toggleSelect(user.email)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{user.fullName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
                  </td>
                  <td className="px-4 py-3">{renderStatus(user.isApproved)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && !error && (
        <div className="sm:hidden flex flex-col gap-2">
          {filteredUsers.map((user) => (
            <div key={user.email} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{user.fullName}</span>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.email)}
                  onChange={() => toggleSelect(user.email)}
                />
              </div>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">
                {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
              </p>
              <p className="text-sm text-gray-500">Status: {renderStatus(user.isApproved)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
