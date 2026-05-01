import { useState } from 'react';
import { Search, Download, Trash2 } from 'lucide-react';

import { useState } from 'react';
import { Search, Download, Trash2, Eye, Lock, LogIn } from 'lucide-react';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Mock data representing participants and their 60 word results
  const [data] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      accuracy: 92, 
      avgRT: 450, 
      totalTime: 27000,
      results: Array(60).fill(0).map((_, i) => ({ word: `W${i+1}`, rt: 400 + Math.random() * 100 }))
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      accuracy: 88, 
      avgRT: 512, 
      totalTime: 30720,
      results: Array(60).fill(0).map((_, i) => ({ word: `W${i+1}`, rt: 450 + Math.random() * 100 }))
    }
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const exportToExcel = () => {
    // CSV logic to simulate Excel export
    let csv = "Participant," + data[0].results.map((_, i) => `Word ${i+1}`).join(",") + ",Total Time,Avg Time\n";
    data.forEach(p => {
      csv += `${p.name},${p.results.map(r => r.rt.toFixed(0)).join(",")},${p.totalTime},${p.avgRT}\n`;
    });
    
    // Calculate global line
    csv += "Global Avg," + data[0].results.map((_, i) => {
      const avg = data.reduce((acc, p) => acc + p.results[i].rt, 0) / data.length;
      return avg.toFixed(0);
    }).join(",") + ",,\n";

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lexical_task_report.csv';
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600/20 rounded-full">
              <Lock className="text-blue-500" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-8">Admin Access</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all active:scale-95">
              <LogIn size={20} /> Login
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
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg transition-all"
        >
          <Download size={20} /> DETAILED EXCEL REPORT
        </button>
      </header>

      {selectedParticipant ? (
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 mb-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-400">{selectedParticipant.name}'s Trial Data</h2>
            <button onClick={() => setSelectedParticipant(null)} className="text-gray-400 hover:text-white underline">Close Details</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {selectedParticipant.results.map((r, i) => (
              <div key={i} className="bg-gray-900/50 p-2 rounded border border-gray-700 text-center">
                <p className="text-[10px] text-gray-500">TRIAL {i+1}</p>
                <p className="text-sm font-mono text-blue-300">{r.rt.toFixed(0)}ms</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700/50 text-gray-400 text-xs uppercase font-black tracking-widest">
              <th className="px-6 py-5">Participant</th>
              <th className="px-6 py-5">Accuracy</th>
              <th className="px-6 py-5 text-center">Avg. RT</th>
              <th className="px-6 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-5 font-bold text-lg">{item.name}</td>
                <td className="px-6 py-5">
                  <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-bold">
                    {item.accuracy}%
                  </span>
                </td>
                <td className="px-6 py-5 text-center font-mono text-blue-400 text-xl font-bold">{item.avgRT} ms</td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedParticipant(item)}
                    className="p-3 bg-gray-700 hover:bg-blue-600 rounded-xl transition-all text-white inline-flex"
                  >
                    <Eye size={20} />
                  </button>
                  <button className="p-3 bg-gray-700 hover:bg-red-600 rounded-xl transition-all text-white inline-flex">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
