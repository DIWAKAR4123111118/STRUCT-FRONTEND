'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', project_type: '' });

  useEffect(() => {
    api()
      .get('/sites')
      .then((res) => setSites(res.data))
      .catch(() => {});
  }, []);

  async function createSite(e) {
    e.preventDefault();
    const res = await api().post('/sites', form);
    setSites([res.data, ...sites]);
    setForm({ name: '', address: '', project_type: '' });
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Sites</h1>
      <form onSubmit={createSite}>
        <input
          placeholder="Site name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <br />
        <input
          placeholder="Project type"
          value={form.project_type}
          onChange={(e) => setForm({ ...form, project_type: e.target.value })}
        />
        <br />
        <button type="submit">Add Site</button>
      </form>

      <ul>
        {sites.map((s) => (
          <li key={s.id ?? s.name}>
            {s.name} – {s.project_type}
          </li>
        ))}
      </ul>
    </div>
  );
}