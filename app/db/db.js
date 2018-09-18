import { MongoClient } from 'mongodb';
import { createClient as redisClient } from 'redis';

import redux from '../db/redux-course';
import baseRoutes from '../db/base-routes';

import config from './config';

export const Connect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.url)
      .then(res => {
        var mongoDB = res;
        var redis = redisClient(6379, '192.168.99.100');
        resolve({
          mongoDB,
          redis });
      })
      .catch(err => { reject(err); });
  });
};

export default {
  redux,
  baseRoutes,
};
