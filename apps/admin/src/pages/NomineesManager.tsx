import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function NomineesManager() {
  const [nominees, setNominees] = useState([
    { id: '1', name: 'Sarah Okonkwo', category: 'Artist of the Year', code: 'NOM-001', votes: 4280, isPublished: true },
    { id: '2', name: 'James Adewale', category: 'Entrepreneur of the Year', code: 'NOM-002', votes: 3120, isPublished: true },
    { id: '3', name: 'Amara Osei', category: 'Innovator of the Year', code: 'NOM-003', votes: 2890, isPublished: true },
    { id: '4', name: 'Kemi Johnson', category: 'Young Leader of the Year', code: 'NOM-004', votes: 2160, isPublished: true },
  ]);

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: 'Delete Nominee?',
      text: `Are you sure you want to remove ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Delete',
    }).then((res) => {
      if (res.isConfirmed) {
        setNominees(nominees.filter((n) => n.id !== id));
        Swal.fire('Deleted!', `${name} has been removed.`, 'success');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Nominees Management</h1>
          <p className="text-slate-400 text-sm">Create, edit, publish or archive event nominees.</p>
        </div>
        <button
          onClick={() => Swal.fire('Add Nominee', 'Opening nominee creation modal', 'info')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          + Add New Nominee
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <th className="py-4 px-6">Code</th>
              <th className="py-4 px-6">Nominee Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right">Votes Received</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
            {nominees.map((n) => (
              <tr key={n.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-6 font-mono text-indigo-400">{n.code}</td>
                <td className="py-4 px-6 font-semibold text-white">{n.name}</td>
                <td className="py-4 px-6 text-slate-300">{n.category}</td>
                <td className="py-4 px-6 text-right font-mono font-bold text-amber-400">{n.votes.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold">
                    Published
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <button className="text-indigo-400 hover:underline text-xs font-semibold">Edit</button>
                  <button onClick={() => handleDelete(n.id, n.name)} className="text-red-400 hover:underline text-xs font-semibold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
