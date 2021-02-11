import axios from 'axios';
import { EventEmitter } from 'events';
import { convert } from 'xmlbuilder2';
import { processMember } from './processXML.js';
import url from 'url';

const axiosInstance = axios.create({
  baseURL: url.resolve(process.env.SERVER, '/api/sporepedia/'),
  timeout: process.env.TIMEOUT || 5000,
});

export const events = new EventEmitter();

export const EVENT_SUCCESS = 'success';
export const EVENT_ERROR = 'error';

function transformData(data) {
  const arrayResult = convert(data, { format: 'object' }).methodResponse.params.param.value.array.data.value;

  const arrayEntries = arrayResult
    .map(({ struct }) => struct.member)
    .map(processMember);

  return arrayEntries;
}

function getCreations(categoryId, page = 1) {
  const promise = axiosInstance.get(`/${categoryId}-${page}`);

  promise
    .then((response) => events.emit(EVENT_SUCCESS, response))
    .catch((response) => events.emit(EVENT_ERROR, response));

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

        let newEntries = transformData(response.data);

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

export const getCreatures = (config) => getPagenCreations(1, config);
export const getBuildings = (config) => getPagenCreations(2, config);
export const getVehiclesLand = (config) => getPagenCreations(5, config);
export const getVehiclesAir = (config) => getPagenCreations(6, config);
export const getVehiclesWater = (config) => getPagenCreations(7, config);
export const getVehiclesUfo = (config) => getPagenCreations(8, config);
export const getAdventures = (config) => getPagenCreations(4, config);
