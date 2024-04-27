import { environment } from '../config/constants.js';

const cookieSessionInject = (req, res) => {
  if (environment === 'production') {
    res.cookie('sessionId', req.session.id, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000 * 24 * 7,
      sameSite: 'none',
    });
  } else {
    res.cookie('sessionId', req.session.id, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000 * 24 * 7,
    });
  }
};

export default cookieSessionInject;
