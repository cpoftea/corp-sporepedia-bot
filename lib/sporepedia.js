import axios from 'axios';
import { EventEmitter } from 'events';
import { getEntries } from './processXML.js';
import url from 'url';
import partial from 'ramda/src/partial';
import bind from 'ramda/src/bind';

export const events = new EventEmitter();
export const EVENT_SUCCESS = 'success';
export const EVENT_ERROR = 'error';
const emit = bind(events.emit, events);
const responseSuccess = partial(emit, [EVENT_SUCCESS]);
const responseError = partial(emit, [EVENT_ERROR]);

const axiosInstance = axios.create({
  baseURL: url.resolve(process.env.SERVER, '/api/sporepedia/'),
  timeout: process.env.TIMEOUT || 5000,
});

function getCreations(categoryId, page = 1) {
  const promise = axiosInstance.get(`/${categoryId}-${page}`);

  promise.then(responseSuccess, responseError);

  return promise;
}

/**
 * @typedef Config
 * @property {number} timestampBound
 * @property {number} maxPage
 * @property {number} itemsPerPage
 */

/**
 *
 * @param {*} categoryId
 * @param {Config} config
 */
function getPagenCreations(categoryId, config) {
  let { maxPage, timestampBound, itemsPerPage } = config;

  maxPage = maxPage ? maxPage : Infinity;
  itemsPerPage = itemsPerPage ? itemsPerPage : 50;

  return new Promise(async (resolve, reject) => {
    let page = 1;
    let arrayEntries = [];

    do {
      try {
        const response = await getCreations(categoryId, page);

        let newEntries = getEntries(response.data);

        newEntries = newEntries.filter((entry) => entry.TIMESTAMP > timestampBound);

        if (newEntries.length) {
          arrayEntries.push(...newEntries);
        }
      } catch (error) {
        reject(error);
      }
    } while (page < maxPage && arrayEntries.length === itemsPerPage * page++);

    resolve(arrayEntries);
  });
}

export const getCreatures = partial(getPagenCreations, [1]);
export const getBuildings = partial(getPagenCreations, [2]);
export const getVehiclesLand = partial(getPagenCreations, [5]);
export const getVehiclesAir = partial(getPagenCreations, [6]);
export const getVehiclesWater = partial(getPagenCreations, [7]);
export const getVehiclesUfo = partial(getPagenCreations, [8]);
export const getAdventures = partial(getPagenCreations, [4]);
