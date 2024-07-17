import axios from 'axios';

const API_HOST = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_HOST}/api`;

const getApiClient = (sessionToken) => {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
      'Authentication': `${sessionToken}`,
    }
  });

  return {
    getBots: () => client.get('/bots'),
    getBot: botId => client.get(`/bots/${botId}`),
    createBot: bot => client.post('/bots', bot),
    updateBot: bot => client.put(`/bots/${bot.id}`, bot),
    deleteBot: botId => client.delete(`/bots/${botId}`),
    getLeaderboard: (id) => client.get(`/leaderboards/${id}`),
    getUserStats: (id) => client.get(`/leaderboards/${id}/userStats`),
    searchUsers: queryStr => client.get(`/users/search?q=${queryStr}`),
    downloadCSV: (botConfigId, start, end) => client.get(`/tips/download-csv?botConfigId=${botConfigId}&start=${start}&end=${end}`)
  };
}

export default () => {
  const sessionToken = localStorage.getItem('session');
  return getApiClient(sessionToken);
}