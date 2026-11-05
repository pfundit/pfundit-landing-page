'use client';

import { useEffect, useRef, useState } from 'react';
import { ADMIN_PERMISSIONS, type AdminPermission, type AdminPublic } from '@/lib/db/types';

export const PERMISSION_META: Record<AdminPermission, { label: string; hint: string }> = {
  jobs: { label: 'Job Posting', hint: 'Create, edit and delete roles' },
  applications: { label: 'Job Applications', hint: 'View candidates & resumes' },
  investors: { label: 'Investor Enquiries', hint: 'View investor requests' },
  contacts: { label: 'Contact Forms', hint: 'View contact messages' },
  settings: { label: 'Email Notifications', hint: 'Change alert recipients' },
  admins: { label: 'Manage Admins', hint: 'Full control, incl. this page' },
};

const PRESETS: Array<{ key: string; label: string; permissions: AdminPermission[] }> = [
  { key: 'full', label: 'Full access', permissions: [...ADMIN_PERMISSIONS] },
  { key: 'hiring', label: 'Hiring', permissions: ['jobs', 'applications'] },
  { key: 'inbox', label: 'Inbox only', permissions: ['applications', 'investors', 'contacts'] },
  { key: 'none', label: 'No access', permissions: [] },
];

function withImplied(permissions: AdminPermission[]): AdminPermission[] {
  return permissions.includes('admins') ? [...ADMIN_PERMISSIONS] : ADMIN_PERMISSIONS.filter((p) => permissions.includes(p));
}

function generatePassword(length = 14) {
  const letters = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const all = `${letters}${digits}`;
  const values = crypto.getRandomValues(new Uint32Array(length));
  const chars = Array.from(values, (v) => all[v % all.length]);
  // Guarantee at least one letter and one digit.
  chars[0] = letters[values[0] % letters.length];
  chars[length - 1] = digits[values[length - 1] % digits.length];
  return chars.join('');
}

function formatRelative(value?: string) {
  if (!value) return 'Never';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value));
}

function Switch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D3A337] focus-visible:ring-offset-1 disabled:cursor-not-allowed ${
        checked ? 'bg-[#0f1b3d]' : 'bg-[#0f1b3d]/15'
      } ${disabled ? 'opacity-45' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[1.125rem]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function PermissionGrid({
  permissions,
  onToggle,
  lockedReason,
}: {
  permissions: AdminPermission[];
  onToggle: (permission: AdminPermission, next: boolean) => void;
  /** When set, every toggle is read-only and this is shown as the tooltip. */
  lockedReason?: string;
}) {
  const hasFull = permissions.includes('admins');
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {ADMIN_PERMISSIONS.map((permission) => {
        const meta = PERMISSION_META[permission];
        const checked = permissions.includes(permission);
        const impliedByFull = hasFull && permission !== 'admins';
        const disabled = Boolean(lockedReason) || impliedByFull;
        return (
          <label
            key={permission}
            title={lockedReason || (impliedByFull ? 'Included with Manage Admins' : undefined)}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
              checked ? 'border-[#0f1b3d]/15 bg-[#F6F8FF]' : 'border-[#0f1b3d]/8 bg-white'
            } ${disabled ? '' : 'cursor-pointer hover:border-[#0f1b3d]/20'}`}
          >
            <span className="min-w-0">
              <span className={`block text-[0.8rem] font-semibold ${permission === 'admins' ? 'text-[#B8861B]' : 'text-[#0f1b3d]'}`}>
                {meta.label}
              </span>
              <span className="block truncate text-[0.68rem] text-[#0f1b3d]/50">
                {impliedByFull ? 'Included with Manage Admins' : meta.hint}
              </span>
            </span>
            <Switch
              checked={checked}
              disabled={disabled}
              label={meta.label}
              onChange={(next) => onToggle(permission, next)}
            />
          </label>
        );
      })}
    </div>
  );
}

function PasswordField({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id: string;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); the field stays visible to copy manually.
      setVisible(true);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete="new-password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-[#0f1b3d]/15 bg-white px-4 py-2.5 font-mono text-sm text-[#0f1b3d] focus:border-[#D3A337] focus:outline-none focus:ring-1 focus:ring-[#D3A337]"
          required
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="rounded-xl border border-[#0f1b3d]/12 px-3 text-xs font-semibold text-[#0f1b3d]/70 hover:bg-[#F0F5FF]"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            onChange(generatePassword());
            setVisible(true);
          }}
          className="rounded-full bg-[#D3A337]/10 px-3 py-1 text-[0.7rem] font-bold text-[#B8861B] hover:bg-[#D3A337]/20"
        >
          Generate strong password
        </button>
        {value && (
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-[#0f1b3d]/5 px-3 py-1 text-[0.7rem] font-bold text-[#0f1b3d]/70 hover:bg-[#0f1b3d]/10"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      <p className="mt-1.5 text-[0.7rem] text-[#0f1b3d]/50">At least 8 characters with a letter and a number. Share it with them securely.</p>
    </div>
  );
}

function Modal({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f1b3d]/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#0f1b3d]/8 px-6 py-4">
          <div>
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#D3A337]">{eyebrow}</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0f1b3d]">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-[#0f1b3d]/50 hover:bg-[#F0F5FF] hover:text-[#0f1b3d]" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function RowMenu({
  admin,
  onResetPassword,
  onToggleActive,
  onDelete,
}: {
  admin: AdminPublic;
  onResetPassword: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const item = 'block w-full px-4 py-2 text-left text-sm hover:bg-[#F6F8FF]';
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-[#0f1b3d]/10 p-2 text-[#0f1b3d]/60 hover:bg-[#F6F8FF] hover:text-[#0f1b3d]"
        aria-label={`Actions for ${admin.username}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-[#0f1b3d]/10 bg-white py-1 shadow-[0_16px_40px_rgba(15,27,61,0.12)]">
          <button type="button" role="menuitem" className={`${item} text-[#0f1b3d]`} onClick={() => { setOpen(false); onResetPassword(); }}>
            Reset password
          </button>
          <button type="button" role="menuitem" className={`${item} text-[#0f1b3d]`} onClick={() => { setOpen(false); onToggleActive(); }}>
            {admin.active ? 'Disable account' : 'Enable account'}
          </button>
          <button type="button" role="menuitem" className={`${item} text-red-600`} onClick={() => { setOpen(false); onDelete(); }}>
            Delete admin
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminUsersPanel({
  currentAdmin,
  admins,
  setAdmins,
  handleAuthError,
}: {
  currentAdmin: AdminPublic;
  admins: AdminPublic[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminPublic[]>>;
  /** Returns true if the response was a 401/403 that the dashboard handled. */
  handleAuthError: (response: Response) => boolean;
}) {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminPublic | null>(null);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3500);
  };

  /** PATCHes an admin; applies `optimistic` immediately and reverts on failure. */
  const patchAdmin = async (admin: AdminPublic, body: Record<string, unknown>, optimistic?: Partial<AdminPublic>) => {
    setError('');
    setSavingId(admin.id);
    if (optimistic) {
      setAdmins((list) => list.map((a) => (a.id === admin.id ? { ...a, ...optimistic } : a)));
    }
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(admin.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (handleAuthError(res)) return null;
      const data = (await res.json()) as AdminPublic & { error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to update admin');
      setAdmins((list) => list.map((a) => (a.id === admin.id ? data : a)));
      return data;
    } catch (err) {
      setAdmins((list) => list.map((a) => (a.id === admin.id ? admin : a)));
      setError(err instanceof Error ? err.message : 'Failed to update admin');
      return null;
    } finally {
      setSavingId(null);
    }
  };

  const togglePermission = (admin: AdminPublic, permission: AdminPermission, next: boolean) => {
    const set = new Set(admin.permissions);
    if (next) set.add(permission);
    else set.delete(permission);
    const permissions = withImplied(ADMIN_PERMISSIONS.filter((p) => set.has(p)));
    void patchAdmin(admin, { permissions }, { permissions });
  };

  const applyPreset = (admin: AdminPublic, permissions: AdminPermission[]) => {
    void patchAdmin(admin, { permissions }, { permissions: withImplied(permissions) });
  };

  const toggleActive = async (admin: AdminPublic) => {
    if (admin.active && !confirm(`Disable ${admin.name || admin.username}? They will be signed out immediately and can't sign in until re-enabled.`)) {
      return;
    }
    const updated = await patchAdmin(admin, { active: !admin.active }, { active: !admin.active });
    if (updated) flash(updated.active ? 'Account enabled' : 'Account disabled and signed out');
  };

  const removeAdmin = async (admin: AdminPublic) => {
    if (!confirm(`Delete ${admin.name || admin.username}? This can't be undone.`)) return;
    setError('');
    setSavingId(admin.id);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(admin.id)}`, { method: 'DELETE' });
      if (handleAuthError(res)) return;
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to delete admin');
      setAdmins((list) => list.filter((a) => a.id !== admin.id));
      flash('Admin deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin');
    } finally {
      setSavingId(null);
    }
  };

  const sorted = [...admins].sort((a, b) => {
    if (a.id === currentAdmin.id) return -1;
    if (b.id === currentAdmin.id) return 1;
    return a.createdAt.localeCompare(b.createdAt);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#0f1b3d]/60">
          {admins.length} admin{admins.length === 1 ? '' : 's'} · changes to access apply instantly
        </p>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0f1b3d] px-4 text-white shadow hover:bg-[#0f1b3d]/90"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-semibold">Add Admin</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="font-bold" aria-label="Dismiss">×</button>
        </div>
      )}
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">✓ {notice}</div>
      )}

      <div className="space-y-3">
        {sorted.map((admin) => {
          const isSelf = admin.id === currentAdmin.id;
          const isSaving = savingId === admin.id;
          const displayName = admin.name || admin.username;
          return (
            <div
              key={admin.id}
              className={`rounded-[1.5rem] border bg-white p-5 shadow-[0_18px_60px_rgba(15,27,61,0.05)] transition-opacity sm:p-6 ${
                admin.active ? 'border-[#0f1b3d]/10' : 'border-dashed border-[#0f1b3d]/15 opacity-75'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f1b3d] text-sm font-bold uppercase text-white">
                    {displayName.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-bold tracking-tight text-[#0f1b3d]">{displayName}</h3>
                      {isSelf && (
                        <span className="rounded-full bg-[#D3A337]/12 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#B8861B]">You</span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] ${
                          admin.active ? 'bg-emerald-50 text-emerald-700' : 'bg-[#0f1b3d]/8 text-[#0f1b3d]/55'
                        }`}
                      >
                        {admin.active ? 'Active' : 'Disabled'}
                      </span>
                      {isSaving && <span className="text-[0.7rem] font-semibold text-[#0f1b3d]/45">Saving…</span>}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[#0f1b3d]/55">
                      {admin.name ? `@${admin.username} · ` : ''}Last sign-in: {formatRelative(admin.lastLoginAt)}
                    </p>
                  </div>
                </div>

                {!isSelf && (
                  <div className="flex items-center gap-2">
                    <div className="hidden flex-wrap gap-1 md:flex">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          disabled={isSaving}
                          onClick={() => applyPreset(admin, preset.permissions)}
                          className="rounded-full bg-[#F6F8FF] px-2.5 py-1 text-[0.65rem] font-semibold text-[#0f1b3d]/65 hover:bg-[#EEF3FF] hover:text-[#0f1b3d] disabled:opacity-50"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <RowMenu
                      admin={admin}
                      onResetPassword={() => setResetTarget(admin)}
                      onToggleActive={() => toggleActive(admin)}
                      onDelete={() => removeAdmin(admin)}
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <PermissionGrid
                  permissions={admin.permissions}
                  lockedReason={isSelf ? 'You can’t change your own access. Ask another admin.' : isSaving ? 'Saving…' : undefined}
                  onToggle={(permission, next) => togglePermission(admin, permission, next)}
                />
                {isSelf && (
                  <p className="mt-2 text-[0.7rem] text-[#0f1b3d]/45">
                    You can’t change your own access. Change your password under “My Account”.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isCreating && (
        <CreateAdminModal
          onClose={() => setIsCreating(false)}
          handleAuthError={handleAuthError}
          onCreated={(admin) => {
            setAdmins((list) => [...list, admin]);
            setIsCreating(false);
            flash(`${admin.name || admin.username} added. Share their username and password with them.`);
          }}
        />
      )}

      {resetTarget && (
        <ResetPasswordModal
          admin={resetTarget}
          onClose={() => setResetTarget(null)}
          onSubmit={async (password) => {
            const updated = await patchAdmin(resetTarget, { password });
            if (updated) {
              setResetTarget(null);
              flash(`Password reset for ${updated.name || updated.username}. They've been signed out everywhere.`);
            }
            return Boolean(updated);
          }}
        />
      )}
    </div>
  );
}

function CreateAdminModal({
  onClose,
  onCreated,
  handleAuthError,
}: {
  onClose: () => void;
  onCreated: (admin: AdminPublic) => void;
  handleAuthError: (response: Response) => boolean;
}) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(() => generatePassword());
  const [permissions, setPermissions] = useState<AdminPermission[]>(['applications', 'investors', 'contacts']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, permissions }),
      });
      if (handleAuthError(res)) return;
      const data = (await res.json()) as AdminPublic & { error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to create admin');
      onCreated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#0f1b3d]/15 bg-white px-4 py-2.5 text-sm text-[#0f1b3d] focus:border-[#D3A337] focus:outline-none focus:ring-1 focus:ring-[#D3A337]';
  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/70';

  return (
    <Modal title="Add a new admin" eyebrow="Admin Users" onClose={onClose}>
      <form onSubmit={submit} className="space-y-5 px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new-admin-name" className={labelClass}>Full name</label>
            <input id="new-admin-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Shah" className={inputClass} />
          </div>
          <div>
            <label htmlFor="new-admin-username" className={labelClass}>Username *</label>
            <input
              id="new-admin-username"
              required
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              placeholder="e.g. priya or priya@pfundit.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="new-admin-password" className={labelClass}>Temporary password *</label>
          <PasswordField id="new-admin-password" value={password} onChange={setPassword} />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className={labelClass.replace('mb-1.5 ', '')}>Access</span>
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setPermissions(withImplied(preset.permissions))}
                  className="rounded-full bg-[#F6F8FF] px-2.5 py-1 text-[0.65rem] font-semibold text-[#0f1b3d]/65 hover:bg-[#EEF3FF] hover:text-[#0f1b3d]"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <PermissionGrid
            permissions={permissions}
            onToggle={(permission, next) => {
              const set = new Set(permissions);
              if (next) set.add(permission);
              else set.delete(permission);
              setPermissions(withImplied(ADMIN_PERMISSIONS.filter((p) => set.has(p))));
            }}
          />
          <p className="mt-2 text-[0.7rem] text-[#0f1b3d]/50">Everyone can always change their own password under “My Account”.</p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-end gap-3 border-t border-[#0f1b3d]/10 pt-4">
          <button type="button" onClick={onClose} className="rounded-full border border-[#0f1b3d]/12 bg-white px-5 py-2 text-sm font-bold text-[#0f1b3d] hover:bg-[#F0F5FF]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="rounded-full bg-[#0f1b3d] px-6 py-2 text-sm font-bold text-white hover:bg-[#0f1b3d]/90 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Admin'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ResetPasswordModal({
  admin,
  onClose,
  onSubmit,
}: {
  admin: AdminPublic;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}) {
  const [password, setPassword] = useState(() => generatePassword());
  const [loading, setLoading] = useState(false);

  return (
    <Modal title={`Reset password for ${admin.name || admin.username}`} eyebrow="Admin Users" onClose={onClose}>
      <form
        className="space-y-5 px-6 py-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          await onSubmit(password);
          setLoading(false);
        }}
      >
        <p className="text-sm text-[#0f1b3d]/65">
          They’ll be signed out of every device and will need this new password to sign in again.
        </p>
        <PasswordField id="reset-admin-password" value={password} onChange={setPassword} />
        <div className="flex items-center justify-end gap-3 border-t border-[#0f1b3d]/10 pt-4">
          <button type="button" onClick={onClose} className="rounded-full border border-[#0f1b3d]/12 bg-white px-5 py-2 text-sm font-bold text-[#0f1b3d] hover:bg-[#F0F5FF]">
            Cancel
          </button>
          <button type="submit" disabled={loading || !password} className="rounded-full bg-[#0f1b3d] px-6 py-2 text-sm font-bold text-white hover:bg-[#0f1b3d]/90 disabled:opacity-50">
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
