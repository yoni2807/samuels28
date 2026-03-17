import { useState } from 'react';
import { useGroups } from '../hooks/useGroups';

function ScreeningCard({ screening, user, onRespond }) {
  const hasApproved = screening.approvals?.includes(user.uid);
  const hasRejected = screening.rejections?.includes(user.uid);
  const approvalsCount = screening.approvals?.length || 0;
  const total = screening.totalMembers || 1;

  return (
    <div className={`screening-card ${screening.status}`}>
      <div className="screening-card-header">
        <div>
          <div className="screening-movie-title">{screening.movieTitle}</div>
          <div className="screening-movie-meta">
            dir. {screening.movieDirector} · {screening.movieYear}
          </div>
        </div>
        <span className={`screening-status-badge ${screening.status}`}>
          {screening.status === 'confirmed' ? '✓ Confirmed' :
           screening.status === 'rejected' ? '✕ Rejected' : '◷ Pending'}
        </span>
      </div>

      <div className="screening-date">📅 {screening.date}</div>

      <div className="screening-proposed">
        Proposed by {screening.proposedByName}
      </div>

      <div className="screening-votes">
        <div className="screening-votes-bar">
          <div
            className="screening-votes-fill"
            style={{ width: `${(approvalsCount / total) * 100}%` }}
          />
        </div>
        <span className="screening-votes-text">
          {approvalsCount}/{total} approved
        </span>
      </div>

      {screening.status === 'pending' && (
        <div className="screening-actions">
          <button
            className={`screening-btn approve ${hasApproved ? 'active' : ''}`}
            onClick={() => onRespond(screening.id, true)}
          >
            ✓ Approve
          </button>
          <button
            className={`screening-btn reject ${hasRejected ? 'active' : ''}`}
            onClick={() => onRespond(screening.id, false)}
          >
            ✕ Decline
          </button>
        </div>
      )}
    </div>
  );
}

function GroupCard({ group, user, movies, onPropose, onLeave, onRespond }) {
  const [showPropose, setShowPropose] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const handlePropose = () => {
    if (!selectedMovie || !selectedDate) return;
    const movie = movies.find(m => m.id === selectedMovie);
    onPropose(group.id, movie, selectedDate);
    setShowPropose(false);
    setSelectedMovie('');
    setSelectedDate('');
  };

  const pendingCount = group.screenings?.filter(s => s.status === 'pending').length || 0;
  const members = Object.values(group.memberNames || {});

  return (
    <div className="group-card">
      <div className="group-card-header">
        <div>
          <div className="group-name">{group.name}</div>
          <div className="group-meta">
            {members.length} member{members.length !== 1 ? 's' : ''} · Created by {group.createdByName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {pendingCount > 0 && (
            <span className="pending-badge">{pendingCount} pending</span>
          )}
          <button className="group-action-btn" onClick={() => setShowInvite(!showInvite)}>
            🔗 Invite
          </button>
          <button className="group-action-btn danger" onClick={() => onLeave(group.id)}>
            Leave
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="group-members">
        {Object.entries(group.memberPhotos || {}).map(([uid, photo]) => (
          <img
            key={uid}
            src={photo || `https://ui-avatars.com/api/?name=${group.memberNames?.[uid]}&background=3d2b1f&color=c9a84c`}
            alt={group.memberNames?.[uid]}
            className="member-avatar"
            title={group.memberNames?.[uid]}
          />
        ))}
      </div>

      {/* Invite code */}
      {showInvite && (
        <div className="invite-box">
          <span className="invite-label">Invite Code:</span>
          <span className="invite-code">{group.inviteCode}</span>
          <button
            className="invite-copy-btn"
            onClick={() => navigator.clipboard.writeText(group.inviteCode)}
          >
            Copy
          </button>
        </div>
      )}

      {/* Screenings */}
      <div className="screenings-list">
        {group.screenings?.length === 0 && (
          <div className="no-screenings">No screenings proposed yet</div>
        )}
        {[...(group.screenings || [])]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map(s => (
            <ScreeningCard
              key={s.id}
              screening={s}
              user={user}
              onRespond={(sid, approve) => onRespond(group.id, sid, approve)}
            />
          ))}
      </div>

      {/* Propose */}
      {showPropose ? (
        <div className="propose-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Film</label>
              <select
                className="form-select"
                value={selectedMovie}
                onChange={e => setSelectedMovie(e.target.value)}
              >
                <option value="">Select a film...</option>
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={handlePropose}>Propose</button>
            <button className="btn btn-secondary" onClick={() => setShowPropose(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="propose-btn" onClick={() => setShowPropose(true)}>
          + Propose Screening
        </button>
      )}
    </div>
  );
}

export default function Groups({ user, movies }) {
  const { groups, loading, createGroup, joinGroup, proposeScreening, respondToScreening, leaveGroup } = useGroups(user);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinMsg, setJoinMsg] = useState('');

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    await createGroup(groupName.trim());
    setGroupName('');
    setShowCreate(false);
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    const result = await joinGroup(inviteCode.trim());
    if (result === 'not_found') setJoinMsg('Group not found. Check the code.');
    else { setJoinMsg(''); setInviteCode(''); setShowJoin(false); }
  };

  if (!user) return (
    <div className="main-content">
      <h1 className="page-title">Watch <span>Groups</span></h1>
      <div className="empty-state">
        <span className="empty-state-icon">👥</span>
        <p className="empty-state-text">Sign in to create and join watch groups</p>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <h1 className="page-title">Watch <span>Groups</span></h1>
      <p className="page-subtitle">plan screenings with friends</p>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <button className="btn btn-primary" onClick={() => { setShowCreate(true); setShowJoin(false); }}>
          + Create Group
        </button>
        <button className="btn btn-secondary" onClick={() => { setShowJoin(true); setShowCreate(false); }}>
          Join Group
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="group-form-box">
          <div className="form-group">
            <label className="form-label">Group Name</label>
            <input
              className="form-input"
              placeholder="e.g. Friday Night Cinema"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={handleCreate}>Create</button>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Join form */}
      {showJoin && (
        <div className="group-form-box">
          <div className="form-group">
            <label className="form-label">Invite Code</label>
            <input
              className="form-input"
              placeholder="e.g. ABC123"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
            {joinMsg && <div style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: '0.3rem' }}>{joinMsg}</div>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={handleJoin}>Join</button>
            <button className="btn btn-secondary" onClick={() => setShowJoin(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <p className="empty-state-text">Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🎬</span>
          <p className="empty-state-text">No groups yet. Create one or join with an invite code.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              user={user}
              movies={movies}
              onPropose={proposeScreening}
              onLeave={leaveGroup}
              onRespond={respondToScreening}
            />
          ))}
        </div>
      )}
    </div>
  );
}