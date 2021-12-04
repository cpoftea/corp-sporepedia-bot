import { api } from './service.mjs';
import { resolve } from './url-resolve.mjs';
import { server } from './config.mjs';
import { xmlToObject } from './processXML.mjs';
import { handleError } from './error-handler.mjs';

export async function getUserAvatar(userId) {
  const response = await api.get(`/index/8-${userId}`, {
    params: {
      id: userId,
    },
    transformResponse: [xmlToObject],
  }).catch(error => (handleError(error), error.response));

  if (!response) return;

  const avatarURL = response.data?.
    methodResponse?.params?.param?.value?.struct?.
    member?.find?.((member) => member.name === 'USER_AVATAR')?.
    value?.string;

  if (!avatarURL || typeof avatarURL !== 'string') return;

  return resolve(server, avatarURL);
}
