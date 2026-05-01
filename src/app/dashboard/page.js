'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 200, borderRight: '1px solid #ccc', padding: 16 }}>
        <h3>Menu</h3>
        <ul>
          <li>
            <Link href="/sites">Sites</Link>
          </li>
          <li>
            <Link href="/activities">Activities</Link>
          </li>
        </ul>
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        <h1>Dashboard</h1>
        <p>Select from the menu.</p>
      </main>
    </div>
  );
}