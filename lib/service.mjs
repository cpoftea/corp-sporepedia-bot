import { server, timeout } from './config.mjs';
import { resolve } from './url-resolve.mjs';
import axios from 'axios';

export const api = axios.create({
  baseURL: resolve(server, '/api/'),
  timeout,
});
