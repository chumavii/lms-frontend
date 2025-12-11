import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context"
import { BookOpen, Calendar, TrendingUp, UserPen, List, Replace, FilePlus2, SquarePen, Users, BookMarked, BarChart3, Award, Clock, Star } from "lucide-react";

function Dashboard() {
    const { fullName, roles } = useAuth();

    return (
        <div className="page-div">
            <div className="dashboard-greeting">
                <h2 >Hi, {fullName} 👋</h2>
                <p className="text-sm sm:text-base mt-2 opacity-90">
                    We’re glad to have you back! Explore your courses, manage your content, or check your progress.
                </p>
            </div>

            {/* Admin Analytics Section */}
            {roles.includes("Admin") && (
                <div>
                    <h3 className="analytics-section-title">Platform Overview</h3>
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Total Users</div>
                                <div className="analytics-card-icon bg-blue-100">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">2,847</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 12% from last month</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Active Courses</div>
                                <div className="analytics-card-icon bg-orange-100">
                                    <BookMarked className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">156</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 8% from last month</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Total Enrollments</div>
                                <div className="analytics-card-icon bg-green-100">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">5,230</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 23% from last month</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Completion Rate</div>
                                <div className="analytics-card-icon bg-purple-100">
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">78.5%</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 3.2% from last month</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructor Analytics Section */}
            {roles.includes("Instructor") && !roles.includes("Admin") && (
                <div>
                    <h3 className="analytics-section-title">Teaching Performance</h3>
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Total Students</div>
                                <div className="analytics-card-icon bg-blue-100">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">342</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 18 new this month</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Active Courses</div>
                                <div className="analytics-card-icon bg-orange-100">
                                    <BookMarked className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">8</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 1 new this month</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Avg. Course Rating</div>
                                <div className="analytics-card-icon bg-yellow-100">
                                    <Star className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">4.8/5</div>
                            <div className="analytics-card-change positive">
                                <span>from 127 reviews</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Hours Taught</div>
                                <div className="analytics-card-icon bg-purple-100">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">256</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 32 hours this month</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Analytics Section */}
            {roles.includes("Student") && !roles.includes("Admin") && !roles.includes("Instructor") && (
                <div>
                    <h3 className="analytics-section-title">Learning Progress</h3>
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Enrolled Courses</div>
                                <div className="analytics-card-icon bg-blue-100">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">6</div>
                            <div className="analytics-card-change positive">
                                <span>2 in progress</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Completion Rate</div>
                                <div className="analytics-card-icon bg-green-100">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">64%</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 12% from last month</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Hours Learned</div>
                                <div className="analytics-card-icon bg-purple-100">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">124</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 18 hours this month</span>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <div className="analytics-card-title">Achievements</div>
                                <div className="analytics-card-icon bg-yellow-100">
                                    <Award className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <div className="analytics-card-value">12</div>
                            <div className="analytics-card-change positive">
                                <span>↑ 2 new this month</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard">
                {roles.includes("Student") && <Link to="/my-courses"><div className="card h3"><BookOpen />Enrolled Courses</div></Link>}
                {roles.includes("Student") && <div className="card h3"><Calendar />Upcoming Lessons</div>}
                {roles.includes("Student") && <div className="card h3"><TrendingUp />Progress Report</div>}
                {roles.includes("Admin") && <Link to="/users"><div className="card h3"><UserPen />Manage Users</div></Link>}
                {roles.includes("Admin") && <Link to="/course-list"><div className="card h3"><List />Course List</div></Link>}
                {roles.includes("Admin") && <div className="card h3"><Replace />Reassign Course</div>}
                {roles.includes("Instructor") && <Link to="/add-course"><div className="card h3"><FilePlus2 />Add Course</div></Link>}
                {roles.includes("Instructor") && <Link to="/course-list"><div className="card h3"><SquarePen />Manage Course</div></Link>}
                {roles.includes("Instructor") && <Link to="/course-list"><div className="card h3"><List />Course List</div></Link>}
            </div>
        </div>
    )
}

export default Dashboard;