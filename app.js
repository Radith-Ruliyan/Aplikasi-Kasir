/* =================================================================
   DATA & STATE
================================================================= */

// Level pedas yang tersedia, berurutan dari paling ringan ke paling pedas
const LEVEL_PEDAS = [
  { key: 'tidak',  label: 'Tidak Pedas', emoji: '⚪' },
  { key: 'sedikit', label: 'Sedikit',    emoji: '🌶️' },
  { key: 'sedang',  label: 'Sedang',     emoji: '🌶️🌶️' },
  { key: 'pedas',   label: 'Pedas',      emoji: '🌶️🌶️🌶️' },
];

// Daftar menu (sudah diperluas sesuai menu warung yang sebenarnya)
// catatan: properti `pedas:true` menandakan menu ini punya pilihan level pedas.
// Semua menu kecuali Indomie (m31-m36) dan item tambahan (m37-m39) diberi pedas:true.
const MENU = [
  { id: 'm1',  nama: 'Nasi Goreng Ayam',           harga: 15000, pedas: true },
  { id: 'm2',  nama: 'Nasi Goreng Sosis',          harga: 16000, pedas: true },
  { id: 'm3',  nama: 'Nasi Goreng Bakso',          harga: 16000, pedas: true },
  { id: 'm4',  nama: 'Nasi Goreng Ati Ampela',     harga: 17000, pedas: true },
  { id: 'm5',  nama: 'Nasi Goreng Spesial',        harga: 25000, pedas: true },
  { id: 'm6',  nama: 'Nasi Goreng Pete',           harga: 19000, pedas: true },
  { id: 'm7',  nama: 'Mie Goreng Ayam',            harga: 16000, pedas: true },
  { id: 'm8',  nama: 'Mie Goreng Sosis',           harga: 17000, pedas: true },
  { id: 'm9',  nama: 'Mie Goreng Bakso',           harga: 17000, pedas: true },
  { id: 'm10', nama: 'Mie Goreng Ati Ampela',      harga: 18000, pedas: true },
  { id: 'm11', nama: 'Mie Goreng Spesial',         harga: 26000, pedas: true },
  { id: 'm12', nama: 'Bihun Goreng Ayam',          harga: 16000, pedas: true },
  { id: 'm13', nama: 'Bihun Goreng Sosis',         harga: 17000, pedas: true },
  { id: 'm14', nama: 'Bihun Goreng Bakso',         harga: 17000, pedas: true },
  { id: 'm15', nama: 'Bihun Goreng Ati Ampela',    harga: 18000, pedas: true },
  { id: 'm16', nama: 'Bihun Goreng Spesial',       harga: 26000, pedas: true },
  { id: 'm17', nama: 'Mie Rebus Ayam',             harga: 16000, pedas: true },
  { id: 'm18', nama: 'Mie Rebus Sosis',            harga: 17000, pedas: true },
  { id: 'm19', nama: 'Mie Rebus Bakso',            harga: 17000, pedas: true },
  { id: 'm20', nama: 'Mie Rebus Ati Ampela',       harga: 18000, pedas: true },
  { id: 'm21', nama: 'Mie Rebus Spesial',          harga: 26000, pedas: true },
  { id: 'm22', nama: 'Kwetiau Goreng Ayam',        harga: 16000, pedas: true },
  { id: 'm23', nama: 'Kwetiau Goreng Sosis',       harga: 17000, pedas: true },
  { id: 'm24', nama: 'Kwetiau Goreng Bakso',       harga: 17000, pedas: true },
  { id: 'm25', nama: 'Kwetiau Goreng Ati Ampela',  harga: 18000, pedas: true },
  { id: 'm26', nama: 'Kwetiau Goreng Spesial',     harga: 26000, pedas: true },
  { id: 'm27', nama: 'Kwetiau Rebus Ayam',         harga: 16000, pedas: true },
  { id: 'm28', nama: 'Kwetiau Rebus Sosis',        harga: 17000, pedas: true },
  { id: 'm29', nama: 'Kwetiau Rebus Bakso',        harga: 17000, pedas: true },
  { id: 'm30', nama: 'Kwetiau Rebus Ati Ampela',   harga: 18000, pedas: true },
  { id: 'm31', nama: 'Indomie Goreng',             harga: 10000, pedas: false },
  { id: 'm32', nama: 'Indomie Goreng Aceh',        harga: 10000, pedas: false },
  { id: 'm33', nama: 'Indomie Goreng Rendang',     harga: 10000, pedas: false },
  { id: 'm34', nama: 'Indomie Rebus Seblak',       harga: 10000, pedas: false },
  { id: 'm35', nama: 'Indomie Rebus Soto',         harga: 10000, pedas: false },
  { id: 'm36', nama: 'Indomie Rebus Ayam Bawang',  harga: 10000, pedas: false },
  { id: 'm37', nama: 'Tambahan Bakso',             harga: 1000,  pedas: false },
  { id: 'm38', nama: 'Tambahan Sosis',             harga: 1000,  pedas: false },
  { id: 'm39', nama: 'Tambahan Telur',             harga: 5000,  pedas: false },
];

// Keranjang: array of { id, nama, harga, qty, manual: true/false, pedas: 'tidak'|'sedikit'|'sedang'|'pedas'|null }
let cart = [];

// localStorage key
const STORAGE_KEY = 'kasir_ambyar_cart';

/* =================================================================
   UTIL: FORMAT RUPIAH
================================================================= */
function formatRupiah(angka) {
  angka = Math.round(Number(angka) || 0);
  return 'Rp' + angka.toLocaleString('id-ID');
}

function getLevelLabel(key) {
  const lv = LEVEL_PEDAS.find(l => l.key === key);
  return lv ? lv.label : '';
}

/* =================================================================
   UTIL: TOAST NOTIFICATION (pengganti alert bawaan browser)
================================================================= */
function showToast(message, type = 'info') {
  const wrap = document.getElementById('toastWrap');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  wrap.appendChild(toast);

  // trigger animasi masuk
  requestAnimationFrame(() => toast.classList.add('show'));

  // pesan panjang (mis. instruksi langkah-langkah) ditampilkan lebih lama agar terbaca
  const durasi = message.length > 50 ? 4000 : 2200;

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, durasi);
}

/* =================================================================
   JAM & TANGGAL REAL-TIME
================================================================= */
const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function formatTanggalLengkap(d) {
  // Contoh: Kamis, 25 Juni 2026
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTanggalSingkat(d) {
  // Contoh: 25 Juni 2026
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}
function formatWaktu(d) {
  const jam = String(d.getHours()).padStart(2, '0');
  const menit = String(d.getMinutes()).padStart(2, '0');
  return `${jam}:${menit}`;
}

function updateClock() {
  const now = new Date();
  document.getElementById('headerDate').textContent = formatTanggalLengkap(now);
  document.getElementById('headerTime').textContent = formatWaktu(now);
}
updateClock();
setInterval(updateClock, 1000 * 10); // update tiap 10 detik, cukup untuk jam:menit

/* =================================================================
   RENDER MENU (dengan dukungan pencarian)
================================================================= */
function renderMenu(filter = '') {
  const grid = document.getElementById('menuGrid');
  const keyword = filter.trim().toLowerCase();
  const filtered = MENU.filter(m => m.nama.toLowerCase().includes(keyword));

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="menu-empty">Menu "${escapeHtml(filter)}" tidak ditemukan.<br>Gunakan form "Tambah Item Manual" di bawah jika ini item baru.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(m => `
    <button class="menu-item" data-id="${m.id}">
      <span class="nama">${escapeHtml(m.nama)}</span>
      <span class="harga">${formatRupiah(m.harga)}</span>
      ${m.pedas ? `<span class="pedas-tag">🌶️ Pilih level pedas</span>` : ''}
    </button>
  `).join('');

  // pasang event click ke tiap kartu menu
  grid.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = MENU.find(m => m.id === btn.dataset.id);
      if (item.pedas) {
        bukaModalPedas(item);
      } else {
        addToCart(item.nama, item.harga, false, null);
      }
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* =================================================================
   MODAL PILIH LEVEL PEDAS
================================================================= */
function bukaModalPedas(item) {
  const box = document.getElementById('spicyModalBox');

  box.innerHTML = `
    <h3>${escapeHtml(item.nama)}</h3>
    <div class="spicy-modal-harga">${formatRupiah(item.harga)} &middot; Pilih level pedas</div>
    <div class="spicy-options">
      ${LEVEL_PEDAS.map(lv => `
        <button class="spicy-option-btn" data-key="${lv.key}">
          <span class="emoji">${lv.emoji}</span>
          <span>${lv.label}</span>
        </button>
      `).join('')}
    </div>
    <button class="spicy-cancel-btn" id="btnBatalPedas">Batal</button>
  `;

  document.getElementById('spicyOverlay').classList.add('show');

  box.querySelectorAll('.spicy-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(item.nama, item.harga, false, btn.dataset.key);
      tutupModalPedas();
    });
  });

  document.getElementById('btnBatalPedas').addEventListener('click', tutupModalPedas);
}

function tutupModalPedas() {
  document.getElementById('spicyOverlay').classList.remove('show');
}

// klik di luar kotak -> tutup modal pedas
document.getElementById('spicyOverlay').addEventListener('click', e => {
  if (e.target.id === 'spicyOverlay') tutupModalPedas();
});

/* =================================================================
   KERANJANG: TAMBAH / UBAH QTY / HAPUS
================================================================= */
function addToCart(nama, harga, isManual, pedasKey) {
  nama = nama.trim();
  harga = Number(harga);

  if (!nama) {
    showToast('Nama item tidak boleh kosong.', 'error');
    return;
  }
  if (isNaN(harga) || harga < 0) {
    showToast('Harga tidak valid.', 'error');
    return;
  }

  // Jika item dengan nama, harga, & level pedas sama sudah ada di keranjang, tambah qty saja.
  // Level pedas yang berbeda dianggap item baris terpisah supaya tidak tercampur di dapur.
  const existing = cart.find(c =>
    c.nama.toLowerCase() === nama.toLowerCase() &&
    c.harga === harga &&
    (c.pedas || null) === (pedasKey || null)
  );
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      nama,
      harga,
      qty: 1,
      manual: isManual,
      pedas: pedasKey || null
    });
  }

  saveCart();
  renderCart();
  const labelPedas = pedasKey ? ` (${getLevelLabel(pedasKey)})` : '';
  showToast(`${nama}${labelPedas} ditambahkan`, 'success');

  // Catatan: auto-focus ke input bayar TIDAK dilakukan di sini.
  // Di mobile, focus() pada input memicu keyboard muncul dan browser
  // otomatis scroll ke bawah supaya input terlihat — ini mengganggu
  // saat kasir masih ingin memilih beberapa item sekaligus dari menu.
  // Auto-focus tetap dilakukan di titik yang menandakan "sudah selesai
  // pilih menu" (Enter di search bar, tombol quick-cash/Bayar Pas, dan
  // setelah tambah item manual).
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
    showToast(`${item.nama} dihapus dari keranjang`, 'info');
  }
  saveCart();
  renderCart();
}

function changePedas(id, newKey) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.pedas = newKey || null;
  saveCart();
  renderCart();
}

function removeItem(id) {
  const item = cart.find(c => c.id === id);
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  if (item) showToast(`${item.nama} dihapus`, 'info');
}

/* =================================================================
   RENDER KERANJANG & RINGKASAN
================================================================= */
function renderCart() {
  const list = document.getElementById('cartList');

  if (cart.length === 0) {
    list.innerHTML = `<div class="cart-empty">Keranjang masih kosong.<br>Pilih menu di sebelah kiri.</div>`;
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="info">
          <div class="nm">${escapeHtml(item.nama)}${item.manual ? ' <span style="font-size:11px;color:#e85d2c;font-weight:700;">(manual)</span>' : ''}</div>
          <div class="pr">${formatRupiah(item.harga)} / item</div>
          ${item.pedas !== null && item.pedas !== undefined ? `
            <div class="spicy-select">
              <select data-id="${item.id}">
                ${LEVEL_PEDAS.map(lv => `<option value="${lv.key}" ${item.pedas === lv.key ? 'selected' : ''}>${lv.emoji} ${lv.label}</option>`).join('')}
              </select>
            </div>
          ` : ''}
        </div>
        <div class="qty-ctrl">
          <button data-action="minus" data-id="${item.id}">−</button>
          <span class="qty-val">${item.qty}</span>
          <button data-action="plus" data-id="${item.id}">+</button>
        </div>
        <div class="item-subtotal">${formatRupiah(item.harga * item.qty)}</div>
        <button class="btn-del" data-action="del" data-id="${item.id}" title="Hapus item">✕</button>
      </div>
    `).join('');

    // pasang event listener untuk setiap kontrol
    list.querySelectorAll('[data-action="plus"]').forEach(b =>
      b.addEventListener('click', () => changeQty(b.dataset.id, 1)));
    list.querySelectorAll('[data-action="minus"]').forEach(b =>
      b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
    list.querySelectorAll('[data-action="del"]').forEach(b =>
      b.addEventListener('click', () => removeItem(b.dataset.id)));
    list.querySelectorAll('.spicy-select select').forEach(sel =>
      sel.addEventListener('change', () => changePedas(sel.dataset.id, sel.value)));
  }

  updateSummary();
}

function getTotalQty() {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}
function getTotalHarga() {
  return cart.reduce((sum, c) => sum + (c.harga * c.qty), 0);
}

function updateSummary() {
  const total = getTotalHarga();
  document.getElementById('totalQty').textContent = getTotalQty();
  document.getElementById('totalHarga').textContent = formatRupiah(total);
  updateKembalian();

  // tombol bayar aktif hanya jika ada item di keranjang
  document.getElementById('btnBayar').disabled = cart.length === 0;
}

/* =================================================================
   PEMBAYARAN & KEMBALIAN
================================================================= */
function updateKembalian() {
  const total = getTotalHarga();
  const bayarInput = document.getElementById('bayarInput');
  const bayar = Number(bayarInput.value) || 0;
  const kembalian = bayar - total;

  const box = document.getElementById('kembalianBox');
  const nilai = document.getElementById('kembalianNilai');
  const label = box.querySelector('.label');

  if (bayar === 0 && total > 0) {
    box.classList.remove('kurang');
    label.textContent = 'Kembalian';
    nilai.textContent = formatRupiah(0);
  } else if (kembalian < 0) {
    box.classList.add('kurang');
    label.textContent = 'Uang Kurang';
    nilai.textContent = formatRupiah(Math.abs(kembalian));
  } else {
    box.classList.remove('kurang');
    label.textContent = 'Kembalian';
    nilai.textContent = formatRupiah(kembalian);
  }
}

document.getElementById('bayarInput').addEventListener('input', updateKembalian);

// Tombol quick cash: menambah nominal ke input bayar (bukan mengganti, supaya bisa dikombinasikan)
document.querySelectorAll('.quick-cash button').forEach(btn => {
  btn.addEventListener('click', () => {
    const bayarInput = document.getElementById('bayarInput');
    const current = Number(bayarInput.value) || 0;
    bayarInput.value = current + Number(btn.dataset.add);
    updateKembalian();
    bayarInput.focus();
  });
});

// Tombol "Bayar Pas": isi uang diterima persis sebesar total, kembalian otomatis Rp0.
// Berguna untuk pelanggan yang bayar pas tanpa perlu kembalian, jadi kasir tidak perlu hitung manual.
document.getElementById('btnBayarPas').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Keranjang masih kosong, belum ada total untuk dibayar pas.', 'error');
    return;
  }
  const total = getTotalHarga();
  const bayarInput = document.getElementById('bayarInput');
  bayarInput.value = total;
  updateKembalian();
  bayarInput.focus();
  showToast('Uang diisi pas sesuai total. Kembalian Rp0.', 'success');
});

/* =================================================================
   TAMBAH ITEM MANUAL
================================================================= */
document.getElementById('btnTambahManual').addEventListener('click', tambahItemManual);

function tambahItemManual() {
  const namaInput = document.getElementById('manualNama');
  const hargaInput = document.getElementById('manualHarga');

  const nama = namaInput.value.trim();
  const harga = Number(hargaInput.value);

  if (!nama) {
    showToast('Nama item manual harus diisi.', 'error');
    namaInput.focus();
    return;
  }
  if (!hargaInput.value || isNaN(harga) || harga < 0) {
    showToast('Harga item manual tidak valid.', 'error');
    hargaInput.focus();
    return;
  }

  // Item manual tidak memiliki pilihan level pedas (mis. kerupuk, biaya antar, dll.)
  addToCart(nama, harga, true, null);

  // reset form
  namaInput.value = '';
  hargaInput.value = '';
  namaInput.focus(); // supaya bisa lanjut input item manual lain dengan cepat
}

// Enter pada field manual juga langsung menambahkan
document.getElementById('manualNama').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); document.getElementById('manualHarga').focus(); }
});
document.getElementById('manualHarga').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); tambahItemManual(); }
});

/* =================================================================
   PENCARIAN MENU
================================================================= */
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => renderMenu(searchInput.value));

// Enter di search bar -> tambahkan menu hasil pencarian teratas (mempercepat transaksi)
// Jika menu tersebut punya level pedas, buka modal pilih pedas dulu (bukan langsung masuk keranjang).
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();
    const found = MENU.find(m => m.nama.toLowerCase().includes(keyword));
    if (found) {
      if (found.pedas) {
        bukaModalPedas(found);
      } else {
        addToCart(found.nama, found.harga, false, null);
      }
      searchInput.value = '';
      renderMenu('');
    } else {
      showToast('Menu tidak ditemukan. Gunakan form item manual.', 'error');
    }
  }
});

/* =================================================================
   SHORTCUT KEYBOARD GLOBAL: +/- untuk qty item terakhir, Ctrl+Enter bayar
================================================================= */
document.addEventListener('keydown', e => {
  const activeTag = document.activeElement.tagName;
  const isTypingInTextOrNumber = (activeTag === 'INPUT' && document.activeElement.type === 'text');

  // Ctrl + Enter -> proses pembayaran (berlaku di mana saja, kecuali modal struk terbuka)
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    prosesBayar();
    return;
  }

  // +/- untuk qty item TERAKHIR di keranjang, supaya tidak mengganggu saat mengetik harga manual
  if ((e.key === '+' || e.key === '-') && !isTypingInTextOrNumber) {
    if (cart.length === 0) return;
    e.preventDefault();
    const lastItem = cart[cart.length - 1];
    changeQty(lastItem.id, e.key === '+' ? 1 : -1);
  }
});

/* =================================================================
   PROSES PEMBAYARAN & STRUK
================================================================= */
document.getElementById('btnBayar').addEventListener('click', prosesBayar);

let lastTransaction = null; // simpan data transaksi terakhir untuk struk

function prosesBayar() {
  if (cart.length === 0) {
    showToast('Keranjang masih kosong.', 'error');
    return;
  }

  const total = getTotalHarga();
  const bayarInput = document.getElementById('bayarInput');
  const bayar = Number(bayarInput.value) || 0;

  if (bayar < total) {
    showToast('Uang bayar belum cukup!', 'error');
    bayarInput.focus();
    return;
  }

  const kembalian = bayar - total;
  const waktuTransaksi = new Date();

  lastTransaction = {
    items: cart.map(c => ({ ...c })),
    total,
    bayar,
    kembalian,
    waktu: waktuTransaksi
  };

  tampilkanStruk(lastTransaction);
  showToast('Transaksi berhasil!', 'success');

  // reset keranjang & pembayaran untuk transaksi berikutnya
  cart = [];
  bayarInput.value = '';
  saveCart();
  renderCart();
  updateKembalian();
}

document.getElementById('btnReset').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Keranjang sudah kosong.', 'info');
    return;
  }
  cart = [];
  document.getElementById('bayarInput').value = '';
  saveCart();
  renderCart();
  updateKembalian();
  showToast('Keranjang direset.', 'info');
});

/* =================================================================
   PRINT BROWSER DENGAN UKURAN KERTAS DINAMIS (58mm / 80mm)
   @page size tidak bisa diubah lewat class biasa, jadi kita sisipkan
   <style> baru ke <head> setiap kali print, sesuai lebar kertas yang
   dipilih kasir. Style ini otomatis dibuang lagi setelah print selesai.
================================================================= */
function printStrukSesuaiKertas() {
  const lebarMm = paperWidth === 48 ? '80mm' : '58mm';

  const styleEl = document.createElement('style');
  styleEl.id = 'dynamicPrintStyle';
  styleEl.textContent = `
    @media print{
      @page{ size:${lebarMm} auto; margin:0; }
      html, body{ width:${lebarMm} !important; }
      .receipt-box{ width:${lebarMm} !important; max-width:${lebarMm} !important; }
    }
  `;
  document.head.appendChild(styleEl);

  window.print();

  // bersihkan style sisipan setelah dialog print ditutup, supaya tidak menumpuk
  setTimeout(() => {
    const el = document.getElementById('dynamicPrintStyle');
    if (el) el.remove();
  }, 1000);
}

/* =================================================================
   TAMPILKAN STRUK (MODAL)
================================================================= */

// Lebar kertas thermal dalam jumlah karakter (mengikuti standar font monospace thermal printer)
// 32 karakter -> umum untuk kertas 58mm, 48 karakter -> umum untuk kertas 80mm
let paperWidth = Number(localStorage.getItem('kasir_paper_width')) || 32;

function tampilkanStruk(trx) {
  const box = document.getElementById('receiptBox');

  const itemsHtml = trx.items.map(item => `
    <div class="receipt-item-row">
      <div class="nm-row"><span>${escapeHtml(item.nama)}${item.pedas ? ` <span style="font-weight:400;">(${getLevelLabel(item.pedas)})</span>` : ''}</span></div>
      <div class="detail-row">
        <span>${item.qty} x ${formatRupiah(item.harga)}</span>
        <span>${formatRupiah(item.qty * item.harga)}</span>
      </div>
    </div>
  `).join('');

  box.innerHTML = `
    <h2>NASI GORENG AMBYAR</h2>
    <div class="toko-sub">Enak Dan Mengenyangkan &middot; Struk Transaksi</div>
    <div class="receipt-row">
      <span>${formatTanggalSingkat(trx.waktu)}</span>
      <span>${formatWaktu(trx.waktu)}</span>
    </div>
    <div class="line"></div>
    ${itemsHtml}
    <div class="line"></div>
    <div class="receipt-row total">
      <span>TOTAL</span>
      <span>${formatRupiah(trx.total)}</span>
    </div>
    <div class="receipt-row">
      <span>Tunai</span>
      <span>${formatRupiah(trx.bayar)}</span>
    </div>
    <div class="receipt-row">
      <span>Kembali</span>
      <span>${formatRupiah(trx.kembalian)}</span>
    </div>
    <div class="line"></div>
    <div class="receipt-footer">Terima kasih telah berbelanja 🙏<br>Sampai jumpa lagi!</div>
    <div class="receipt-actions">
      <button class="btn-print" id="btnPrintStruk">🖨️ Print Browser</button>
      <button class="btn-close-receipt" id="btnCloseStruk">Tutup</button>
    </div>
    <div class="paper-width-toggle">
      <span style="align-self:center;color:#888;">Lebar kertas:</span>
      <button data-width="32" class="${paperWidth === 32 ? 'active' : ''}">58mm</button>
      <button data-width="48" class="${paperWidth === 48 ? 'active' : ''}">80mm</button>
    </div>
  `;

  document.getElementById('receiptOverlay').classList.add('show');

  document.getElementById('btnPrintStruk').addEventListener('click', () => printStrukSesuaiKertas());
  document.getElementById('btnCloseStruk').addEventListener('click', () => {
    document.getElementById('receiptOverlay').classList.remove('show');
  });

  // toggle lebar kertas
  box.querySelectorAll('.paper-width-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      paperWidth = Number(btn.dataset.width);
      localStorage.setItem('kasir_paper_width', paperWidth);
      box.querySelectorAll('.paper-width-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Lebar kertas diatur ke ${paperWidth === 32 ? '58mm' : '80mm'}`, 'info');
    });
  });
}

// klik di luar struk -> tutup modal
document.getElementById('receiptOverlay').addEventListener('click', e => {
  if (e.target.id === 'receiptOverlay') {
    e.target.classList.remove('show');
  }
});

/* =================================================================
   LOCALSTORAGE: SIMPAN & MUAT KERANJANG SEMENTARA
================================================================= */
function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.warn('Gagal menyimpan keranjang ke localStorage:', err);
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) cart = parsed;
    }
  } catch (err) {
    console.warn('Gagal memuat keranjang dari localStorage:', err);
    cart = [];
  }
}

/* =================================================================
   INISIALISASI APLIKASI
================================================================= */
function init() {
  loadCart();
  renderMenu();
  renderCart();
  updateKembalian();

  // Registrasi Service Worker untuk PWA offline
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker terdaftar:', reg.scope))
      .catch(err => console.warn('Gagal mendaftarkan Service Worker:', err));
  }
}

init();
