import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, addJob, updateJob, deleteJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    company: '', position: '', status: 'Applied',
    jobType: 'Full-time', location: '', notes: '',
    salaryMin: '', salaryMax: '', deadline: '', interviewDate: ''
  });
  const [editId, setEditId] = useState(null);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await getJobs();
      setJobs(data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateJob(editId, formData);
        toast.success('Job updated!');
      } else {
        await addJob(formData);
        toast.success('Job added!');
      }
      setFormData({ company: '', position: '', status: 'Applied', jobType: 'Full-time', location: '', notes: '', salaryMin: '', salaryMax: '', deadline: '', interviewDate: '' });
      setShowForm(false);
      setEditId(null);
      fetchJobs();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (job) => {
    setFormData({
      company: job.company, position: job.position,
      status: job.status, jobType: job.jobType,
      location: job.location || '', notes: job.notes || '',
      salaryMin: job.salaryMin || '', salaryMax: job.salaryMax || '',
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      interviewDate: job.interviewDate ? job.interviewDate.split('T')[0] : ''
    });
    setEditId(job._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted!');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const statusConfig = {
    'Applied':   { color: '#3b82f6', bg: '#eff6ff', icon: '📋' },
    'Interview': { color: '#f59e0b', bg: '#fffbeb', icon: '🗓️' },
    'Offer':     { color: '#10b981', bg: '#ecfdf5', icon: '🎉' },
    'Rejected':  { color: '#ef4444', bg: '#fef2f2', icon: '❌' },
  };

  const filteredJobs = jobs.filter(job => {
    const matchStatus = filterStatus === 'All' || job.status === filterStatus;
    const matchSearch = job.company.toLowerCase().includes(search.toLowerCase()) ||
                        job.position.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <div style={s.logo}>💼</div>
          <span style={s.logoText}>JobTracker Pro</span>
        </div>
        <div style={s.navRight}>
          <div style={s.userBadge}>
            <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <span style={s.userName}>{user?.name}</span>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      <div style={s.main}>
        {/* Header */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Job Applications</h1>
            <p style={s.pageSubtitle}>Track and manage your job search journey</p>
          </div>
          <button style={s.addBtn} onClick={() => { setShowForm(!showForm); setEditId(null); setFormData({ company: '', position: '', status: 'Applied', jobType: 'Full-time', location: '', notes: '', salaryMin: '', salaryMax: '', deadline: '', interviewDate: '' }); }}>
            {showForm ? '✕ Cancel' : '+ New Application'}
          </button>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {['Applied', 'Interview', 'Offer', 'Rejected'].map(st => (
            <div key={st} style={s.statCard} onClick={() => setFilterStatus(st === filterStatus ? 'All' : st)}>
              <div style={s.statIcon}>{statusConfig[st].icon}</div>
              <div style={s.statNum}>{jobs.filter(j => j.status === st).length}</div>
              <div style={s.statLabel}>{st}</div>
              <div style={{...s.statBar, backgroundColor: statusConfig[st].color}}></div>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div style={s.formCard}>
            <h2 style={s.formTitle}>{editId ? '✏️ Edit Application' : '➕ New Application'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={s.formSection}>
                <p style={s.sectionLabel}>Basic Info</p>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Company *</label>
                    <input style={s.input} name="company" placeholder="e.g. Google" value={formData.company} onChange={handleChange} required />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Position *</label>
                    <input style={s.input} name="position" placeholder="e.g. Software Engineer" value={formData.position} onChange={handleChange} required />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Status</label>
                    <select style={s.input} name="status" value={formData.status} onChange={handleChange}>
                      <option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option>
                    </select>
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Job Type</label>
                    <select style={s.input} name="jobType" value={formData.jobType} onChange={handleChange}>
                      <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Remote</option>
                    </select>
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Location</label>
                    <input style={s.input} name="location" placeholder="e.g. Bangalore" value={formData.location} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div style={s.formSection}>
                <p style={s.sectionLabel}>Salary & Dates</p>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Min Salary (₹ LPA)</label>
                    <input style={s.input} type="number" name="salaryMin" placeholder="e.g. 8" value={formData.salaryMin} onChange={handleChange} />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Max Salary (₹ LPA)</label>
                    <input style={s.input} type="number" name="salaryMax" placeholder="e.g. 15" value={formData.salaryMax} onChange={handleChange} />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Application Deadline</label>
                    <input style={s.input} type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Interview Date</label>
                    <input style={s.input} type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div style={s.formSection}>
                <p style={s.sectionLabel}>Notes</p>
                <textarea style={{...s.input, height: '80px', resize: 'vertical'}} name="notes" placeholder="Any notes about this application..." value={formData.notes} onChange={handleChange} />
              </div>

              <button style={s.submitBtn} type="submit">{editId ? 'Update Application' : 'Add Application'}</button>
            </form>
          </div>
        )}

        {/* Search & Filter */}
        <div style={s.toolbar}>
          <input style={s.searchInput} placeholder="🔍  Search by company or position..." value={search} onChange={e => setSearch(e.target.value)} />
          <div style={s.filterGroup}>
            {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(st => (
              <button key={st} style={{...s.filterBtn, ...(filterStatus === st ? s.filterActive : {})}} onClick={() => setFilterStatus(st)}>{st}</button>
            ))}
          </div>
        </div>

        {/* Jobs */}
        {loading ? (
          <div style={s.emptyState}><p>Loading...</p></div>
        ) : filteredJobs.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>📭</div>
            <p style={s.emptyText}>{search || filterStatus !== 'All' ? 'No matching applications found.' : 'No applications yet. Click "+ New Application" to start!'}</p>
          </div>
        ) : (
          <div style={s.jobsGrid}>
            {filteredJobs.map(job => (
              <div key={job._id} style={s.jobCard}>
                <div style={s.jobCardTop}>
                  <div style={{...s.statusDot, backgroundColor: statusConfig[job.status]?.color}}></div>
                  <span style={{...s.statusBadge, color: statusConfig[job.status]?.color, backgroundColor: statusConfig[job.status]?.bg}}>
                    {statusConfig[job.status]?.icon} {job.status}
                  </span>
                </div>
                <h3 style={s.jobPosition}>{job.position}</h3>
                <p style={s.jobCompany}>🏢 {job.company}</p>
                <div style={s.jobMeta}>
                  {job.location && <span style={s.metaTag}>📍 {job.location}</span>}
                  <span style={s.metaTag}>💼 {job.jobType}</span>
                  {job.salaryMin && job.salaryMax && <span style={s.metaTag}>💰 ₹{job.salaryMin}–{job.salaryMax} LPA</span>}
                </div>
                {job.interviewDate && (
                  <div style={s.dateRow}>
                    <span style={s.dateTag}>🗓️ Interview: {formatDate(job.interviewDate)}</span>
                  </div>
                )}
                {job.deadline && (
                  <div style={s.dateRow}>
                    <span style={s.dateTag}>⏰ Deadline: {formatDate(job.deadline)}</span>
                  </div>
                )}
                {job.notes && <p style={s.jobNotes}>📝 {job.notes}</p>}
                <div style={s.jobActions}>
                  <button style={s.editBtn} onClick={() => handleEdit(job)}>✏️ Edit</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(job._id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Segoe UI', sans-serif" },
  navbar: { backgroundColor: '#0f172a', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { fontSize: '24px' },
  logoText: { color: 'white', fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' },
  userName: { color: '#cbd5e1', fontSize: '14px' },
  logoutBtn: { padding: '8px 18px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  pageTitle: { fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 },
  pageSubtitle: { color: '#64748b', margin: '4px 0 0', fontSize: '14px' },
  addBtn: { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
  statCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statNum: { fontSize: '36px', fontWeight: '800', color: '#0f172a', lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  statBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px' },
  formCard: { backgroundColor: 'white', borderRadius: '12px', padding: '28px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  formTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', marginTop: 0 },
  formSection: { marginBottom: '20px' },
  sectionLabel: { fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginTop: 0 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f8fafc' },
  submitBtn: { padding: '12px 28px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  toolbar: { display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' },
  searchInput: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white', outline: 'none', minWidth: '200px' },
  filterGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
  filterActive: { backgroundColor: '#3b82f6', color: 'white', border: '1px solid #3b82f6' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyText: { color: '#94a3b8', fontSize: '16px' },
  jobsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  jobCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'relative' },
  jobCardTop: { display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' },
  statusDot: { display: 'none' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  jobPosition: { fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  jobCompany: { fontSize: '14px', color: '#64748b', margin: '0 0 12px' },
  jobMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' },
  metaTag: { fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px' },
  dateRow: { marginBottom: '6px' },
  dateTag: { fontSize: '12px', color: '#64748b' },
  jobNotes: { fontSize: '13px', color: '#94a3b8', margin: '10px 0', borderLeft: '3px solid #e2e8f0', paddingLeft: '10px' },
  jobActions: { display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' },
  editBtn: { padding: '7px 16px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  deleteBtn: { padding: '7px 16px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
};

export default Dashboard;