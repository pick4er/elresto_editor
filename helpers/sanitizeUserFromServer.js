import { SERVER_TO_LOCAL_USER_FIELDS } from 'helpers/constants';

export default function sanitizeUserFromServer(userFromServer) {
  const sanitizedUser = {};

  Object.keys(SERVER_TO_LOCAL_USER_FIELDS).forEach(serverField => {
    if (typeof userFromServer[serverField] === 'undefined') {
      sanitizedUser[serverField] = userFromServer[serverField];
      return;
    }

    const localField = SERVER_TO_LOCAL_USER_FIELDS[serverField];
    sanitizedUser[localField] = userFromServer[serverField];
  });

  return sanitizedUser;
}
