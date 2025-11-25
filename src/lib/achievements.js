const achievements = [
  {
    id: 'first_win',
    name: {
      en: 'First Win',
      ar: 'الفوز الأول',
    },
    description: {
      en: 'Win your first game.',
      ar: 'فز بأول لعبة لك.',
    },
    check: (player) => player.wins >= 1,
  },
  {
    id: 'five_wins',
    name: {
      en: 'Five Wins',
      ar: 'خمسة انتصارات',
    },
    description: {
      en: 'Win 5 games.',
      ar: 'فز بـ 5 ألعاب.',
    },
    check: (player) => player.wins >= 5,
  },
  {
    id: 'ai_easy',
    name: {
      en: 'Easy Peasy',
      ar: 'سهل جدا',
    },
    description: {
      en: 'Win a game against the easy AI.',
      ar: 'فز بلعبة ضد الذكاء الاصطناعي السهل.',
    },
    check: (player) => player.aiWins.easy >= 1,
  },
  {
    id: 'ai_medium',
    name: {
      en: 'Medium Rare',
      ar: 'متوسط الصعوبة',
    },
    description: {
      en: 'Win a game against the medium AI.',
      ar: 'فز بلعبة ضد الذكاء الاصطناعي المتوسط.',
    },
    check: (player) => player.aiWins.medium >= 1,
  },
  {
    id: 'ai_hard',
    name: {
      en: 'Hard as a Rock',
      ar: 'صعب كالصخر',
    },
    description: {
      en: 'Win a game against the hard AI.',
      ar: 'فز بلعبة ضد الذكاء الاصطناعي الصعب.',
    },
    check: (player) => player.aiWins.hard >= 1,
  },
];

export default achievements;
