import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../../components/ImageUploader";

const ADMIN_KEY = "bla_admin_token";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("contacts");
  
  const categoryFormRef = useRef(null);
  const eventFormRef = useRef(null);
  const teamFormRef = useRef(null);
  
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
  const [unsavedCategoryOrder, setUnsavedCategoryOrder] = useState(false);
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
  const [unsavedTeamYears, setUnsavedTeamYears] = useState({});
  const [isUpdatingTeamOrder, setIsUpdatingTeamOrder] = useState(false);

  // About form state
  const [aboutContent, setAboutContent] = useState("");
  const [aboutStatus, setAboutStatus] = useState(null);



  // Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

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

  const moveCategory = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === categories.length - 1)) return;
    const newCats = [...categories];
    const temp = newCats[index];
    newCats[index] = newCats[index + direction];
    newCats[index + direction] = temp;
    
    const updatedCats = newCats.map((c, i) => ({ ...c, sort_order: i }));
    setCategories(updatedCats);
    setUnsavedCategoryOrder(true);
  };

  const saveCategoryOrder = async () => {
    setIsUpdatingOrder(true);
    try {
      const res = await fetch("/api/update/categories/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ orders: categories.map(c => ({ id: c.id, sort_order: c.sort_order })) })
      });
      handleApiError(res);
      setUnsavedCategoryOrder(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
    setIsUpdatingOrder(false);
  };

  const moveTeamMember = (year, index, direction) => {
    const yearMembers = team.filter(m => (m.board_year || "Unknown") === year).sort((a,b) => a.sort_order - b.sort_order);
    if ((direction === -1 && index === 0) || (direction === 1 && index === yearMembers.length - 1)) return;
    
    const newMembers = [...yearMembers];
    const temp = newMembers[index];
    newMembers[index] = newMembers[index + direction];
    newMembers[index + direction] = temp;
    
    const updatedMembers = newMembers.map((m, i) => ({ ...m, sort_order: i }));
    
    setTeam(prev => prev.map(m => {
      const updated = updatedMembers.find(um => um.id === m.id);
      return updated ? updated : m;
    }).sort((a,b) => {
      if(a.board_year !== b.board_year) return (b.board_year || "").localeCompare(a.board_year || "");
      return a.sort_order - b.sort_order;
    }));
    
    setUnsavedTeamYears(prev => ({ ...prev, [year]: true }));
  };

  const saveTeamOrder = async (year) => {
    setIsUpdatingTeamOrder(true);
    const yearMembers = team.filter(m => (m.board_year || "Unknown") === year).sort((a,b) => a.sort_order - b.sort_order);
    try {
      const res = await fetch("/api/update/board/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ orders: yearMembers.map(m => ({ id: m.id, sort_order: m.sort_order })) })
      });
      handleApiError(res);
      setUnsavedTeamYears(prev => ({ ...prev, [year]: false }));
      fetchTeam(); 
    } catch (err) {
      console.error(err);
    }
    setIsUpdatingTeamOrder(false);
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
    setTimeout(() => categoryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
    setTimeout(() => eventFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
    setTimeout(() => teamFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
                      <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                        <button onClick={() => { setSelectedMessage(c); setMessageType("contact"); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem", border: "1px solid #ddd" }}>View</button>
                        <button onClick={() => deleteContact(c.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem", color: "white" }}>Delete</button>
                      </div>
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
                      <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                        <button onClick={() => { setSelectedMessage(g); setMessageType("help"); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem", border: "1px solid #ddd" }}>View</button>
                        <button onClick={() => deleteHelp(g.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem", color: "white" }}>Delete</button>
                      </div>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 400px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0 }}>Event Categories</h2>
                  {isUpdatingOrder && <span style={{ fontSize: "0.8rem", color: "var(--gold)" }}>Updating order...</span>}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "20px" }}>Use the Up/Down buttons to reorder categories.</p>
                {unsavedCategoryOrder && (
                  <button 
                    onClick={saveCategoryOrder} 
                    className="btn cursor-target"
                    style={{ 
                      marginBottom: "15px", 
                      width: "100%",
                    }}
                  >
                    SAVE CATEGORY ORDER
                  </button>
                )}
                {categories.length === 0 ? <p>No categories found.</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                    {categories.map((cat, index) => (
                      <div 
                        key={cat.id} 
                        style={{ 
                            border: "1px solid #ddd", 
                            padding: "10px", 
                            borderRadius: "8px", 
                            backgroundColor: "white"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <button 
                              onClick={() => moveCategory(index, -1)} 
                              disabled={index === 0}
                              style={{ 
                                background: index === 0 ? "#f5f5f5" : "#e0e0e0", 
                                border: "none", 
                                borderRadius: "4px", 
                                cursor: index === 0 ? "not-allowed" : "pointer", 
                                padding: "4px 10px", 
                                fontSize: "0.8rem", 
                                color: index === 0 ? "#ccc" : "#333"
                              }}
                            >▲</button>
                            <button 
                              onClick={() => moveCategory(index, 1)} 
                              disabled={index === categories.length - 1}
                              style={{ 
                                background: index === categories.length - 1 ? "#f5f5f5" : "#e0e0e0", 
                                border: "none", 
                                borderRadius: "4px", 
                                cursor: index === categories.length - 1 ? "not-allowed" : "pointer", 
                                padding: "4px 10px", 
                                fontSize: "0.8rem", 
                                color: index === categories.length - 1 ? "#ccc" : "#333"
                              }}
                            >▼</button>
                          </div>
                          <strong>{cat.name}</strong>
                        </div>
                        <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>Sort Order: {cat.sort_order}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                          <button onClick={() => startEditCategory(cat.id, cat)} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Edit</button>
                          <button onClick={() => deleteCategory(cat.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem", color: "white" }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div ref={categoryFormRef} style={{ flex: "0 0 350px", position: "sticky", top: "20px", background: "var(--paper)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0, fontSize: "1.5rem" }}>
                    {editCategoryId !== null ? "Edit Category" : "Create Category"}
                  </h2>
                  {editCategoryId !== null && (
                    <button onClick={() => { setEditCategoryId(null); setCategoryName(""); setCategorySortOrder("0"); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Cancel</button>
                  )}
                </div>
                <form onSubmit={submitCategory} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
            </div>
          )}

          {activeTab === "events" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 400px" }}>
                <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)" }}>Current Events</h2>
                {events.length === 0 ? <p>No events found.</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                    {events.map((ev) => (
                      <div key={ev.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", backgroundColor: "white" }}>
                        <strong>{ev.name}</strong> - {new Date(parseInt(ev.timestamp)).toLocaleDateString()}
                        <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{ev.description}</p>
                        <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "var(--ink-soft)" }}>Images: {ev.gallery?.length || 0}</p>
                        <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "var(--gold)" }}>Category: {ev.event_categories?.name || "None"}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                          <button onClick={() => startEditEvent(ev.id, ev)} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Edit</button>
                          <button onClick={() => deleteEvent(ev.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem", color: "white" }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div ref={eventFormRef} style={{ flex: "0 0 350px", position: "sticky", top: "20px", background: "var(--paper)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0, fontSize: "1.5rem" }}>
                    {editEventId !== null ? "Edit Event" : "Create Event"}
                  </h2>
                  {editEventId !== null && (
                    <button onClick={() => { setEditEventId(null); setEventName(""); setEventDesc(""); setEventDate(""); setEventImages(""); setEventPoster(""); setEventCategoryId(""); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Cancel</button>
                  )}
                </div>
                <form onSubmit={submitEvent} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <input className="input" value={eventPoster} onChange={e => setEventPoster(e.target.value)} placeholder="https://example.com/poster.jpg" />
                      <ImageUploader 
                        multiple={false} 
                        buttonText="Upload Poster"
                        onUploadSuccess={(urls) => setEventPoster(urls[0])} 
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Gallery Image URLs (Comma separated, Optional)</label>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <textarea className="input" value={eventImages} onChange={e => setEventImages(e.target.value)} rows={5} placeholder="https://example.com/image1.jpg,&#10;https://example.com/image2.jpg" />
                      <ImageUploader 
                        multiple={true} 
                        buttonText="Upload Gallery Images"
                        onUploadSuccess={(urls) => {
                          const newUrls = urls.join(',\n');
                          setEventImages(prev => prev ? `${prev},\n${newUrls}` : newUrls);
                        }} 
                      />
                    </div>
                  </div>
                  {eventStatus && <p style={{ color: "var(--terracotta)" }}>{eventStatus}</p>}
                  <button type="submit" className="btn cursor-target">{editEventId !== null ? "Update Event" : "Create Event"}</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 400px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0 }}>Board Members</h2>
                  {isUpdatingTeamOrder && <span style={{ fontSize: "0.8rem", color: "var(--gold)" }}>Updating order...</span>}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "20px" }}>Use the Up/Down buttons to reorder members within their board year.</p>
                {groupedTeam.length === 0 ? <p>No Board members found.</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
                    {groupedTeam.map(group => (
                      <div key={group.year} style={{ border: "1px solid var(--line)", padding: "15px", borderRadius: "12px", background: "var(--paper)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "10px", marginBottom: "15px" }}>
                            <h3 style={{ margin: 0 }}>Board {group.year}</h3>
                            {unsavedTeamYears[group.year] && (
                              <button 
                                onClick={() => saveTeamOrder(group.year)} 
                                className="btn cursor-target"
                                style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                              >
                                SAVE ORDER
                              </button>
                            )}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                              {group.members.map((member, index) => (
                                  <div 
                                    key={member.id} 
                                    style={{ 
                                      border: "1px solid #ddd", 
                                      padding: "10px", 
                                      borderRadius: "8px", 
                                      backgroundColor: "white"
                                    }}
                                  >
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                      <button 
                                        onClick={() => moveTeamMember(group.year, index, -1)} 
                                        disabled={index === 0}
                                        style={{ 
                                          background: index === 0 ? "#f5f5f5" : "#e0e0e0", 
                                          border: "none", 
                                          borderRadius: "4px", 
                                          cursor: index === 0 ? "not-allowed" : "pointer", 
                                          padding: "4px 10px", 
                                          fontSize: "0.8rem", 
                                          color: index === 0 ? "#ccc" : "#333"
                                        }}
                                      >▲</button>
                                      <button 
                                        onClick={() => moveTeamMember(group.year, index, 1)} 
                                        disabled={index === group.members.length - 1}
                                        style={{ 
                                          background: index === group.members.length - 1 ? "#f5f5f5" : "#e0e0e0", 
                                          border: "none", 
                                          borderRadius: "4px", 
                                          cursor: index === group.members.length - 1 ? "not-allowed" : "pointer", 
                                          padding: "4px 10px", 
                                          fontSize: "0.8rem", 
                                          color: index === group.members.length - 1 ? "#ccc" : "#333"
                                        }}
                                      >▼</button>
                                    </div>
                                    <strong style={{ margin: 0 }}>{member.name}</strong> - {member.role}
                                  </div>
                                  <p style={{ margin: "5px 0 0", fontSize: "0.9rem" }}>{member.description}</p>
                                  <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "var(--ink-soft)" }}>Sort Order: {member.sort_order}</p>
                                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                                      <button onClick={() => startEditTeam(member.id, member)} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Edit</button>
                                      <button onClick={() => deleteTeamMember(member.id)} className="btn cursor-target" style={{ background: "var(--deep-red)", padding: "4px 8px", fontSize: "0.8rem", color: "white" }}>Delete</button>
                                  </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div ref={teamFormRef} style={{ flex: "0 0 350px", position: "sticky", top: "20px", background: "var(--paper)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", margin: 0, fontSize: "1.5rem" }}>
                    {editTeamId !== null ? "Edit Member" : "Add Member"}
                  </h2>
                  {editTeamId !== null && (
                    <button onClick={() => { setEditTeamId(null); setTeamName(""); setTeamRole(""); setTeamDesc(""); setTeamImage(""); setTeamBoardYear("2026-27"); }} className="btn ghost cursor-target" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Cancel</button>
                  )}
                </div>
                <form onSubmit={submitTeam} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <input className="input" value={teamImage} onChange={e => setTeamImage(e.target.value)} />
                      <ImageUploader 
                        multiple={false} 
                        buttonText="Upload Profile Picture"
                        onUploadSuccess={(urls) => setTeamImage(urls[0])} 
                      />
                    </div>
                  </div>
                  {teamStatus && <p style={{ color: "var(--terracotta)" }}>{teamStatus}</p>}
                  <button type="submit" className="btn cursor-target">{editTeamId !== null ? "Update Member" : "Add Member"}</button>
                </form>
              </div>
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

      {/* Message Modal Overlay */}
      {selectedMessage && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 99999, padding: "20px"
        }}>
          <div className="card" style={{
            background: "var(--paper)", width: "100%", maxWidth: "600px",
            maxHeight: "90vh", overflowY: "auto", padding: "30px",
            borderRadius: "12px", position: "relative",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}>
            <button 
              onClick={() => setSelectedMessage(null)} 
              className="cursor-target"
              style={{
                position: "absolute", top: "20px", right: "20px",
                background: "transparent", border: "none", fontSize: "1.8rem",
                color: "var(--ink)", cursor: "pointer", padding: "5px",
                lineHeight: "1"
              }}
            >
              &times;
            </button>
            <h2 style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", marginTop: 0, paddingRight: "40px" }}>
              {messageType === "contact" ? "Contact Message" : "Help Request"}
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
              <div><strong>Name:</strong> {selectedMessage.name}</div>
              <div><strong>Email:</strong> {selectedMessage.email || "N/A"}</div>
              <div><strong>Phone:</strong> {selectedMessage.phone || "N/A"}</div>
              {messageType === "help" && (
                <>
                  <div><strong>Category:</strong> {selectedMessage.category}</div>
                  <div><strong>Subject:</strong> {selectedMessage.subject}</div>
                </>
              )}
              <div><strong>Date:</strong> {new Date(selectedMessage.unix_timestamp || selectedMessage.created_at).toLocaleString()}</div>
              <div style={{ marginTop: "10px" }}>
                <strong>Message:</strong>
                <div style={{ 
                  background: "var(--bg)", padding: "15px", borderRadius: "8px", 
                  marginTop: "8px", whiteSpace: "pre-wrap", lineHeight: "1.6",
                  border: "1px solid var(--line)"
                }}>
                  {selectedMessage.details}
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
              <button onClick={() => setSelectedMessage(null)} className="btn cursor-target">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
