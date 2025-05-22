import { useState } from 'react'
import './App.css'
import type { Event } from './types';
import Chatbot from './Chatbot';

function App() {
  const [events, setEvents] = useState<Event[]>([{ 
    id: '1',
    title: 'Team Meeting', 
    date: '2024-06-15', 
    location: 'Virtual', 
    status: "attending",
    description: 'Quarterly planning session' 
  }]);

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({ 
    title: '', 
    date: '', 
    location: '', 
    status: "upcoming",
    description: '' 
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ 
    start: '', 
    end: '' 
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents([...events, event]);
    resetForm();
  };

  const editEvent = (id: string) => {
    const eventToEdit = events.find(event => event.id === id);
    if (eventToEdit) {
      setNewEvent({
        title: eventToEdit.title,
        date: eventToEdit.date,
        location: eventToEdit.location,
        status: eventToEdit.status,
        description: eventToEdit.description
      });
      setEditingId(id);
    }
  };

  const updateEvent = () => {
    if (!editingId || !newEvent.title || !newEvent.date) return;
    setEvents(events.map(event => 
      event.id === editingId ? { ...newEvent, id: editingId } : event
    ));
    resetForm();
    setEditingId(null);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    if (editingId === id) {
      resetForm();
      setEditingId(null);
    }
  };

  const resetForm = () => {
    setNewEvent({ 
      title: '', 
      date: '', 
      location: '', 
      status: "upcoming",
      description: '' 
    });
  };

  // Filter events based on search criteria
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = (!dateFilter.start || new Date(event.date) >= new Date(dateFilter.start)) && 
                       (!dateFilter.end || new Date(event.date) <= new Date(dateFilter.end));
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className='text-center mb-8 p-4 font-bold text-5xl bg-green-500 bg-clip-text text-transparent'>
          Event Planner
        </h1>
        


        {/* Add/Edit Event Form */}
        <div className="max-w-xl mx-auto bg-[#2a2a2a] rounded-2xl shadow-xl p-6 mb-10 border border-green-500">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Event Title</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="Team meeting, Conference, etc."
                className="w-full p-3 bg-[#1e1e1e] border border-green-500 rounded-lg text-white cursor-pointer"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#1e1e1e] border border-green-500 rounded-lg text-white cursor-pointer"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
                <select
                  name="status"
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({...newEvent, status: e.target.value as "upcoming" | "attending" | "maybe" | "declined"})}
                  className="w-full p-3 bg-[#1e1e1e] border border-green-500 rounded-lg text-white cursor-pointer"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="attending">Attending</option>
                  <option value="maybe">Maybe</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                placeholder="Virtual, Office, Conference Room..."
                className="w-full p-3 bg-[#1e1e1e] border border-green-500 rounded-lg text-white cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Details about the event..."
                className="w-full p-3 bg-[#1e1e1e] border border-green-500 rounded-lg text-white cursor-pointer"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              {editingId && (
                <button
                  onClick={() => {
                    resetForm();
                    setEditingId(null);
                  }}
                  className="px-5 py-2.5 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white rounded-lg transition-colors border border-green-500 cursor-pointer"
                >
                  Cancel
                </button>
              )}
              
              <button
                onClick={editingId ? updateEvent : addEvent}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/30 cursor-pointer"
              >
                {editingId ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>


        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto bg-[#2a2a2a] rounded-xl shadow-lg p-6 mb-8 border border-green-500">
          <h2 className="text-xl font-semibold mb-4 text-white">Find Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-center items-center ">
            <div className=" col-span-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">Search</label>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-[#1e1e1e] border border-green-500 rounded-lg  text-white cursor-pointer"
              />
            </div>
            <div className='col-span-2'>
              <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-[#1e1e1e] border border-green-500 rounded-lg  text-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="attending">Attending</option>
                <option value="maybe">Maybe</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">From Date</label>
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                className="w-full p-2 bg-[#1e1e1e] border border-green-500 rounded-lg text-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">To Date</label>
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                className="w-full p-2 bg-[#1e1e1e] border border-green-500 rounded-lg text-white cursor-pointer"
              />
            </div>
          </div>
        </div>
<Chatbot events={events} />

        {/* Events List */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-white">Your Events ({filteredEvents.length})</h2>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-10 bg-[#2a2a2a] rounded-xl border border-green-500">
              <p className="text-gray-400">No events found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`p-5 rounded-xl shadow-lg border-l-4 ${
                    event.status === 'attending' 
                      ? 'border-green-500 bg-[#2a2a2a]' 
                      : event.status === 'maybe' 
                        ? 'border-yellow-500 bg-[#2a2a2a]' 
                        : event.status === 'declined'
                          ? 'border-red-500 bg-[#2a2a2a]'
                          : 'border-blue-500 bg-[#2a2a2a]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-white">{event.title}</h3>
                        <span className={`px-2.5 py-0.5 text-xs rounded-full ${
                          event.status === 'attending' 
                            ? 'bg-green-900 text-green-300' 
                            : event.status === 'maybe' 
                              ? 'bg-yellow-900 text-yellow-300' 
                              : event.status === 'declined'
                                ? 'bg-red-900 text-red-300'
                                : 'bg-blue-900 text-blue-300'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300 mb-3">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-gray-400 mt-2">{event.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => editEvent(event.id)}
                        className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white rounded-lg transition-colors border border-green-500 flex items-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-red-300 rounded-lg transition-colors border border-red-500 flex items-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;