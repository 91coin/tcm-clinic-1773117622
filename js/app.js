/**
 * 中医诊所管理系统 - 主应用
 * 版本：1.0.0
 */

// 当前页面
let currentPage = 'dashboard';

// 初始化应用
function initApp() {
  loadFromStorage();
  setupNavigation();
  showPage('dashboard');
  updateDate();
  console.log('✅ 中医诊所管理系统 v1.0 已启动');
}

// 设置导航
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const page = this.dataset.page;
      showPage(page);
      
      // 更新导航状态
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// 更新当前日期
function updateDate() {
  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }
}

// 显示页面
function showPage(page) {
  currentPage = page;
  
  const titles = {
    dashboard: '首页',
    patients: '患者管理',
    registration: '预约接诊',
    diagnosis: '中医诊疗',
    prescription: '处方管理',
    payment: '收费结算',
    inventory: '药房库存',
    statistics: '统计报表'
  };
  
  document.getElementById('page-title').textContent = titles[page] || '首页';
  
  const content = document.getElementById('content');
  content.innerHTML = getPageContent(page);
  
  // 初始化页面事件
  initPageEvents(page);
}

// 获取页面内容
function getPageContent(page) {
  switch(page) {
    case 'dashboard': return getDashboardHTML();
    case 'patients': return getPatientsHTML();
    case 'registration': return getRegistrationHTML();
    case 'diagnosis': return getDiagnosisHTML();
    case 'prescription': return getPrescriptionHTML();
    case 'payment': return getPaymentHTML();
    case 'inventory': return getInventoryHTML();
    case 'statistics': return getStatisticsHTML();
    default: return getDashboardHTML();
  }
}

// 首页
function getDashboardHTML() {
  const today = new Date().toLocaleDateString('zh-CN');
  const todayRegistrations = registrations.filter(r => r.date === today).length;
  const todayCases = cases.filter(c => c.date === today).length;
  const todayRevenue = payments.filter(p => p.date === today).reduce((sum, p) => sum + p.total_amount, 0);
  
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${todayRegistrations}</div>
            <div class="stat-label">今日挂号</div>
          </div>
          <div class="stat-icon blue">📝</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${todayCases}</div>
            <div class="stat-label">今日就诊</div>
          </div>
          <div class="stat-icon green">🩺</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${prescriptions.length}</div>
            <div class="stat-label">总处方数</div>
          </div>
          <div class="stat-icon orange">💊</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${formatMoney(todayRevenue)}</div>
            <div class="stat-label">今日营收</div>
          </div>
          <div class="stat-icon cyan">💰</div>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">📋 待诊患者</div>
        <button class="btn btn-primary" onclick="showPage('registration')">➕ 现场挂号</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>患者姓名</th>
            <th>性别</th>
            <th>年龄</th>
            <th>类型</th>
            <th>医生</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${registrations.filter(r => r.status === '待就诊').slice(0, 10).map(r => `
            <tr>
              <td>${r.time}</td>
              <td>${r.patient_name}</td>
              <td>${r.gender}</td>
              <td>${r.age}</td>
              <td><span class="status-badge ${r.type === '初诊' ? 'info' : 'warning'}">${r.type}</span></td>
              <td>${r.doctor_name}</td>
              <td><button class="btn btn-sm btn-primary" onclick="startDiagnosis('${r.id}')">接诊</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 患者管理
function getPatientsHTML() {
  return `
    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
      <input type="text" class="form-input" placeholder="🔍 搜索患者姓名、电话..." id="search-patient" style="flex: 1;">
      <button class="btn btn-primary" onclick="openPatientModal()">➕ 新建档案</button>
      <button class="btn btn-outline" onclick="exportData()">📤 导出数据</button>
    </div>
    
    <!-- 新建患者弹窗 -->
    <div class="modal-overlay" id="patient-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">➕ 新建患者档案</h2>
          <button class="modal-close" onclick="closeModal('patient-modal')">×</button>
        </div>
        <div class="modal-body">
          <form id="patient-form" class="form-grid">
            <div class="form-group">
              <label class="form-label">姓名 <span class="required">*</span></label>
              <input type="text" name="name" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">性别 <span class="required">*</span></label>
              <select name="gender" class="form-select" required>
                <option value="">请选择</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">年龄 <span class="required">*</span></label>
              <input type="number" name="age" class="form-input" required min="1" max="150">
            </div>
            <div class="form-group">
              <label class="form-label">联系电话 <span class="required">*</span></label>
              <input type="tel" name="phone" class="form-input" required pattern="1[3-9]\\d{9}">
            </div>
            <div class="form-group">
              <label class="form-label">体质</label>
              <select name="constitution" class="form-select">
                <option value="平和质">平和质</option>
                <option value="气虚质">气虚质</option>
                <option value="阳虚质">阳虚质</option>
                <option value="阴虚质">阴虚质</option>
                <option value="痰湿质">痰湿质</option>
                <option value="湿热质">湿热质</option>
                <option value="血瘀质">血瘀质</option>
                <option value="气郁质">气郁质</option>
                <option value="特禀质">特禀质</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">过敏史</label>
              <input type="text" name="allergies" class="form-input" placeholder="如：青霉素、无">
            </div>
            <div class="form-group full">
              <label class="form-label">既往病史</label>
              <textarea name="medical_history" class="form-textarea" rows="3" placeholder="如：高血压、糖尿病、无"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('patient-modal')">取消</button>
          <button class="btn btn-primary" onclick="savePatient()">💾 保存</button>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>档案号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>年龄</th>
            <th>联系电话</th>
            <th>体质</th>
            <th>就诊次数</th>
            <th>建档日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="patient-list">
          ${patients.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.name}</td>
              <td>${p.gender}</td>
              <td>${p.age}</td>
              <td>${p.phone}</td>
              <td><span class="status-badge info">${p.constitution}</span></td>
              <td>${p.visit_count}</td>
              <td>${formatDate(p.register_date)}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="viewPatient('${p.id}')">查看</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- 患者详情弹窗 -->
    <div class="modal-overlay" id="patient-detail-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">👥 患者档案详情</h2>
          <button class="modal-close" onclick="closeModal('patient-detail-modal')">×</button>
        </div>
        <div class="modal-body" id="patient-detail-content"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('patient-detail-modal')">关闭</button>
        </div>
      </div>
    </div>
  `;
}

// 预约接诊
function getRegistrationHTML() {
  return `
    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
      <input type="text" class="form-input" placeholder="🔍 搜索患者..." id="search-registration" style="flex: 1;">
      <button class="btn btn-primary" onclick="openRegistrationModal()">➕ 现场挂号</button>
    </div>
    
    <!-- 现场挂号弹窗 -->
    <div class="modal-overlay" id="registration-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">📝 现场挂号</h2>
          <button class="modal-close" onclick="closeModal('registration-modal')">×</button>
        </div>
        <div class="modal-body">
          <form id="registration-form" class="form-grid">
            <div class="form-group full">
              <label class="form-label">选择患者 <span class="required">*</span></label>
              <select name="patient_id" class="form-select" required onchange="fillPatientInfo(this)">
                <option value="">请选择患者</option>
                ${patients.map(p => `<option value="${p.id}" data-name="${p.name}" data-gender="${p.gender}" data-age="${p.age}" data-phone="${p.phone}">${p.name} (${p.gender}, ${p.age}岁) - ${p.phone}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">姓名</label>
              <input type="text" name="patient_name" class="form-input" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">性别</label>
              <input type="text" name="gender" class="form-input" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">年龄</label>
              <input type="text" name="age" class="form-input" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">联系电话</label>
              <input type="text" name="phone" class="form-input" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">类型 <span class="required">*</span></label>
              <select name="type" class="form-select" required>
                <option value="初诊">初诊</option>
                <option value="复诊">复诊</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">选择医生 <span class="required">*</span></label>
              <select name="doctor_id" class="form-select" required>
                <option value="D001">李医师</option>
                <option value="D002">王医师</option>
                <option value="D003">张医师</option>
              </select>
            </div>
            <div class="form-group full">
              <label class="form-label">主诉症状</label>
              <textarea name="chief_complaint" class="form-textarea" rows="3" placeholder="请描述患者主要症状..."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('registration-modal')">取消</button>
          <button class="btn btn-primary" onclick="saveRegistration()">💾 保存</button>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>挂号单号</th>
            <th>患者姓名</th>
            <th>时间</th>
            <th>类型</th>
            <th>医生</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="registration-list">
          ${registrations.map(r => `
            <tr>
              <td>${r.id}</td>
              <td>${r.patient_name}</td>
              <td>${r.date} ${r.time}</td>
              <td><span class="status-badge ${r.type === '初诊' ? 'info' : 'warning'}">${r.type}</span></td>
              <td>${r.doctor_name}</td>
              <td><span class="status-badge ${r.status === '待就诊' ? 'warning' : r.status === '就诊中' ? 'info' : 'success'}">${r.status}</span></td>
              <td>
                ${r.status === '待就诊' ? `<button class="btn btn-sm btn-primary" onclick="startDiagnosis('${r.id}')">接诊</button>` : '<button class="btn btn-sm btn-outline" onclick="viewRegistration(\'${r.id}\')">查看</button>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 中医诊疗
function getDiagnosisHTML() {
  const pendingRegistrations = registrations.filter(r => r.status === '待就诊');
  
  return `
    ${pendingRegistrations.length === 0 ? `
      <div class="table-container">
        <div style="padding: 60px; text-align: center;">
          <div style="font-size: 72px; margin-bottom: 20px;">🩺</div>
          <div style="font-size: 18px; color: #666;">暂无待诊患者</div>
          <div style="margin-top: 20px;">
            <button class="btn btn-primary" onclick="showPage('registration')">去挂号</button>
          </div>
        </div>
      </div>
    ` : `
      <div class="table-container">
        <div class="table-header">
          <div class="table-title">📋 待诊患者列表</div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>患者姓名</th>
              <th>性别</th>
              <th>年龄</th>
              <th>主诉</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${pendingRegistrations.map(r => `
              <tr>
                <td>${r.time}</td>
                <td>${r.patient_name}</td>
                <td>${r.gender}</td>
                <td>${r.age}</td>
                <td>${r.chief_complaint || '-'}</td>
                <td><button class="btn btn-sm btn-primary" onclick="startDiagnosis('${r.id}')">接诊</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

// 处方管理
function getPrescriptionHTML() {
  return `
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">💊 处方记录</div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>处方号</th>
            <th>患者姓名</th>
            <th>日期</th>
            <th>类型</th>
            <th>金额</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${prescriptions.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.patient_name}</td>
              <td>${formatDate(p.date)}</td>
              <td>${p.type}</td>
              <td>${formatMoney(p.total_amount)}</td>
              <td><span class="status-badge ${p.status === '已缴费' ? 'success' : 'warning'}">${p.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 收费结算
function getPaymentHTML() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${payments.filter(p => p.date === new Date().toLocaleDateString('zh-CN')).length}</div>
            <div class="stat-label">今日收费</div>
          </div>
          <div class="stat-icon green">💰</div>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">💰 收费记录</div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>支付单号</th>
            <th>患者姓名</th>
            <th>日期</th>
            <th>金额</th>
            <th>支付方式</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${payments.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.patient_name}</td>
              <td>${formatDate(p.date)}</td>
              <td>${formatMoney(p.total_amount)}</td>
              <td>${p.payment_method}</td>
              <td><span class="status-badge success">${p.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 药房库存
function getInventoryHTML() {
  const lowStock = herbs.filter(h => h.stock < h.alert_threshold);
  
  return `
    ${lowStock.length > 0 ? `
      <div style="background: #fff3cd; border-left: 4px solid #f39c12; padding: 16px 24px; border-radius: 12px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 24px;">⚠️</span>
          <div>
            <div style="font-weight: 600; color: #856404;">库存预警</div>
            <div style="font-size: 14px; color: #856404;">${lowStock.length} 种药材库存不足</div>
          </div>
        </div>
      </div>
    ` : ''}
    
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">📦 药材库存</div>
        <button class="btn btn-primary" onclick="openInventoryModal()">➕ 入库登记</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>药材编号</th>
            <th>药材名称</th>
            <th>分类</th>
            <th>库存</th>
            <th>单价</th>
            <th>预警值</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${herbs.map(h => `
            <tr>
              <td>${h.id}</td>
              <td>${h.name}</td>
              <td>${h.category}</td>
              <td style="${h.stock < h.alert_threshold ? 'color: #e74c3c; font-weight: 600;' : ''}">${h.stock}${h.unit}</td>
              <td>¥${h.price.toFixed(2)}/${h.unit}</td>
              <td>${h.alert_threshold}${h.unit}</td>
              <td>${h.stock < h.alert_threshold ? '<span class="status-badge danger">库存不足</span>' : '<span class="status-badge success">充足</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 统计报表
function getStatisticsHTML() {
  const today = new Date().toLocaleDateString('zh-CN');
  const todayRevenue = payments.filter(p => p.date === today).reduce((sum, p) => sum + p.total_amount, 0);
  const todayPatients = registrations.filter(r => r.date === today).length;
  
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${formatMoney(todayRevenue)}</div>
            <div class="stat-label">今日营收</div>
          </div>
          <div class="stat-icon green">💰</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${todayPatients}</div>
            <div class="stat-label">今日门诊量</div>
          </div>
          <div class="stat-icon blue">👥</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${prescriptions.filter(p => p.date === today).length}</div>
            <div class="stat-label">今日处方量</div>
          </div>
          <div class="stat-icon orange">💊</div>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">📊 经营数据</div>
      </div>
      <div style="padding: 60px; text-align: center;">
        <div style="font-size: 72px; margin-bottom: 20px;">📈</div>
        <div style="font-size: 18px; color: #666;">统计功能开发中</div>
      </div>
    </div>
  `;
}

// 初始化页面事件
function initPageEvents(page) {
  // 搜索功能
  const searchInput = document.querySelector('.search-input, #search-patient, #search-registration');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function() {
      const keyword = this.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterData(page, keyword);
      }, 300);
    });
  }
}

// ==================== 患者管理功能 ====================

function openPatientModal() {
  openModal('patient-modal');
}

function savePatient() {
  const form = document.getElementById('patient-form');
  const formData = new FormData(form);
  
  const newPatient = {
    id: generateId('P'),
    name: formData.get('name'),
    gender: formData.get('gender'),
    age: parseInt(formData.get('age')),
    phone: formData.get('phone'),
    constitution: formData.get('constitution'),
    allergies: formData.get('allergies') || '无',
    medical_history: formData.get('medical_history') || '无',
    register_date: new Date().toLocaleDateString('zh-CN'),
    visit_count: 0
  };
  
  patients.unshift(newPatient);
  saveToStorage();
  closeModal('patient-modal');
  showToast('患者档案创建成功', 'success');
  
  // 刷新列表
  showPage('patients');
}

function openRegistrationModal() {
  openModal('registration-modal');
}

function fillPatientInfo(select) {
  const option = select.options[select.selectedIndex];
  if (!option.value) return;
  
  const form = document.getElementById('registration-form');
  form.patient_name.value = option.dataset.name || '';
  form.gender.value = option.dataset.gender || '';
  form.age.value = option.dataset.age || '';
  form.phone.value = option.dataset.phone || '';
}

function saveRegistration() {
  const form = document.getElementById('registration-form');
  const formData = new FormData(form);
  
  const doctorSelect = form.querySelector('select[name="doctor_id"]');
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
  
  const newRegistration = {
    id: generateId('R'),
    patient_id: formData.get('patient_id'),
    patient_name: formData.get('patient_name'),
    gender: formData.get('gender'),
    age: parseInt(formData.get('age')),
    phone: formData.get('phone'),
    date: new Date().toLocaleDateString('zh-CN'),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    type: formData.get('type'),
    doctor_id: formData.get('doctor_id'),
    doctor_name: doctorName,
    chief_complaint: formData.get('chief_complaint') || '',
    status: '待就诊'
  };
  
  registrations.unshift(newRegistration);
  saveToStorage();
  closeModal('registration-modal');
  showToast('挂号成功', 'success');
  
  // 刷新列表
  showPage('registration');
}

// 过滤数据
function filterData(page, keyword) {
  if (!keyword) {
    showPage(page);
    return;
  }
  
  let data = [];
  let listId = '';
  
  switch(page) {
    case 'patients':
      data = patients;
      listId = 'patient-list';
      break;
    case 'registration':
      data = registrations;
      listId = 'registration-list';
      break;
  }
  
  const filtered = data.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(keyword.toLowerCase())
    );
  });
  
  const tbody = document.getElementById(listId);
  if (tbody && page === 'patients') {
    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.gender}</td>
        <td>${p.age}</td>
        <td>${p.phone}</td>
        <td><span class="status-badge info">${p.constitution}</span></td>
        <td>${p.visit_count}</td>
        <td>${formatDate(p.register_date)}</td>
        <td><button class="btn btn-sm btn-primary" onclick="viewPatient('${p.id}')">查看</button></td>
      </tr>
    `).join('');
  }
}

// 接诊
function startDiagnosis(registrationId) {
  const r = registrations.find(reg => reg.id === registrationId);
  if (r) {
    r.status = '就诊中';
    saveToStorage();
    showPage('diagnosis');
    showToast(`开始接诊：${r.patient_name}`, 'info');
  }
}

// 查看患者
function viewPatient(patientId) {
  const p = patients.find(patient => patient.id === patientId);
  if (!p) return;
  
  const patientCases = cases.filter(c => c.patient_id === patientId);
  
  document.getElementById('patient-detail-content').innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">姓名</div>
        <div style="font-size: 16px; font-weight: 600;">${p.name}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">性别</div>
        <div style="font-size: 16px; font-weight: 600;">${p.gender}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">年龄</div>
        <div style="font-size: 16px; font-weight: 600;">${p.age}岁</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">联系电话</div>
        <div style="font-size: 16px; font-weight: 600;">${p.phone}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">体质</div>
        <div style="font-size: 16px; font-weight: 600;">${p.constitution}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">就诊次数</div>
        <div style="font-size: 16px; font-weight: 600;">${p.visit_count}次</div>
      </div>
    </div>
    
    <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
      <div style="font-size: 13px; color: #666; margin-bottom: 8px;">过敏史</div>
      <div style="font-size: 16px; font-weight: 600;">${p.allergies}</div>
    </div>
    
    <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
      <div style="font-size: 13px; color: #666; margin-bottom: 8px;">既往病史</div>
      <div style="font-size: 16px; font-weight: 600;">${p.medical_history}</div>
    </div>
    
    ${patientCases.length > 0 ? `
      <div>
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">📋 就诊记录（${patientCases.length}次）</div>
        ${patientCases.map(c => `
          <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <div style="font-weight: 600;">${c.date}</div>
              <div style="color: #666;">${c.diagnosis}</div>
            </div>
            <div style="font-size: 14px; color: #666;">${c.syndrome}</div>
          </div>
        `).join('')}
      </div>
    ` : '<div style="text-align: center; padding: 40px; color: #666;">暂无就诊记录</div>'}
  `;
  
  document.getElementById('patient-detail-modal').classList.add('active');
}

// 通用弹窗函数
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);
