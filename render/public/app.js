(function () {
  'use strict';
  const cfg = window.HOSTLAB_CONFIG || {type:'Unknown', name:'HostLab', description:'', api:'/api/status'};
  const byId = id => document.getElementById(id);
  byId('hostingName').textContent = cfg.name;
  byId('hostingDescription').textContent = cfg.description;
  byId('hostingTag').textContent = cfg.type;
  byId('currentUrl').textContent = location.href;
  const tls = location.protocol === 'https:';
  byId('tlsState').textContent = tls ? 'АКТИВЕН' : 'НЕТ HTTPS';
  byId('tlsState').classList.add(tls ? 'ok' : 'fail');
  byId('tlsNote').textContent = tls ? 'Соединение через HTTPS' : 'Страница открыта без TLS';
  async function check() {
    const btn = byId('checkBtn');
    btn.disabled = true;
    byId('dbState').textContent='ПРОВЕРКА...';
    byId('dbState').className='';
    try {
      if (!cfg.api || cfg.api.includes('CHANGE-RENDER-URL')) {
        throw new Error('Укажите адрес Render API в docs/config.js');
      }
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),25000);
      let response;
      try { response=await fetch(cfg.api,{cache:'no-store',signal:controller.signal}); }
      finally {clearTimeout(timer);}
      const data=await response.json();
      if (!response.ok || !data.online || data.database !== 'OK') throw new Error(data.message || 'API/БД недоступны (HTTP '+response.status+')');
      byId('dbState').textContent='РАБОТАЕТ';
      byId('dbState').className='ok';
      byId('dbNote').textContent='API и база данных отвечают';
      byId('apiResult').textContent=data.backend+' • '+new Date(data.time).toLocaleString('ru-RU');
      byId('countResult').textContent=String(data.records);
    } catch (e) {
      byId('dbState').textContent='НЕТ СВЯЗИ';
      byId('dbState').className='fail';
      byId('dbNote').textContent='Проверьте настройку сервера';
      byId('apiResult').textContent=String(e.message || e);
      byId('countResult').textContent='—';
    } finally {btn.disabled=false;}
  }
  byId('checkBtn').addEventListener('click',check);
  check();
})();
