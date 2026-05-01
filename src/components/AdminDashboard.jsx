import { useState } from 'react';
import { Search, Download, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data for now
  const [data] = useState([
    { id: 1, name: 'John Doe', age: 24, accuracy: 92, avgRT: 450, date: '2024-05-01' },
    { id: 2, name: 'Jane Smith', age: 30, accuracy: 88, avgRT: 512, date: '2024-05-01' },
    { id: 3, name: 'Can Oz', age: 21, accuracy: 95, avgRT: 420, date: '2024-04-30' },
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen text-white">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Admin Dashboard</h1>
          <p className="text-gray-400">Manage all participant results and statistics here.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={18} /> Export All (Excel)
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Participants</p>
          <p className="text-3xl font-bold">{data.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Avg. Accuracy</p>
          <p className="text-3xl font-bold text-green-500">
            %{(data.reduce((acc, d) => acc + d.accuracy, 0) / data.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Global Avg. RT</p>
          <p className="text-3xl font-bold text-blue-400">
            {(data.reduce((acc, d) => acc + d.avgRT, 0) / data.length).toFixed(0)} ms
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Participant List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search participant..."
              className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700/30 text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4">Participant</th>
              <th className="px-6 py-4">Age</th>
              <th className="px-6 py-4">Accuracy (%)</th>
              <th className="px-6 py-4">Avg. RT (ms)</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 text-gray-300">{item.age}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${item.accuracy > 90 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {item.accuracy}%
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-blue-400">{item.avgRT} ms</td>
                <td className="px-6 py-4 text-gray-400">{item.date}</td>
                <td className="px-6 py-4">
                  <button className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={18} />
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
