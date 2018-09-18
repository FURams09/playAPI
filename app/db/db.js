import { MongoClient } from 'mongodb';
import {ObjectID} from 'mongodb';
import {createClient as redisClient} from 'redis';


import redux from '../db/redux-course';
import base_routes from '../db/base-routes';

import config from './config';

const POST_KEY_PREFIX = 'post:';
const POST_LIST = 'post_list'

export const Connect = () => {
    return  new Promise((resolve, reject) => {
                MongoClient.connect(config.url)
                .then(res => {
                    var mongoDB = res;
                    var redis = redisClient(6379, '192.168.99.100');
                    resolve({
                        mongoDB,
                        redis})
                })
                .catch(err => {reject(err)});
            });
}

export default  {
    redux,
    base_routes
}