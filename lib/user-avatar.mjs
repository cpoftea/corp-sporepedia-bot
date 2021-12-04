import axios from 'axios';
import url from 'url';

const server = process.env.SERVER;
const axiosInstance = axios.create({
  baseURL: url.resolve(server, '/php/')
});

export async function getUserAvatar(userId) {
  let avatarURL;

  try {
    const response = await axiosInstance.get(`/user_avatar.php`, {
      params: {
        id: userId,
      }
    });

    avatarURL = response.data;
  } catch (err) {
    throw err;
  }

  return url.resolve(server, avatarURL);
}
