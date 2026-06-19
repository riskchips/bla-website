import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_KEY = "bla_admin_token";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("contacts");
  
  const [contacts, setContacts] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [team, setTeam] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Notification form state
  const [notifTitle, setNotifTitle] = useState("");
  const [notifDetails, setNotifDetails] = useState("");
  const [notifDate, setNotifDate] = useState("");
  const [notifBtnName, setNotifBtnName] = useState("");
  const [notifBtnLink, setNotifBtnLink] = useState("");
  const [notifStatus, setNotifStatus] = useState(null);

  // Event form state
  const [editEventId, setEditEventId] = useState(null); // null means creating new
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventImages, setEventImages] = useState("");
  const [eventStatus, setEventStatus] = useState(null);

  // Team form state
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [teamImage, setTeamImage] = useState("");
  const [teamStatus, setTeamStatus] = useState(null);

  const token = localStorage.getItem(ADMIN_KEY);

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate("/admin-bla-x7ke", { replace: true });
  };

  const handleApiError = (res) => {
    if (res.status === 401) {
      logout();
      throw new Error("Unauthorized");
    }
    return res;
  };

  const fetchContacts = () => {
    fetch("/api/get/contact?limit=30", { headers: { "Authorization": token } })
      .then(res => handleApiError(res).json())
      .then(data => { if(data?.success) setContacts(data.contacts); })
      .catch(console.error);
  };

  const fetchGrievances = () => {
    fetch("/api/view/help?limit=30", { headers: { "Authorization": token } })
      .then(res => handleApiError(res).json())
      .then(data => { if(data?.success) setGrievances(data.helpRequests); })
      .catch(console.error);
  };

  const fetchNotifications = () => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => { if(data?.success) setNotifications(data.notifications); })
      .catch(console.error);
  };

  const fetchTeam = () => {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => { if(data?.success) setTeam(data.team); })
      .catch(console.error);
  };

  const fetchEvents = () => {
    fetch("/api/get/events")
      .then(res => res.json())
      .then(data => { if(data?.success) setEvents(data.events); })
      .catch(console.error);
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-bla-x7ke", { replace: true });
      return;
    }
    if (activeTab === "contacts") fetchContacts();
    else if (activeTab === "help") fetchGrievances();
    else if (activeTab === "notify") fetchNotifications();
    else if (activeTab === "team") fetchTeam();
    else if (activeTab === "events") fetchEvents();
  }, [activeTab, token, navigate]);

  // --- Deletion Functions ---
  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const res = await fetch(`/api/delete/contact/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      handleApiError(res);
      fetchContacts();
    } catch (e) { console.error(e); }
  };

  const deleteHelp = async (id) => {
    if (!window.confirm("Are you sure you want to delete this help request?")) return;
    try {
      const res = await fetch(`/api/delete/help/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      handleApiError(res);
      fetchGrievances();
    } catch (e) { console.error(e); }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      const res = await fetch(`/api/delete/notification/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      handleApiError(res);
      fetchNotifications();
    } catch (e) { console.error(e); }
  };

  const deleteTeamMember = async (id) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) return;
    try {
      const res = await fetch(`/api/delete/team/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      handleApiError(res);
      fetchTeam();
    } catch (e) { console.error(e); }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/delete/event/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      handleApiError(res);
      fetchEvents();
      if (editEventId === id) {
        setEditEventId(null);
        setEventName(""); setEventDesc(""); setEventDate(""); setEventImages("");
      }
    } catch (e) { console.error(e); }
  };

  // --- Creation & Updating Functions ---
  const submitNotification = async (e) => {
    e.preventDefault();
    setNotifStatus("Submitting...");
    const buttons = notifBtnName && notifBtnLink ? [{ name: notifBtnName, link: notifBtnLink }] : [];
    
    try {
      const res = await fetch("/api/create/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ title: notifTitle, details: notifDetails, date: notifDate, buttons })
      });
      handleApiError(res);
      const data = await res.json();
      if (data.success) {
        setNotifStatus("Notification created successfully!");
        setNotifTitle(""); setNotifDetails(""); setNotifDate(""); setNotifBtnName(""); setNotifBtnLink("");
        fetchNotifications();
      } else {
        setNotifStatus(data.message || "Failed to create.");
      }
    } catch (err) {
      setNotifStatus("Error connecting to server.");
    }
  };

  const startEditEvent = (id, ev) => {
    setEditEventId(id);
    setEventName(ev.name);
    setEventDesc(ev.description);
    
    // Format timestamp to YYYY-MM-DD for date input
    const d = new Date(parseInt(ev.timestamp));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setEventDate(`${year}-${month}-${day}`);
    
    setEventImages((ev.gallery || []).join(",\n"));
    setEventStatus(null);
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    setEventStatus("Submitting...");
    
    const d = new Date(eventDate);
    if (isNaN(d.getTime())) {
      setEventStatus("Invalid date.");
      return;
    }
    const timestamp = d.getTime().toString();
    const gallery = eventImages.split(',').map(s => s.trim()).filter(Boolean);

    const isEdit = editEventId !== null;
    const url = isEdit ? `/api/update/event/${editEventId}` : "/api/create/event";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ name: eventName, description: eventDesc, timestamp, gallery })
      });
      handleApiError(res);
      const data = await res.json();
      if (data.success) {
        setEventStatus(`Event ${isEdit ? "updated" : "created"} successfully!`);
        setEventName(""); setEventDesc(""); setEventDate(""); setEventImages("");
        setEditEventId(null);
        fetchEvents();
      } else {
        setEventStatus(data.message || "Failed to submit.");
      }
    } catch (err) {
      setEventStatus("Error connecting to server.");
    }
  };

  const submitTeam = async (e) => {
    e.preventDefault();
    setTeamStatus("Submitting...");
    try {
      const res = await fetch("/api/create/team", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ name: teamName, role: teamRole, description: teamDesc, image: teamImage })
      });
      handleApiError(res);
      const data = await res.json();
      if (data.success) {
        setTeamStatus("Team member added successfully!");
        setTeamName(""); setTeamRole(""); setTeamDesc(""); setTeamImage("");
        fetchTeam();
      } else {
        setTeamStatus(data.message || "Failed to create.");
      }
    } catch (err) {
      setTeamStatus("Error connecting to server.");
    }
  };

  const tabs = [
    { id: "contacts", label: "Contacts" },
    { id: "help", label: "Help Requests" },
    { id: "notify", label: "Notifications" },
    { id: "events", label: "Events" },
    { id: "team", label: "Team Management" }
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-cream)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "var(--deep-red)", margin: 0, fontFamily: "var(--font-en-display)" }}>Admin Dashboard</h1>
            <p style={{ color: "var(--ink-soft)", margin: "4px 0 0" }}>BLA — internal control panel</p>
          </div>
          <button className="btn ghost cursor-target" onClick={logout}>Logout</button>
        </header>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button 
              key={t.id} 
              className={`btn cursor-target ${activeTab === t.id ? "" : "ghost"}`} 
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: "20px" }}>
          {activeTab === "contacts" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Recent Contacts</h2>
              {contacts.length === 0 ? <p>No contacts found.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {contacts.map(c => (
                    <div key={c.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", position: "relative" }}>
                      <strong>{c.name}</strong> ({c.email || "No Email"} | {c.phone || "No Phone"})
                      <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{c.details}</p>
                      <small style={{ color: "var(--ink-soft)" }}>{new Date(c.unix_timestamp).toLocaleString()}</small>
                      <button onClick={() => deleteContact(c.id)} className="btn cursor-target" style={{ position: "absolute", top: "10px", right: "10px", background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem" }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "help" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Recent Help Requests</h2>
              {grievances.length === 0 ? <p>No help requests found.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {grievances.map(g => (
                    <div key={g.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", position: "relative" }}>
                      <strong>{g.name}</strong> - {g.subject} ({g.category})
                      <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{g.details}</p>
                      <small style={{ color: "var(--ink-soft)" }}>{g.email} | {g.phone} | {new Date(g.created_at).toLocaleString()}</small>
                      <button onClick={() => deleteHelp(g.id)} className="btn cursor-target" style={{ position: "absolute", top: "10px", right: "10px", background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem" }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "notify" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Active Notifications</h2>
              {notifications.length === 0 ? <p>No notifications active.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", position: "relative" }}>
                      <strong>{n.title}</strong> - {n.date}
                      <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{n.details}</p>
                      <button onClick={() => deleteNotification(n.id)} className="btn cursor-target" style={{ position: "absolute", top: "10px", right: "10px", background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem" }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}

              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", marginTop: "20px" }}>Create Notification</h2>
              <form onSubmit={submitNotification} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px" }}>
                <div className="field">
                  <label className="label">Title</label>
                  <input className="input" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Details</label>
                  <textarea className="input" value={notifDetails} onChange={e => setNotifDetails(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Date String (e.g. 15 March, 2026)</label>
                  <input className="input" value={notifDate} onChange={e => setNotifDate(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Button Name (Optional)</label>
                  <input className="input" value={notifBtnName} onChange={e => setNotifBtnName(e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Button Link (Optional)</label>
                  <input className="input" value={notifBtnLink} onChange={e => setNotifBtnLink(e.target.value)} />
                </div>
                {notifStatus && <p style={{ color: "var(--terracotta)" }}>{notifStatus}</p>}
                <button type="submit" className="btn cursor-target">Create Notification</button>
              </form>
            </div>
          )}

          {activeTab === "events" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Current Events</h2>
              {events.length === 0 ? <p>No events found.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                  {events.map((ev) => (
                    <div key={ev.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", position: "relative" }}>
                      <strong>{ev.name}</strong> - {new Date(parseInt(ev.timestamp)).toLocaleDateString()}
                      <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{ev.description}</p>
                      <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "var(--ink-soft)" }}>Images: {ev.gallery?.length || 0}</p>
                      <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                        <button onClick={() => startEditEvent(ev.id, ev)} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Edit</button>
                        <button onClick={() => deleteEvent(ev.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", maxWidth: "500px" }}>
                <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0 }}>
                  {editEventId !== null ? "Edit Event" : "Create Event"}
                </h2>
                {editEventId !== null && (
                  <button onClick={() => { setEditEventId(null); setEventName(""); setEventDesc(""); setEventDate(""); setEventImages(""); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Cancel Edit</button>
                )}
              </div>
              <form onSubmit={submitEvent} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px", marginTop: "15px" }}>
                <div className="field">
                  <label className="label">Event Name</label>
                  <input className="input" value={eventName} onChange={e => setEventName(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Description</label>
                  <textarea className="input" value={eventDesc} onChange={e => setEventDesc(e.target.value)} required rows={4} />
                </div>
                <div className="field">
                  <label className="label">Date</label>
                  <input type="date" className="input" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Gallery Image URLs (Comma separated, Optional)</label>
                  <textarea className="input" value={eventImages} onChange={e => setEventImages(e.target.value)} rows={5} placeholder="https://example.com/image1.jpg,&#10;https://example.com/image2.jpg" />
                </div>
                {eventStatus && <p style={{ color: "var(--terracotta)" }}>{eventStatus}</p>}
                <button type="submit" className="btn cursor-target">{editEventId !== null ? "Update Event" : "Create Event"}</button>
              </form>
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Team Members</h2>
              {team.length === 0 ? <p>No team members found.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                  {team.map((member) => (
                    <div key={member.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", position: "relative" }}>
                      <strong>{member.name}</strong> - {member.role}
                      <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{member.description}</p>
                      <button onClick={() => deleteTeamMember(member.id)} className="btn cursor-target" style={{ position: "absolute", top: "10px", right: "10px", background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem" }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}

              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", marginTop: "20px" }}>Add Team Member</h2>
              <form onSubmit={submitTeam} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px" }}>
                <div className="field">
                  <label className="label">Name</label>
                  <input className="input" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Role</label>
                  <input className="input" value={teamRole} onChange={e => setTeamRole(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Description</label>
                  <textarea className="input" value={teamDesc} onChange={e => setTeamDesc(e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Image URL</label>
                  <input className="input" value={teamImage} onChange={e => setTeamImage(e.target.value)} />
                </div>
                {teamStatus && <p style={{ color: "var(--terracotta)" }}>{teamStatus}</p>}
                <button type="submit" className="btn cursor-target">Add Member</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
