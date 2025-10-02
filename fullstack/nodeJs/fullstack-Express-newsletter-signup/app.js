// jshint esversion:8
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const client = require('@mailchimp/mailchimp_marketing');
const { MailChimp_apikey, MailChimp_listID } = require('./apikey');

const app = express();

// 解析表单
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

// ===== Mailchimp 基础配置（从 key 自动取数据中心）=====
function configMailchimp() {
  const dc = (MailChimp_apikey || '').split('-')[1]; // 例如 'us3'
  if (!dc) {
    throw new Error(
      'Invalid Mailchimp API key: cannot parse data center suffix.',
    );
  }
  client.setConfig({ apiKey: MailChimp_apikey, server: dc });
}

// ===== 确保受众里有 COUNTRY 字段；没有就创建 =====
// 尝试确保有 COUNTRY merge field —— 已存在就忽略错误
async function ensureCountryMergeField(listId) {
  try {
    await client.lists.addListMergeField(listId, {
      name: 'Country',
      type: 'text',
      tag: 'COUNTRY',
      public: true,
      required: false,
    });
  } catch (e) {
    // 如果已经存在，Mailchimp 会返回 400/某些标题，直接忽略即可
    const title = e?.response?.body?.title || '';
    if (e.status === 400 && /already exists|Invalid Resource/i.test(title)) {
      // 字段已存在/不可重复创建，忽略
      return;
    }
    throw e; // 其他错误再抛出
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'NewsLetter.html'));
});

app.post('/', async (req, res) => {
  const fname = (req.body.fname || '').trim();
  const lname = (req.body.lname || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const country = (req.body.country || '').trim();

  // 简单邮箱校验
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('Invalid email:', email);
    return res.sendFile(path.join(__dirname, 'failure.html'));
  }

  try {
    configMailchimp();

    // 确保有 COUNTRY 字段
    await ensureCountryMergeField(MailChimp_listID);

    const subscriberHash = crypto.createHash('md5').update(email).digest('hex');

    await client.lists.setListMember(MailChimp_listID, subscriberHash, {
      email_address: email,
      status_if_new: 'subscribed', // 新用户：订阅
      status: 'subscribed', // 老用户：保持订阅
      merge_fields: {
        FNAME: fname,
        LNAME: lname,
        COUNTRY: country, // ✅ 一定会写入
      },
    });

    return res.sendFile(path.join(__dirname, 'success.html'));
  } catch (err) {
    // 打印详细错误，便于快速定位
    const status = err.status || err.statusCode;
    const body = err.response?.body || err;
    console.error('Mailchimp error status:', status);
    console.error('Mailchimp error body:', body);

    return res.sendFile(path.join(__dirname, 'failure.html'));
  }
});

// Render/本地端口
app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on', process.env.PORT || 3000);
});
