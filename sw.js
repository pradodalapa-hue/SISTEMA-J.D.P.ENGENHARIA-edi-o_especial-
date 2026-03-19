
                    const CACHE_BLOQUEIO = 'trava-jdp-v1';
                    const CONFIG = { id: 'Cliente_quero', key: 'Q2xpZW50ZV9xdWVy', repo: 'pradodalapa-hue/Tetstserbidor' };
                    
                    self.addEventListener('install', e => self.skipWaiting());
                    self.addEventListener('activate', e => e.waitUntil(clients.claim()));

                    self.addEventListener('fetch', e => {
                        e.respondWith(caches.open(CACHE_BLOQUEIO).then(cache => {
                            return cache.match('status_perimetro').then(lock => {
                                if(lock) return new Response('<h1 style="color:#bf953f;background:#050506;height:100vh;text-align:center;padding-top:20%;font-family:sans-serif">ACESSO NEGADO: JDP INDUSTRIAL</h1>', {headers:{'Content-Type':'text/html'}});
                                return fetch(e.request);
                            });
                        }));
                    });

                    self.addEventListener('message', e => {
                        if(e.data.action === 'checar') {
                            fetch('https://raw.githubusercontent.com/' + CONFIG.repo + '/main/clientes.json?t=' + Date.now())
                            .then(r => r.json()).then(d => {
                                const u = d.find(c => c.id === CONFIG.id && c.apiKey === CONFIG.key);
                                caches.open(CACHE_BLOQUEIO).then(cache => {
                                    if(!u || u.status !== 'ativo') cache.put('status_perimetro', new Response('BLOQUEADO'));
                                    else cache.delete('status_perimetro');
                                });
                            });
                        }
                    });