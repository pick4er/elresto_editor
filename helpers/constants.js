
const ADMIN_MODE = 'admin';
const SERVER_TO_LOCAL_USER_FIELDS = {
  user_id: 'userId',
  billing_id: 'billingId',
  email: 'email',
  login: 'login',
  password: 'password',
  first_name: 'name',
  last_name: 'surname',
  middle_name: 'middleName',
  phone: 'phone',
  shipping_address: 'shippingAddress',
};

const constants = Object.freeze({
  ADMIN_MODE,
  SERVER_TO_LOCAL_USER_FIELDS,
});

export default constants;
export {
  ADMIN_MODE,
  SERVER_TO_LOCAL_USER_FIELDS,
};
