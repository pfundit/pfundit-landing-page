import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Pfundit',
  description: 'Admin dashboard for Pfundit',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0F5FF] text-[#0f1b3d]">
      {children}
    </div>
  );
}
