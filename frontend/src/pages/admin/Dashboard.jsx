import { useEffect, useState, useMemo } from "react";
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
  const [categories, setCategories] = useState([]);
  
  // Notification form state
  const [notifTitle, setNotifTitle] = useState("");
  const [notifDetails, setNotifDetails] = useState("");
  const [notifDate, setNotifDate] = useState("");
  const [notifBtnName, setNotifBtnName] = useState("");
  const [notifBtnLink, setNotifBtnLink] = useState("");
  const [notifStatus, setNotifStatus] = useState(null);

  // Category form state
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySortOrder, setCategorySortOrder] = useState("0");
  const [categoryStatus, setCategoryStatus] = useState(null);
  const [draggedCatId, setDraggedCatId] = useState(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Event form state
  const [editEventId, setEditEventId] = useState(null); // null means creating new
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventImages, setEventImages] = useState("");
  const [eventPoster, setEventPoster] = useState("");
  const [eventCategoryId, setEventCategoryId] = useState("");
  const [eventStatus, setEventStatus] = useState(null);

  // Team form state
  const [editTeamId, setEditTeamId] = useState(null); // null means creating new
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [teamImage, setTeamImage] = useState("");
  const [teamBoardYear, setTeamBoardYear] = useState("2026-27");
  const [teamStatus, setTeamStatus] = useState(null);

  // About form state
  const [aboutContent, setAboutContent] = useState("");
  const [aboutStatus, setAboutStatus] = useState(null);

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
    fetch("/api/notifications", { headers: { "Authorization": token } })
      .then(res => res.json())
      .then(data => { if(data?.success) setNotifications(data.notifications); })
      .catch(console.error);
  };

  const fetchTeam = () => {
    fetch("/api/board", { headers: { "Authorization": token } })
      .then(res => res.json())
      .then(data => { if(data?.success) setTeam(data.team); })
      .catch(console.error);
  };

  const fetchCategories = () => {
    fetch("/api/get/categories", { headers: { "Authorization": token } })
      .then(res => res.json())
      .then(data => { if(data?.success) setCategories(data.categories); })
      .catch(console.error);
  };

  const fetchEvents = () => {
    fetch("/api/get/events", { headers: { "Authorization": token } })
      .then(res => res.json())
      .then(data => { if(data?.success) setEvents(data.events); })
      .catch(console.error);
  };

  const fetchAbout = () => {
    fetch("/api/about", { headers: { "Authorization": token } })
      .then(res => res.json())
      .then(data => { if(data?.success) setAboutContent(data.content); })
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
    else if (activeTab === "categories") fetchCategories();
    else if (activeTab === "about") fetchAbout();
    else if (activeTab === "events") {
      fetchEvents();
      fetchCategories(); // Needed for the dropdown
    }
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
    if (!window.confirm("Are you sure you want to remove this board member?")) return;
    try {
      const res = await fetch(`/api/delete/board/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      handleApiError(res);
      fetchTeam();
      if (editTeamId === id) {
        setEditTeamId(null);
        setTeamName(""); setTeamRole(""); setTeamDesc(""); setTeamImage(""); setTeamBoardYear("2026-27");
      }
    } catch (e) { console.error(e); }
  };

  const handleCategoryDragStart = (e, id) => {
    setDraggedCatId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCategoryDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCategoryDrop = async (e, targetId) => {
    e.preventDefault();
    if (!draggedCatId || draggedCatId === targetId) return;

    const oldIndex = categories.findIndex(c => c.id === draggedCatId);
    const newIndex = categories.findIndex(c => c.id === targetId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newCats = [...categories];
    const [movedCat] = newCats.splice(oldIndex, 1);
    newCats.splice(newIndex, 0, movedCat);

    const updatedCats = newCats.map((c, i) => ({ ...c, sort_order: i }));
    setCategories(updatedCats);
    setIsUpdatingOrder(true);

    try {
      const res = await fetch("/api/update/categories/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ orders: updatedCats.map(c => ({ id: c.id, sort_order: c.sort_order })) })
      });
      handleApiError(res);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
    setIsUpdatingOrder(false);
    setDraggedCatId(null);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/delete/category/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      handleApiError(res);
      fetchCategories();
      if (editCategoryId === id) {
        setEditCategoryId(null);
        setCategoryName(""); setCategorySortOrder("0");
      }
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
        setEventName(""); setEventDesc(""); setEventDate(""); setEventImages(""); setEventPoster(""); setEventCategoryId("");
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

  const startEditCategory = (id, cat) => {
    setEditCategoryId(id);
    setCategoryName(cat.name);
    setCategorySortOrder(cat.sort_order.toString());
    setCategoryStatus(null);
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    setCategoryStatus("Submitting...");

    const isEdit = editCategoryId !== null;
    const url = isEdit ? `/api/update/category/${editCategoryId}` : "/api/create/category";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ name: categoryName, sort_order: parseInt(categorySortOrder) })
      });
      handleApiError(res);
      const data = await res.json();
      if (data.success) {
        setCategoryStatus(`Category ${isEdit ? "updated" : "created"} successfully!`);
        setCategoryName(""); setCategorySortOrder("0");
        setEditCategoryId(null);
        fetchCategories();
      } else {
        setCategoryStatus(data.message || "Failed to submit.");
      }
    } catch (err) {
      setCategoryStatus("Error connecting to server.");
    }
  };

  const startEditEvent = (id, ev) => {
    setEditEventId(id);
    setEventName(ev.name);
    setEventDesc(ev.description);
    
    const d = new Date(parseInt(ev.timestamp));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setEventDate(`${year}-${month}-${day}`);
    
    setEventImages((ev.gallery || []).join(",\n"));
    setEventPoster(ev.poster_image || "");
    setEventCategoryId(ev.category_id || "");
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
        body: JSON.stringify({ 
          name: eventName, 
          description: eventDesc, 
          timestamp, 
          gallery,
          poster_image: eventPoster,
          category_id: eventCategoryId || null
        })
      });
      handleApiError(res);
      const data = await res.json();
      if (data.success) {
        setEventStatus(`Event ${isEdit ? "updated" : "created"} successfully!`);
        setEventName(""); setEventDesc(""); setEventDate(""); setEventImages(""); setEventPoster(""); setEventCategoryId("");
        setEditEventId(null);
        fetchEvents();
      } else {
        setEventStatus(data.message || "Failed to submit.");
      }
    } catch (err) {
      setEventStatus("Error connecting to server.");
    }
  };

  const startEditTeam = (id, member) => {
    setEditTeamId(id);
    setTeamName(member.name);
    setTeamRole(member.role);
    setTeamDesc(member.description);
    setTeamImage(member.image);
    setTeamBoardYear(member.board_year || "2026-27");
    setTeamStatus(null);
  };

  const submitAbout = async (e) => {
    e.preventDefault();
    setAboutStatus("Saving...");
    try {
      const res = await fetch("/api/update/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ content: aboutContent })
      });
      const data = await handleApiError(res).json();
      if (data.success) {
        setAboutStatus("About content updated successfully.");
        setTimeout(() => setAboutStatus(null), 3000);
      }
    } catch (e) {
      setAboutStatus("Error saving: " + e.message);
    }
  };

  const submitTeam = async (e) => {
    e.preventDefault();
    setTeamStatus("Submitting...");
    
    const isEdit = editTeamId !== null;
    const url = isEdit ? `/api/update/board/${editTeamId}` : "/api/create/board";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ 
            name: teamName, 
            role: teamRole, 
            description: teamDesc, 
            image: teamImage,
            board_year: teamBoardYear 
        })
      });
      handleApiError(res);
      const data = await res.json();
      if (data.success) {
        setTeamStatus(`Board member ${isEdit ? "updated" : "added"} successfully!`);
        setTeamName(""); setTeamRole(""); setTeamDesc(""); setTeamImage(""); setTeamBoardYear("2026-27");
        setEditTeamId(null);
        fetchTeam();
      } else {
        setTeamStatus(data.message || "Failed to submit.");
      }
    } catch (err) {
      setTeamStatus("Error connecting to server.");
    }
  };

  const tabs = [
    { id: "contacts", label: "Contacts" },
    { id: "help", label: "Help Requests" },
    { id: "notify", label: "Notifications" },
    { id: "categories", label: "Event Categories" },
    { id: "events", label: "Events" },
    { id: "team", label: "Board Management" },
    { id: "about", label: "About Page" }
  ];

  // Group team members by board year
  const groupedTeam = useMemo(() => {
    const grouped = {};
    team.forEach(member => {
        const year = member.board_year || "Unknown";
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(member);
    });
    // Sort years descending generally
    return Object.keys(grouped).sort((a,b) => b.localeCompare(a)).map(year => ({
        year,
        members: grouped[year]
    }));
  }, [team]);

  // Generate Board Year options +/- 10 years from current year
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => {
      const startYear = currentYear - 10 + i;
      return `${startYear}-${(startYear + 1).toString().slice(2)}`;
    });
  }, []);

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

          {activeTab === "categories" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0 }}>Event Categories</h2>
                {isUpdatingOrder && <span style={{ fontSize: "0.8rem", color: "var(--gold)" }}>Updating order...</span>}
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "20px" }}>Drag and drop to reorder categories.</p>
              {categories.length === 0 ? <p>No categories found.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                  {categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      draggable 
                      onDragStart={(e) => handleCategoryDragStart(e, cat.id)}
                      onDragOver={handleCategoryDragOver}
                      onDrop={(e) => handleCategoryDrop(e, cat.id)}
                      style={{ 
                          border: "1px solid #ddd", 
                          padding: "10px", 
                          borderRadius: "8px", 
                          position: "relative",
                          cursor: "grab",
                          opacity: draggedCatId === cat.id ? 0.5 : 1,
                          backgroundColor: "white"
                      }}
                    >
                      <strong style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ cursor: "grab", color: "#ccc" }}>☰</span> {cat.name}
                      </strong>
                      <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>Sort Order: {cat.sort_order}</p>
                      <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                        <button onClick={() => startEditCategory(cat.id, cat)} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Edit</button>
                        <button onClick={() => deleteCategory(cat.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", maxWidth: "500px" }}>
                <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0 }}>
                  {editCategoryId !== null ? "Edit Category" : "Create Category"}
                </h2>
                {editCategoryId !== null && (
                  <button onClick={() => { setEditCategoryId(null); setCategoryName(""); setCategorySortOrder("0"); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Cancel Edit</button>
                )}
              </div>
              <form onSubmit={submitCategory} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px", marginTop: "15px" }}>
                <div className="field">
                  <label className="label">Category Name</label>
                  <input className="input" value={categoryName} onChange={e => setCategoryName(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Sort Order (Lower is first)</label>
                  <input type="number" className="input" value={categorySortOrder} onChange={e => setCategorySortOrder(e.target.value)} required />
                </div>
                {categoryStatus && <p style={{ color: "var(--terracotta)" }}>{categoryStatus}</p>}
                <button type="submit" className="btn cursor-target">{editCategoryId !== null ? "Update Category" : "Create Category"}</button>
              </form>
            </div>
          )}

          {activeTab === "events" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Current Events</h2>
              {events.length === 0 ? <p>No events found.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                  {events.map((ev) => (
                    <div key={ev.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", position: "relative", paddingRight: "120px" }}>
                      <strong>{ev.name}</strong> - {new Date(parseInt(ev.timestamp)).toLocaleDateString()}
                      <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{ev.description}</p>
                      <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "var(--ink-soft)" }}>Images: {ev.gallery?.length || 0}</p>
                      <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "var(--gold)" }}>Category: {ev.event_categories?.name || "None"}</p>
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
                  <button onClick={() => { setEditEventId(null); setEventName(""); setEventDesc(""); setEventDate(""); setEventImages(""); setEventPoster(""); setEventCategoryId(""); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Cancel Edit</button>
                )}
              </div>
              <form onSubmit={submitEvent} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px", marginTop: "15px" }}>
                <div className="field">
                  <label className="label">Event Name</label>
                  <input className="input" value={eventName} onChange={e => setEventName(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Category</label>
                  <select className="input" value={eventCategoryId} onChange={e => setEventCategoryId(e.target.value)}>
                    <option value="">No Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
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
                  <label className="label">Poster Image URL (Optional)</label>
                  <input className="input" value={eventPoster} onChange={e => setEventPoster(e.target.value)} placeholder="https://example.com/poster.jpg" />
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
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Board Members</h2>
              {groupedTeam.length === 0 ? <p>No Board members found.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
                  {groupedTeam.map(group => (
                    <div key={group.year}>
                        <h3 style={{ borderBottom: "1px solid var(--line)", paddingBottom: "5px" }}>Board {group.year}</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                            {group.members.map((member) => (
                                <div key={member.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", position: "relative" }}>
                                <strong>{member.name}</strong> - {member.role}
                                <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{member.description}</p>
                                <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                                    <button onClick={() => startEditTeam(member.id, member)} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Edit</button>
                                    <button onClick={() => deleteTeamMember(member.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem" }}>Delete</button>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", maxWidth: "500px" }}>
                <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0 }}>
                  {editTeamId !== null ? "Edit Board Member" : "Add Board Member"}
                </h2>
                {editTeamId !== null && (
                  <button onClick={() => { setEditTeamId(null); setTeamName(""); setTeamRole(""); setTeamDesc(""); setTeamImage(""); setTeamBoardYear("2026-27"); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Cancel Edit</button>
                )}
              </div>
              <form onSubmit={submitTeam} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px", marginTop: "15px" }}>
                <div className="field">
                  <label className="label">Board Year</label>
                  <select className="input" value={teamBoardYear} onChange={e => setTeamBoardYear(e.target.value)} required>
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
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
                <button type="submit" className="btn cursor-target">{editTeamId !== null ? "Update Member" : "Add Member"}</button>
              </form>
            </div>
          )}

          {activeTab === "about" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>About Page Content</h2>
              <form onSubmit={submitAbout} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "800px", marginTop: "20px" }}>
                <div className="field">
                  <label className="label">Content</label>
                  <textarea 
                    className="input" 
                    style={{ minHeight: "300px" }}
                    value={aboutContent} 
                    onChange={e => setAboutContent(e.target.value)} 
                    required 
                  />
                  <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", marginTop: "5px" }}>Separate paragraphs with a blank line.</p>
                </div>
                {aboutStatus && <p style={{ color: "var(--terracotta)" }}>{aboutStatus}</p>}
                <button type="submit" className="btn cursor-target">Save Content</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
