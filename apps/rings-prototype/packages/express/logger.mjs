import logger from 'pino';

let pinoConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
};
export default logger(pinoConfig);