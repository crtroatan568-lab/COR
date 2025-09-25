// API route para Vercel: /api/orden
const axios = require('axios');

module.exports = async (req, res) => {
  const orderId = req.query.order_id;
  if (!orderId) {
    res.status(400).json({ error: 'Falta el parámetro order_id' });
    return;
  }
  const endpoint = 'https://servitotal.com/honduras/wp-admin/admin-ajax.php';
  const payload = new URLSearchParams({
    action: 'handle_apigee_form_user_order_submission',
    idType: '2',
    idNumber: orderId,
    countryID: 'HN'
  }).toString();
  try {
    const { data: response } = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    if (response && response.success && response.data && response.data.order) {
      res.status(200).json({ orderId, datos: response.data.order });
    } else if (response && response.data && response.data.error) {
      res.status(200).json({ error: response.data.error, orderId });
    } else {
      res.status(200).json({ error: 'No se encontraron datos para la orden', orderId });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar el endpoint', details: err.message });
  }
};
