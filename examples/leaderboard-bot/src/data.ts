export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: number;
}

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'ShadowKnight', score: 15420, level: 45 },
  { rank: 2, username: 'DragonSlayer', score: 14800, level: 43 },
  { rank: 3, username: 'PhoenixRise', score: 13950, level: 41 },
  { rank: 4, username: 'StarWeaver', score: 12300, level: 38 },
  { rank: 5, username: 'ThunderBolt', score: 11750, level: 37 },
  { rank: 6, username: 'FrostByte', score: 10200, level: 35 },
  { rank: 7, username: 'NightHawk', score: 9800, level: 33 },
  { rank: 8, username: 'CrimsonBlade', score: 9100, level: 31 },
  { rank: 9, username: 'LunarEclipse', score: 8500, level: 29 },
  { rank: 10, username: 'IronWill', score: 7900, level: 27 },
  { rank: 11, username: 'StormChaser', score: 7300, level: 25 },
  { rank: 12, username: 'VoidWalker', score: 6800, level: 24 },
  { rank: 13, username: 'SilverFox', score: 6200, level: 22 },
  { rank: 14, username: 'GoldenArrow', score: 5700, level: 20 },
  { rank: 15, username: 'DarkMatter', score: 5100, level: 18 },
  { rank: 16, username: 'BlazeFury', score: 4600, level: 16 },
  { rank: 17, username: 'CrystalShard', score: 4100, level: 15 },
  { rank: 18, username: 'WindRunner', score: 3500, level: 13 },
  { rank: 19, username: 'EmberGlow', score: 2900, level: 11 },
  { rank: 20, username: 'ArcticWolf', score: 2400, level: 10 },
];

function getMedal(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `\`#${rank}\``;
}

export function formatEntry(entry: LeaderboardEntry): string {
  return `${getMedal(entry.rank)} **${entry.username}** — ${entry.score.toLocaleString()} pts (Lv. ${entry.level})`;
}
