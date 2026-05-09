'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({
    site_id: '',
    title: '',
    description: '',
    location: '',
    trade: '',
    due_date: '',
  });

  useEffect(() => {
    api().get('/sites').then(res => setSites(res.data)).catch(() => {});
    api().get('/activities').then(res => setActivities(res.data)).catch(() => {});
  }, []);

  async function createActivity(e) {
    e.preventDefault();
    const res = await api().post('/activities', form);
    setActivities([res.data, ...activities]);
    setForm({
      site_id: '',
      title: '',
      description: '',
      location: '',
      trade: '',
      due_date: '',
    });
  }

  async function handleDownloadPdf(activityId) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_API_URL is not defined');
      return;
    }

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    if (!token) {
      console.error('No token in localStorage');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/activities/${activityId}/print`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error('Failed to download PDF', res.status);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-${activityId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF', err);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Activities</h1>
      <form onSubmit={createActivity}>
        <select
          value={form.site_id}
          onChange={e => setForm({ ...form, site_id: e.target.value })}
        >
          <option value="">Select site</option>
          {sites.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select><br />
        <input
          placeholder="Title (e.g. Raft Cutting – Block A)"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        /><br />
        <input
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        /><br />
        <input
          placeholder="Trade (e.g. RCC concreting)"
          value={form.trade}
          onChange={e => setForm({ ...form, trade: e.target.value })}
        /><br />
        <input
          type="date"
          value={form.due_date}
          onChange={e => setForm({ ...form, due_date: e.target.value })}
        /><br />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        /><br />
        <button type="submit">Create Activity</button>
      </form>

      <ul>
        {activities.map(a => (
          <li key={a.id}>
            <Link href={`/activities/${a.id}`}>
              {a.title} – {a.site_name} – {a.status}
            </Link>
            {' '}
            <button
              type="button"
              onClick={() => handleDownloadPdf(a.id)}
            >
              Download PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}