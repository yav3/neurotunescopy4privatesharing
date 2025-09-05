const KEY = 'np_play_history';
const MAX = 20;

let history: string[] = [];
try {
  history = JSON.parse(localStorage.getItem(KEY) || '[]');
} catch {}

const save = () => localStorage.setItem(KEY, JSON.stringify(history));

export const remember = (id: string) => {
  history = [id, ...history.filter(x => x !== id)].slice(0, MAX);
  save();
};

export const excludeQS = () => history.join(',');

export const newSeed = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;