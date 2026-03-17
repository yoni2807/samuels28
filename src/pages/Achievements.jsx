import { ACHIEVEMENTS, getUnlockedAchievements } from '../data/achievements';

export default function Achievements({ stats }) {
  const unlocked = getUnlockedAchievements(stats);

  return (
    <div className="main-content">
      <h1 className="page-title">Achievements</h1>
      <p className="page-subtitle">— your cult cinema milestones —</p>

      <div style={{ marginBottom: '2rem', fontFamily: 'Special Elite, cursive', color: 'var(--aged)', fontSize: '0.9rem' }}>
        {unlocked.length} / {ACHIEVEMENTS.length} unlocked
      </div>

      <div className="achievements-grid">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <div key={ach.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">{ach.icon}</div>
              <div className="achievement-name">{ach.name}</div>
              <div className="achievement-desc">{ach.desc}</div>
              {isUnlocked && (
                <div style={{ marginTop: '0.75rem', fontFamily: 'Courier Prime, monospace', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>
                  ✓ UNLOCKED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}