'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function ActivityDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [costForm, setCostForm] = useState({
    labour_hours: '',
    labour_rate: '',
    material_amount: '',
    other_amount: '',
    revenue: '',
  });
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    if (!id) return;
    api().get(`/activities/${id}`).then(res => {
      setData(res.data);
    });
  }, [id]);

  async function markDone(e) {
    e.preventDefault();
    await api().post('/approvals', {
      activity_id: id,
      comment: approvalComment,
    });
    const res = await api().get(`/activities/${id}`);
    setData(res.data);
    setApprovalComment('');
  }

  async function addCost(e) {
    e.preventDefault();
    await api().post('/costs', {
      activity_id: id,
      ...costForm,
    });
    const res = await api().get(`/activities/${id}`);
    setData(res.data);
  }

  if (!data) return <div>Loading...</div>;

  const { activity, approvals, cost } = data;

  return (
    <div style={{ padding: 16 }}>
      <h1>{activity.title}</h1>
      <p>Site: {activity.site_id}</p>
      <p>Status: {activity.status}</p>
      <p>Location: {activity.location}</p>
      <p>Trade: {activity.trade}</p>
      <p>Description: {activity.description}</p>

      <h2>Approvals</h2>
      {approvals.length === 0 ? (
        <p>No approvals yet.</p>
      ) : (
        approvals.map(ap => (
          <p key={ap.id}>
            {ap.approved_at} – {ap.comment}
          </p>
        ))
      )}

      {activity.status !== 'completed' && (
        <form onSubmit={markDone}>
          <h3>Mark as done</h3>
          <textarea
            placeholder="Comment"
            value={approvalComment}
            onChange={e => setApprovalComment(e.target.value)}
          /><br />
          <button type="submit">Mark Done</button>
        </form>
      )}

      <h2>Cost & Profit</h2>
      {cost ? (
        <div>
          <p>Total cost: ₹{cost.total_cost}</p>
          <p>Revenue: ₹{cost.revenue}</p>
          <p>Profit: ₹{cost.profit}</p>
          <p>Profit %: {cost.profit_percent}</p>
        </div>
      ) : (
        <form onSubmit={addCost}>
          <input
            placeholder="Labour hours"
            value={costForm.labour_hours}
            onChange={e =>
              setCostForm({ ...costForm, labour_hours: e.target.value })
            }
          /><br />
          <input
            placeholder="Labour rate"
            value={costForm.labour_rate}
            onChange={e =>
              setCostForm({ ...costForm, labour_rate: e.target.value })
            }
          /><br />
          <input
            placeholder="Material amount"
            value={costForm.material_amount}
            onChange={e =>
              setCostForm({ ...costForm, material_amount: e.target.value })
            }
          /><br />
          <input
            placeholder="Other amount"
            value={costForm.other_amount}
            onChange={e =>
              setCostForm({ ...costForm, other_amount: e.target.value })
            }
          /><br />
          <input
            placeholder="Revenue"
            value={costForm.revenue}
            onChange={e =>
              setCostForm({ ...costForm, revenue: e.target.value })
            }
          /><br />
          <button type="submit">Save Cost</button>
        </form>
      )}

      <button
        onClick={() =>
          window.open(
            `${process.env.NEXT_PUBLIC_API_URL}/activities/${id}/print`,
            '_blank',
          )
        }
      >
        Download / Print PDF
      </button>
    </div>
  );
}