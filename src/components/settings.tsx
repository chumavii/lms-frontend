import { useEffect, useState } from "react";
import { Loader2, AlertCircle, User, Settings as SettingsIcon } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
}

interface UserSettings {
  fullName: string;
  email: string;
  roles: string[];
  preferences: UserPreferences;
}

function Settings() {
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch user"))
      .then(data => {
        // Ensure preferences exist
        setUser({
          ...data,
          preferences: data.preferences || { notifications: false, darkMode: false },
        });
      })
      .catch(err => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-[#4e8ccf]" />
        <span className="ml-3 text-[#4e8ccf]">Loading settings...</span>
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

  if (!user) return null;

  return (
    <div className="page-div">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Manage your profile and preferences</p>
      </div>

      {/* Account Info */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-6 text-gray-900">
          <User className="w-5 h-5 mr-3 text-orange-400" /> Account Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Full Name</p>
            <p className="text-gray-900 font-semibold">{user.fullName}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Email</p>
            <p className="text-gray-900 font-semibold">{user.email}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Role</p>
            <p className="text-gray-900 font-semibold">{user.roles.join(", ")}</p>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-6 text-gray-900">
          <SettingsIcon className="w-5 h-5 mr-3 text-orange-400" /> Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={user.preferences?.notifications ?? false}
              className="w-5 h-5 rounded border-gray-300 text-orange-400 cursor-pointer"
              readOnly
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive updates about your courses</p>
            </div>
          </label>
          <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={user.preferences?.darkMode ?? false}
              className="w-5 h-5 rounded border-gray-300 text-orange-400 cursor-pointer"
              readOnly
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-500">Enable dark theme</p>
            </div>
          </label>
        </div>
      </section>

      {/* Save */}
      <section className="flex justify-start">
        <button className="px-6 py-3 bg-gradient-to-r from-[#1f3349] to-[#355475] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
          Save Changes
        </button>
      </section>
    </div>
  );
}

export default Settings;
