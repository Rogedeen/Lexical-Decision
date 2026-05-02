import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Eye, Lock, LogIn, Loader2 } from 'lucide-react';
import { adminLogin, fetchFullReport, isAuthenticated as checkAuth, deleteParticipant } from '../services/supabaseService';
import { exportMatrixExcel } from '../lib/excelGenerator';
import { mapToOriginalOrder } from '../lib/words';

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    const init = async () => {
      const auth = await checkAuth();
      if (auth) {
        setAuthenticated(true);
        loadData();
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchFullReport();
      setParticipants(data);
    } catch (error) {
      console.error("Failed to load participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await adminLogin(loginForm.email, loginForm.password);
      setAuthenticated(true);
      loadData();
    } catch (error) {
      alert('Invalid credentials or connection error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleExport = () => {
    exportMatrixExcel(participants);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test result? This action cannot be undone.")) {
      try {
        await deleteParticipant(id);
        setParticipants(participants.filter(p => p.id !== id));
        if (selectedParticipant?.id === id) {
          setSelectedParticipant(null);
        }
      } catch (error) {
        alert("An error occurred during the deletion process.");
      }
    }
  };

  if (loading && !authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-blue-500">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600/20 rounded-full">
              <Lock className="text-blue-500" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Admin Access</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full bg-gray-700 border border-gray-600 border-gray-400 text-white rounded-xl px-4 py-3 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-700 border border-gray-600 border-gray-400 text-white rounded-xl px-4 py-3 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
            <button 
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all active:scale-95 text-white disabled:opacity-50"
            >
              {loginLoading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />} Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen text-white">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-blue-500 tracking-tight">ADMIN PANEL</h1>
          <p className="text-gray-400">Manage participants and detailed analysis.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg transition-all"
        >
          <Download size={20} /> DETAILED EXCEL REPORT
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20 text-blue-500">
          <Loader2 className="animate-spin" size={48} />
        </div>
      ) : (
        <>
          {selectedParticipant && (
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 mb-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">{selectedParticipant.firstName} {selectedParticipant.lastName}'s Trials (Original Order)</h2>
                <button onClick={() => setSelectedParticipant(null)} className="text-gray-400 hover:text-white underline">Close Details</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {mapToOriginalOrder(selectedParticipant.trials).map((r, i) => {
                  const givenAnswer = r.responseTimeMs > 0 
                    ? (r.isCorrect ? r.type : (r.type === 'word' ? 'non-word' : 'word'))
                    : '-';
                  
                  return (
                    <div key={i} className="bg-gray-900/50 p-3 rounded-xl border border-gray-700 flex flex-col justify-between">
                      <div className="mb-2">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">#{i+1} {r.word}</p>
                        <p className={`text-xs font-mono mt-1 ${r.isCorrect ? 'text-blue-300' : 'text-red-400'}`}>
                          {r.responseTimeMs > 0 ? `${r.responseTimeMs.toFixed(1)}ms` : 'No Data'}
                        </p>
                      </div>
                      <div className="text-[9px] space-y-0.5">
                        <p className="text-gray-400">Correct: <span className="text-white uppercase">{r.type}</span></p>
                        <p className="text-gray-400">Given: <span className={r.isCorrect ? 'text-green-400' : 'text-red-400'}>{givenAnswer.toUpperCase()}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700/50 text-gray-400 text-xs uppercase font-black tracking-widest">
                  <th className="px-6 py-5">Participant</th>
                  <th className="px-6 py-5">Trials</th>
                  <th className="px-6 py-5 text-center">Avg. RT</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {participants.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-5 font-bold text-lg">{item.firstName} {item.lastName}</td>
                    <td className="px-6 py-5 text-gray-400">
                      <span className="text-white font-medium">{item.trials?.filter(t => t.isCorrect).length || 0}</span> / {item.trials?.length || 0} Correct
                    </td>
                    <td className="px-6 py-5 text-center font-mono text-blue-400 text-xl font-bold">
                      {item.trials?.length > 0 
                        ? (item.trials.reduce((acc, t) => acc + (t.responseTimeMs || t.response_time_ms || 0), 0) / item.trials.length).toFixed(1) 
                        : 0} ms
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      <button 
                        onClick={() => setSelectedParticipant(item)}
                        className="p-3 bg-gray-700 hover:bg-blue-600 rounded-xl transition-all text-white inline-flex"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-gray-700 hover:bg-red-600 rounded-xl transition-all text-white inline-flex"
                        title="Delete Participant"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
