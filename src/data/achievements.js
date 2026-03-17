export const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'First Blood', desc: 'Watch your first cult film', icon: '🎬', condition: (stats) => stats.seen >= 1 },
  { id: 'cult_initiate', name: 'Cult Initiate', desc: 'Watch 5 cult films', icon: '🕯️', condition: (stats) => stats.seen >= 5 },
  { id: 'midnight_rider', name: 'Midnight Rider', desc: 'Watch 10 cult films', icon: '🌙', condition: (stats) => stats.seen >= 10 },
  { id: 'underground', name: 'Underground', desc: 'Watch 25 cult films', icon: '🎭', condition: (stats) => stats.seen >= 25 },
  { id: 'cult_legend', name: 'Cult Legend', desc: 'Watch 50 cult films', icon: '👑', condition: (stats) => stats.seen >= 50 },
  { id: 'archivist', name: 'The Archivist', desc: 'Have 35+ films in your list', icon: '📽️', condition: (stats) => stats.total >= 35 },
  { id: 'scheduler', name: 'The Scheduler', desc: 'Schedule 3 films to watch', icon: '📅', condition: (stats) => stats.scheduled >= 3 },
  { id: 'completionist', name: 'Completionist', desc: 'Watch everything you scheduled', icon: '✅', condition: (stats) => stats.scheduled === 0 && stats.seen >= 5 },
];

export function getUnlockedAchievements(stats) {
  return ACHIEVEMENTS.filter(a => a.condition(stats)).map(a => a.id);
}