import { useState } from 'react';

const ParticipantForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName.trim() !== '' && formData.lastName.trim() !== '') {
      onComplete({ ...formData, fullName: `${formData.firstName} ${formData.lastName}` });
    }
  };

  return (
    <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 mx-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Welcome</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Enter first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Enter last name"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl text-xl mt-4 transition-all shadow-lg active:scale-95"
        >
          START TEST
        </button>
      </form>
    </div>
  );
};

export default ParticipantForm;
