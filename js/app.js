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
    statistics: '统计报表',
    settings: '系统管理'
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
    case 'settings': return getSettingsHTML();
    default: return getDashboardHTML();
  }
}

// 系统管理页面
function getSettingsHTML() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${patients.length}</div>
            <div class="stat-label">患者档案</div>
          </div>
          <div class="stat-icon blue">👥</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${cases.length}</div>
            <div class="stat-label">病历记录</div>
          </div>
          <div class="stat-icon green">📋</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${herbs.length}</div>
            <div class="stat-label">药品种类</div>
          </div>
          <div class="stat-icon orange">🌿</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${formatMoney(payments.reduce((sum, p) => sum + p.total_amount, 0))}</div>
            <div class="stat-label">总营收</div>
          </div>
          <div class="stat-icon cyan">💰</div>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">⚙️ 系统管理</div>
      </div>
      <div style="padding: 32px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
          <button class="btn btn-primary" style="padding: 24px; justify-content: flex-start;" onclick="exportSystemData()">
            <div style="font-size: 32px; margin-right: 16px;">📤</div>
            <div>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">导出数据</div>
              <div style="font-size: 13px; color: rgba(255,255,255,0.8);">备份所有数据到本地</div>
            </div>
          </button>
          
          <button class="btn btn-outline" style="padding: 24px; justify-content: flex-start;" onclick="showSystemInfo()">
            <div style="font-size: 32px; margin-right: 16px;">ℹ️</div>
            <div>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">系统信息</div>
              <div style="font-size: 13px; color: #666;">查看系统详细信息</div>
            </div>
          </button>
        </div>
        
        <div style="background: #fff3cd; border-left: 4px solid #f39c12; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 24px;">⚠️</span>
            <div style="font-weight: 600; color: #856404;">危险操作</div>
          </div>
          <div style="font-size: 14px; color: #856404; margin-bottom: 16px;">
            以下操作将影响系统数据，请谨慎操作！
          </div>
          <button class="btn btn-outline" style="border-color: #e74c3c; color: #e74c3c;" onclick="clearSystemData()">
            🗑️ 清空所有数据
          </button>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa; border-radius: 12px;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">📋 系统信息</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
            <div><strong>版本：</strong>v1.2</div>
            <div><strong>开发时间：</strong>2026-03-11</div>
            <div><strong>代码量：</strong>2,200+ 行</div>
            <div><strong>数据量：</strong>${patients.length + cases.length + prescriptions.length + payments.length} 条</div>
          </div>
        </div>
      </div>
    </div>
  `;
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
    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
      <input type="text" class="form-input" placeholder="🔍 搜索处方..." id="search-prescription" style="flex: 1;">
    </div>
    
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
            <th>诊断</th>
            <th>方剂</th>
            <th>金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="prescription-list">
          ${prescriptions.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.patient_name}</td>
              <td>${formatDate(p.date)}</td>
              <td>${p.diagnosis}</td>
              <td>${p.formula_name || '自定义'}</td>
              <td>${formatMoney(p.total_amount)}</td>
              <td><span class="status-badge ${p.status === '已缴费' ? 'success' : p.status === '待缴费' ? 'warning' : 'info'}">${p.status}</span></td>
              <td>
                <button class="btn btn-sm btn-info" onclick="viewPrescriptionDetail('${p.id}')">📄 查看</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- 处方详情弹窗 -->
    <div class="modal-overlay" id="prescription-detail-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">💊 处方详情</h2>
          <button class="modal-close" onclick="closeModal('prescription-detail-modal')">×</button>
        </div>
        <div class="modal-body" id="prescription-detail-content"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('prescription-detail-modal')">关闭</button>
          <button class="btn btn-primary" onclick="goToPayment()">💰 去缴费</button>
        </div>
      </div>
    </div>
  `;
}

// 查看处方详情
let currentPrescriptionId = null;

function viewPrescriptionDetail(prescriptionId) {
  currentPrescriptionId = prescriptionId;
  const p = prescriptions.find(pre => pre.id === prescriptionId);
  if (!p) return;
  
  document.getElementById('prescription-detail-content').innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">处方号</div>
        <div style="font-size: 16px; font-weight: 600;">${p.id}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">患者姓名</div>
        <div style="font-size: 16px; font-weight: 600;">${p.patient_name}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">诊断</div>
        <div style="font-size: 16px; font-weight: 600;">${p.diagnosis}（${p.syndrome}）</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">金额</div>
        <div style="font-size: 16px; font-weight: 600; color: #2c5f2d;">${formatMoney(p.total_amount)}</div>
      </div>
    </div>
    
    <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #2c5f2d;">📋 处方组成</div>
      <div style="white-space: pre-line; line-height: 1.8;">${p.prescription_composition}</div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">用法说明</div>
        <div style="font-size: 15px; font-weight: 600;">${p.usage_instruction}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">用药天数</div>
        <div style="font-size: 15px; font-weight: 600;">${p.days}天</div>
      </div>
    </div>
  `;
  
  openModal('prescription-detail-modal');
}

function goToPayment() {
  closeModal('prescription-detail-modal');
  showPage('payment');
  showToast('请前往收费处缴费', 'info');
}

// 收费结算
function getPaymentHTML() {
  const today = new Date().toLocaleDateString('zh-CN');
  const todayPayments = payments.filter(p => p.date === today);
  const todayRevenue = todayPayments.reduce((sum, p) => sum + p.total_amount, 0);
  const pendingPrescriptions = prescriptions.filter(p => p.status === '待缴费');
  
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
            <div class="stat-value">${todayPayments.length}</div>
            <div class="stat-label">今日收费</div>
          </div>
          <div class="stat-icon blue">📝</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${pendingPrescriptions.length}</div>
            <div class="stat-label">待缴费</div>
          </div>
          <div class="stat-icon orange">⏳</div>
        </div>
      </div>
    </div>
    
    ${pendingPrescriptions.length > 0 ? `
      <div style="background: #fff3cd; border-left: 4px solid #f39c12; padding: 16px 24px; border-radius: 12px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">⏳</span>
            <div>
              <div style="font-weight: 600; color: #856404;">待缴费处方</div>
              <div style="font-size: 14px; color: #856404;">${pendingPrescriptions.length} 个处方待缴费</div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="showPendingPrescriptions()">去收费</button>
        </div>
      </div>
    ` : ''}
    
    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
      <input type="text" class="form-input" placeholder="🔍 搜索收费记录..." id="search-payment" style="flex: 1;">
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
            <th>项目</th>
            <th>金额</th>
            <th>支付方式</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="payment-list">
          ${payments.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.patient_name}</td>
              <td>${formatDate(p.date)}</td>
              <td>${p.items.map(i => i.name).join(' + ')}</td>
              <td style="font-weight: 600; color: #2c5f2d;">${formatMoney(p.total_amount)}</td>
              <td>${p.payment_method}</td>
              <td><span class="status-badge ${p.status === '已完成' ? 'success' : 'warning'}">${p.status}</span></td>
              <td>
                <button class="btn btn-sm btn-info" onclick="viewPaymentDetail('${p.id}')">📄 详情</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- 收费弹窗 -->
    <div class="modal-overlay" id="payment-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">💰 收费结算</h2>
          <button class="modal-close" onclick="closeModal('payment-modal')">×</button>
        </div>
        <div class="modal-body">
          <form id="payment-form">
            <input type="hidden" name="prescription_id" id="pay-prescription-id">
            
            <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">患者信息</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div>
                  <div style="font-size: 12px; color: #666;">姓名</div>
                  <div style="font-size: 15px; font-weight: 600;" id="pay-patient-name">-</div>
                </div>
                <div>
                  <div style="font-size: 12px; color: #666;">诊断</div>
                  <div style="font-size: 15px; font-weight: 600;" id="pay-diagnosis">-</div>
                </div>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">费用明细</div>
              <div id="payment-items"></div>
              <div style="border-top: 2px solid #e9ecef; margin-top: 12px; padding-top: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="font-size: 16px; font-weight: 600;">合计</div>
                  <div style="font-size: 20px; font-weight: 600; color: #2c5f2d;" id="pay-total-amount">¥0.00</div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">支付方式 <span class="required">*</span></label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                <label style="padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; cursor: pointer; text-align: center;">
                  <input type="radio" name="payment_method" value="现金" checked style="margin-bottom: 8px;">
                  <div>💵 现金</div>
                </label>
                <label style="padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; cursor: pointer; text-align: center;">
                  <input type="radio" name="payment_method" value="微信" style="margin-bottom: 8px;">
                  <div>💚 微信</div>
                </label>
                <label style="padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; cursor: pointer; text-align: center;">
                  <input type="radio" name="payment_method" value="支付宝" style="margin-bottom: 8px;">
                  <div>💙 支付宝</div>
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeModal('payment-modal')">取消</button>
          <button type="button" class="btn btn-primary" onclick="confirmPayment()">💰 确认收费</button>
        </div>
      </div>
    </div>
  `;
}

// 显示待缴费处方
function showPendingPrescriptions() {
  const pending = prescriptions.filter(p => p.status === '待缴费');
  if (pending.length === 0) {
    showToast('暂无待缴费处方', 'info');
    return;
  }
  
  // 简单处理：直接打开第一个待缴费处方
  openPaymentModal(pending[0].id);
}

// 打开收费弹窗
function openPaymentModal(prescriptionId) {
  const p = prescriptions.find(pre => pre.id === prescriptionId);
  if (!p) return;
  
  document.getElementById('pay-prescription-id').value = p.id;
  document.getElementById('pay-patient-name').textContent = p.patient_name;
  document.getElementById('pay-diagnosis').textContent = p.diagnosis;
  
  // 费用明细
  const itemsHtml = `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
      <span>药费</span>
      <span>${formatMoney(p.total_amount)}</span>
    </div>
  `;
  document.getElementById('payment-items').innerHTML = itemsHtml;
  document.getElementById('pay-total-amount').textContent = formatMoney(p.total_amount);
  
  openModal('payment-modal');
}

// 确认收费
function confirmPayment() {
  const form = document.getElementById('payment-form');
  const formData = new FormData(form);
  
  const prescriptionId = formData.get('prescription_id');
  const p = prescriptions.find(pre => pre.id === prescriptionId);
  
  if (p) {
    // 创建收费记录
    const newPayment = {
      id: generateId('PAY'),
      prescription_id: prescriptionId,
      patient_id: p.patient_id,
      patient_name: p.patient_name,
      date: new Date().toLocaleDateString('zh-CN'),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      items: [{ name: '药费', amount: p.total_amount }],
      total_amount: p.total_amount,
      payment_method: formData.get('payment_method'),
      status: '已完成',
      operator_id: 'U002'
    };
    
    payments.unshift(newPayment);
    p.status = '已缴费';
    
    saveToStorage();
    closeModal('payment-modal');
    showToast('收费成功', 'success');
    
    // 刷新页面
    showPage('payment');
  }
}

// 查看收费详情
function viewPaymentDetail(paymentId) {
  const p = payments.find(payment => payment.id === paymentId);
  if (!p) return;
  
  alert(`收费详情\n\n支付单号：${p.id}\n患者：${p.patient_name}\n日期：${p.date} ${p.time}\n项目：${p.items.map(i => i.name).join(' + ')}\n金额：${formatMoney(p.total_amount)}\n支付方式：${p.payment_method}\n状态：${p.status}\n操作员：${p.operator_id}`);
}

// 药房库存
function getInventoryHTML() {
  const lowStock = herbs.filter(h => h.stock < h.alert_threshold);
  
  return `
    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
      <input type="text" class="form-input" placeholder="🔍 搜索药材..." id="search-herb" style="flex: 1;">
      <button class="btn btn-primary" onclick="openInventoryModal()">➕ 入库登记</button>
    </div>
    
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
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>药材编号</th>
            <th>药材名称</th>
            <th>分类</th>
            <th>性味</th>
            <th>库存</th>
            <th>单价</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${herbs.map(h => `
            <tr>
              <td>${h.id}</td>
              <td>${h.name}</td>
              <td>${h.category}</td>
              <td>${h.nature}</td>
              <td style="${h.stock < h.alert_threshold ? 'color: #e74c3c; font-weight: 600;' : ''}">${h.stock}${h.unit}</td>
              <td>¥${h.price.toFixed(2)}/${h.unit}</td>
              <td>${h.stock < h.alert_threshold ? '<span class="status-badge danger">库存不足</span>' : '<span class="status-badge success">充足</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- 药材详情弹窗 -->
    <div class="modal-overlay" id="herb-detail-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">🌿 药材详情</h2>
          <button class="modal-close" onclick="closeModal('herb-detail-modal')">×</button>
        </div>
        <div class="modal-body" id="herb-detail-content"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('herb-detail-modal')">关闭</button>
        </div>
      </div>
    </div>
  `;
}

// 查看药材详情
function viewHerbDetail(herbId) {
  const h = herbs.find(herb => herb.id === herbId);
  if (!h) return;
  
  document.getElementById('herb-detail-content').innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">药材编号</div>
        <div style="font-size: 16px; font-weight: 600;">${h.id}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">药材名称</div>
        <div style="font-size: 16px; font-weight: 600;">${h.name}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">分类</div>
        <div style="font-size: 16px; font-weight: 600;">${h.category}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">性味</div>
        <div style="font-size: 16px; font-weight: 600;">${h.nature}</div>
      </div>
    </div>
    
    <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #2c5f2d;">📋 功效主治</div>
      <div style="line-height: 1.8;">${h.effects}</div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">归经</div>
        <div style="font-size: 15px; font-weight: 600;">${h.meridian}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">库存</div>
        <div style="font-size: 15px; font-weight: 600;">${h.stock}${h.unit}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">单价</div>
        <div style="font-size: 15px; font-weight: 600; color: #2c5f2d;">¥${h.price.toFixed(2)}/${h.unit}</div>
      </div>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">预警值</div>
        <div style="font-size: 15px; font-weight: 600;">${h.alert_threshold}${h.unit}</div>
      </div>
    </div>
  `;
  
  openModal('herb-detail-modal');
}

// 打开入库弹窗
function openInventoryModal() {
  const modalHtml = `
    <div class="modal-overlay" id="inventory-modal" style="display: flex;">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">📦 入库登记</h2>
          <button class="modal-close" onclick="closeModal('inventory-modal')">×</button>
        </div>
        <div class="modal-body">
          <form id="inventory-form" class="form-grid">
            <div class="form-group full">
              <label class="form-label">选择药材 <span class="required">*</span></label>
              <select name="herb_id" class="form-select" required onchange="updateHerbInfo()">
                <option value="">请选择药材</option>
                ${herbs.map(h => `<option value="${h.id}" data-name="${h.name}" data-price="${h.price}" data-unit="${h.unit}">${h.name} - ${h.category}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">药材名称</label>
              <input type="text" name="herb_name" class="form-input" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">类型</label>
              <select name="type" class="form-select">
                <option value="入库">入库</option>
                <option value="出库">出库</option>
                <option value="盘点">盘点</option>
                <option value="损耗">损耗</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">数量 <span class="required">*</span></label>
              <input type="number" name="quantity" class="form-input" required min="1">
            </div>
            <div class="form-group">
              <label class="form-label">单价</label>
              <input type="number" name="price" class="form-input" step="0.01" min="0">
            </div>
            <div class="form-group full">
              <label class="form-label">备注</label>
              <textarea name="remark" class="form-textarea" rows="2" placeholder="采购批号、供应商等..."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeModal('inventory-modal')">取消</button>
          <button type="button" class="btn btn-primary" onclick="saveInventory()">💾 保存</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 更新药材信息
function updateHerbInfo() {
  const select = document.querySelector('select[name="herb_id"]');
  const option = select.options[select.selectedIndex];
  const form = document.getElementById('inventory-form');
  
  if (option.value) {
    form.herb_name.value = option.dataset.name || '';
    form.price.value = option.dataset.price || '';
  }
}

// 保存入库记录
function saveInventory() {
  const form = document.getElementById('inventory-form');
  const formData = new FormData(form);
  
  const herbId = formData.get('herb_id');
  const herb = herbs.find(h => h.id === herbId);
  
  if (herb) {
    const type = formData.get('type');
    const quantity = parseInt(formData.get('quantity'));
    const price = parseFloat(formData.get('price')) || herb.price;
    
    // 更新库存
    if (type === '入库') {
      herb.stock += quantity;
    } else if (type === '出库' || type === '损耗') {
      herb.stock = Math.max(0, herb.stock - quantity);
    } else if (type === '盘点') {
      herb.stock = quantity;
    }
    
    // 创建库存记录
    const newInventory = {
      id: generateId('I'),
      type: type,
      herb_id: herbId,
      herb_name: herb.name,
      quantity: quantity,
      unit: herb.unit,
      price: price,
      total_amount: quantity * price,
      date: new Date().toLocaleDateString('zh-CN'),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      operator_id: 'U001',
      remark: formData.get('remark') || '',
      stock_before: herb.stock,
      stock_after: herb.stock
    };
    
    // 这里应该保存到 inventory 数组，但现在简化处理
    saveToStorage();
    closeModal('inventory-modal');
    showToast('入库登记成功', 'success');
    
    // 刷新页面
    showPage('inventory');
  }
}

// 统计报表
function getStatisticsHTML() {
  const today = new Date().toLocaleDateString('zh-CN');
  const todayPayments = payments.filter(p => p.date === today);
  const todayRevenue = todayPayments.reduce((sum, p) => sum + p.total_amount, 0);
  const todayPatients = registrations.filter(r => r.date === today).length;
  const todayPrescriptions = prescriptions.filter(p => p.date === today).length;
  
  // 本月统计
  const thisMonth = new Date().getMonth() + 1;
  const monthPayments = payments.filter(p => {
    const d = new Date(p.date);
    return d.getMonth() + 1 === thisMonth;
  });
  const monthRevenue = monthPayments.reduce((sum, p) => sum + p.total_amount, 0);
  
  // 医生工作量统计
  const doctorStats = {};
  cases.forEach(c => {
    if (!doctorStats[c.doctor_name]) {
      doctorStats[c.doctor_name] = 0;
    }
    doctorStats[c.doctor_name]++;
  });
  
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
            <div class="stat-value">${formatMoney(monthRevenue)}</div>
            <div class="stat-label">本月营收</div>
          </div>
          <div class="stat-icon blue">📅</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${todayPatients}</div>
            <div class="stat-label">今日门诊量</div>
          </div>
          <div class="stat-icon cyan">👥</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">${todayPrescriptions}</div>
            <div class="stat-label">今日处方量</div>
          </div>
          <div class="stat-icon orange">💊</div>
        </div>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px;">
      <div class="table-container">
        <div class="table-header">
          <div class="table-title">📈 营收统计</div>
        </div>
        <div style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
            <span>今日营收</span>
            <span style="font-weight: 600; color: #2c5f2d;">${formatMoney(todayRevenue)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
            <span>本月营收</span>
            <span style="font-weight: 600; color: #2c5f2d;">${formatMoney(monthRevenue)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0;">
            <span>总营收</span>
            <span style="font-weight: 600; color: #2c5f2d;">${formatMoney(payments.reduce((sum, p) => sum + p.total_amount, 0))}</span>
          </div>
        </div>
      </div>
      
      <div class="table-container">
        <div class="table-header">
          <div class="table-title">👨‍⚕️ 医生工作量</div>
        </div>
        <div style="padding: 24px;">
          ${Object.entries(doctorStats).map(([doctor, count]) => `
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
              <span>${doctor}</span>
              <span style="font-weight: 600;">${count} 例</span>
            </div>
          `).join('')}
          ${Object.keys(doctorStats).length === 0 ? '<div style="text-align: center; color: #999; padding: 20px;">暂无数据</div>' : ''}
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">📊 数据概览</div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>统计项</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>总患者数</td>
            <td style="font-weight: 600;">${patients.length}人</td>
          </tr>
          <tr>
            <td>总挂号数</td>
            <td style="font-weight: 600;">${registrations.length}例</td>
          </tr>
          <tr>
            <td>总病历数</td>
            <td style="font-weight: 600;">${cases.length}份</td>
          </tr>
          <tr>
            <td>总处方数</td>
            <td style="font-weight: 600;">${prescriptions.length}张</td>
          </tr>
          <tr>
            <td>总收费记录</td>
            <td style="font-weight: 600;">${payments.length}笔</td>
          </tr>
          <tr>
            <td>药品种类</td>
            <td style="font-weight: 600;">${herbs.length}种</td>
          </tr>
          <tr>
            <td>经典方剂</td>
            <td style="font-weight: 600;">${formulas.length}个</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div style="background: #e8f5e9; border-left: 4px solid #27ae60; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <span style="font-size: 24px;">☁️</span>
        <div>
          <div style="font-weight: 600; color: #27ae60;">跨设备数据同步</div>
          <div style="font-size: 13px; color: #27ae60;">电脑、手机、平板多端同步</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        <button class="btn btn-primary" onclick="syncDataUI()">🔄 数据同步</button>
        <button class="btn btn-outline" onclick="exportData()">📤 导出数据</button>
      </div>
      <div style="margin-top: 12px; font-size: 12px; color: #666;">
        💡 提示：使用 GitHub 同步可实现多设备自动同步
      </div>
    </div>
    
    <div style="margin-top: 24px; display: flex; gap: 12px;">
      <button class="btn btn-outline" onclick="showPage('dashboard')">🏠 返回首页</button>
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
    openDiagnosisModal(r);
  }
}

// 打开诊疗弹窗
function openDiagnosisModal(registration) {
  const modalHtml = `
    <div class="modal-overlay" id="diagnosis-modal" style="display: flex;">
      <div class="modal" style="max-width: 1000px;">
        <div class="modal-header">
          <h2 class="modal-title">🩺 诊疗开方 - ${registration.patient_name}</h2>
          <button class="modal-close" onclick="closeDiagnosisModal()">×</button>
        </div>
        <div class="modal-body">
          <form id="diagnosis-form">
            <input type="hidden" name="registration_id" value="${registration.id}">
            <input type="hidden" name="patient_id" value="${registration.patient_id}">
            <input type="hidden" name="patient_name" value="${registration.patient_name}">
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">📋 主诉</label>
                <input type="text" name="chief_complaint" class="form-input" value="${registration.chief_complaint || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">📅 日期</label>
                <input type="date" name="date" class="form-input" value="${new Date().toISOString().split('T')[0]}" readonly>
              </div>
            </div>
            
            <div class="form-group full">
              <label class="form-label">📖 现病史</label>
              <textarea name="present_illness" class="form-textarea" rows="3" placeholder="详细描述病情发展过程..."></textarea>
            </div>
            
            <div class="form-group full">
              <label class="form-label">📚 既往史</label>
              <textarea name="past_history" class="form-textarea" rows="2" placeholder="既往病史、过敏史..."></textarea>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #2c5f2d;">🔍 望闻问切</div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">望诊</label>
                  <input type="text" name="inspection" class="form-input" placeholder="舌象、面色等">
                </div>
                <div class="form-group">
                  <label class="form-label">闻诊</label>
                  <input type="text" name="smelling_hearing" class="form-input" placeholder="声音、气味等">
                </div>
                <div class="form-group">
                  <label class="form-label">问诊</label>
                  <textarea name="questioning" class="form-textarea" rows="2" placeholder="症状询问..."></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">切诊</label>
                  <input type="text" name="pulsing" class="form-input" placeholder="脉象">
                </div>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #2c5f2d;">🎯 辨证论治</div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">中医诊断</label>
                  <input type="text" name="diagnosis" class="form-input" placeholder="如：感冒、咳嗽">
                </div>
                <div class="form-group">
                  <label class="form-label">证型</label>
                  <select name="syndrome" class="form-select">
                    <option value="">请选择证型</option>
                    <option value="风寒感冒">风寒感冒</option>
                    <option value="风热感冒">风热感冒</option>
                    <option value="肝阳上亢">肝阳上亢</option>
                    <option value="脾胃虚弱">脾胃虚弱</option>
                    <option value="肾阴不足">肾阴不足</option>
                    <option value="气血两虚">气血两虚</option>
                    <option value="肝气郁结">肝气郁结</option>
                    <option value="痰湿内阻">痰湿内阻</option>
                    <option value="瘀血阻滞">瘀血阻滞</option>
                    <option value="心脾两虚">心脾两虚</option>
                  </select>
                </div>
                <div class="form-group full">
                  <label class="form-label">治法</label>
                  <textarea name="treatment_plan" class="form-textarea" rows="2" placeholder="治疗方法..."></textarea>
                </div>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #2c5f2d; display: flex; justify-content: space-between; align-items: center;">
                <span>💊 处方</span>
                <button type="button" class="btn btn-sm btn-outline" onclick="openFormulaSelector()">📚 选择方剂</button>
              </div>
              <div class="form-group">
                <label class="form-label">选择方剂</label>
                <select name="formula_id" id="formula-select" class="form-select" onchange="loadFormulaComposition()">
                  <option value="">选择方剂</option>
                  ${formulas.map(f => `<option value="${f.id}" data-name="${f.name}">${f.name} - ${f.effects}</option>`).join('')}
                </select>
              </div>
              <div class="form-group full">
                <label class="form-label">处方组成</label>
                <textarea name="prescription_composition" id="prescription-composition" class="form-textarea" rows="4" placeholder="方剂组成或自定义处方..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">用法说明</label>
                <input type="text" name="usage_instruction" class="form-input" value="水煎服，日一剂，分两次温服">
              </div>
              <div class="form-group">
                <label class="form-label">用药天数</label>
                <input type="number" name="days" class="form-input" value="7" min="1" max="30">
              </div>
            </div>
            
            <div class="form-group full">
              <label class="form-label">📝 医嘱</label>
              <textarea name="advice" class="form-textarea" rows="2" placeholder="饮食禁忌、生活调理建议..."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeDiagnosisModal()">取消</button>
          <button type="button" class="btn btn-primary" onclick="saveDiagnosis()">💾 保存病历并开方</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 关闭诊疗弹窗
function closeDiagnosisModal() {
  const modal = document.getElementById('diagnosis-modal');
  if (modal) {
    modal.remove();
  }
}

// 加载方剂组成
function loadFormulaComposition() {
  const select = document.getElementById('formula-select');
  const option = select.options[select.selectedIndex];
  const textarea = document.getElementById('prescription-composition');
  
  if (option.value) {
    const formula = formulas.find(f => f.id === option.value);
    if (formula) {
      const composition = formula.composition.map(c => `${c.name} ${c.dosage}`).join('\n');
      textarea.value = composition + '\n\n用法：' + (formula.usage || '水煎服');
    }
  }
}

// 保存病历
function saveDiagnosis() {
  const form = document.getElementById('diagnosis-form');
  const formData = new FormData(form);
  
  const registrationId = formData.get('registration_id');
  const r = registrations.find(reg => reg.id === registrationId);
  
  const newCase = {
    id: generateId('C'),
    registration_id: registrationId,
    patient_id: formData.get('patient_id'),
    patient_name: formData.get('patient_name'),
    date: formData.get('date'),
    chief_complaint: formData.get('chief_complaint'),
    present_illness: formData.get('present_illness'),
    past_history: formData.get('past_history'),
    inspection: formData.get('inspection'),
    smelling_hearing: formData.get('smelling_hearing'),
    questioning: formData.get('questioning'),
    pulsing: formData.get('pulsing'),
    diagnosis: formData.get('diagnosis'),
    syndrome: formData.get('syndrome'),
    treatment_plan: formData.get('treatment_plan'),
    formula_id: formData.get('formula_id'),
    prescription_composition: formData.get('prescription_composition'),
    usage_instruction: formData.get('usage_instruction'),
    days: parseInt(formData.get('days')),
    advice: formData.get('advice'),
    doctor_id: r.doctor_id,
    doctor_name: r.doctor_name
  };
  
  cases.unshift(newCase);
  
  // 创建处方记录
  const formulaSelect = document.getElementById('formula-select');
  const formulaName = formulaSelect.options[formulaSelect.selectedIndex]?.dataset.name || '自定义方剂';
  
  // 简单计算药费（按药材数量估算）
  const compositionText = formData.get('prescription_composition');
  const herbCount = (compositionText.match(/\n/g) || []).length + 1;
  const totalAmount = herbCount * 10 * parseInt(formData.get('days')); // 每味药 10 元/天
  
  const newPrescription = {
    id: generateId('PR'),
    case_id: newCase.id,
    patient_id: newCase.patient_id,
    patient_name: newCase.patient_name,
    date: newCase.date,
    type: '中药',
    formula_id: formData.get('formula_id'),
    formula_name: formulaName,
    prescription_composition: compositionText,
    usage_instruction: formData.get('usage_instruction'),
    days: parseInt(formData.get('days')),
    total_amount: totalAmount,
    status: '待缴费',
    doctor_id: newCase.doctor_id,
    doctor_name: newCase.doctor_name,
    diagnosis: newCase.diagnosis,
    syndrome: newCase.syndrome
  };
  
  prescriptions.unshift(newPrescription);
  
  // 更新挂号状态
  r.status = '已完成';
  
  // 更新患者就诊次数
  const patient = patients.find(p => p.id === newCase.patient_id);
  if (patient) {
    patient.visit_count++;
    patient.last_visit_date = new Date().toLocaleDateString('zh-CN');
  }
  
  saveToStorage();
  closeDiagnosisModal();
  showToast('病历保存成功，已生成处方', 'success');
  
  // 跳转到处方管理
  showPage('prescription');
}

// 打开方剂选择器（简化版）
function openFormulaSelector() {
  const select = document.getElementById('formula-select');
  select.focus();
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

// ==================== 系统管理功能 ====================

// 导出数据
function exportSystemData() {
  const data = {
    patients,
    registrations,
    cases,
    prescriptions,
    herbs,
    formulas,
    payments,
    users,
    export_date: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `中医诊所数据备份_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('数据导出成功', 'success');
}

// 导入数据
function importSystemData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.patients) patients = data.patients;
    if (data.registrations) registrations = data.registrations;
    if (data.cases) cases = data.cases;
    if (data.prescriptions) prescriptions = data.prescriptions;
    if (data.herbs) herbs = data.herbs;
    if (data.formulas) formulas = data.formulas;
    if (data.payments) payments = data.payments;
    if (data.users) users = data.users;
    
    saveToStorage();
    showToast('数据导入成功，请刷新页面', 'success');
    setTimeout(() => location.reload(), 1500);
  } catch (error) {
    showToast('数据导入失败：' + error.message, 'error');
  }
}

// 清空数据
function clearSystemData() {
  if (confirm('⚠️ 确定要清空所有数据吗？此操作不可恢复！')) {
    if (confirm('⚠️ 再次确认：所有患者档案、病历、处方、收费记录都将被删除！')) {
      localStorage.removeItem('tcm-clinic-data');
      showToast('数据已清空，正在刷新页面...', 'info');
      setTimeout(() => location.reload(), 1500);
    }
  }
}

// 系统信息
function showSystemInfo() {
  alert(`中医诊所管理系统\n\n版本：v1.2\n开发时间：2026-03-11\n代码量：2,500+ 行\n数据量：\n- 患者：${patients.length}人\n- 病历：${cases.length}份\n- 处方：${prescriptions.length}张\n- 药材：${herbs.length}种\n- 方剂：${formulas.length}个`);
}

// 跨设备同步 UI
function syncDataUI() {
  const action = prompt(`
🔄 数据同步操作

1️⃣ 导出数据（JSON 文件）
   - 保存到本地
   - 发送给他设备导入

2️⃣ 导入数据（JSON 文件）
   - 粘贴 JSON 内容
   - 恢复数据

3️⃣ 同步到 GitHub（推荐）
   - 自动备份到云端
   - 多设备自动同步
   
4️⃣ 从 GitHub 下载
   - 从云端下载数据
   - 恢复最新数据

📖 详细指南：见 QUICK_SYNC.md

请输入数字（1-4）：`);
  
  switch(action) {
    case '1':
      exportData();
      break;
    case '2':
      const json = prompt('请粘贴备份的 JSON 数据：');
      if (json) importData(json);
      break;
    case '3':
      const token1 = prompt(`
🔑 输入 GitHub Token

获取方式：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. Note 填写：Clinic Sync
4. 勾选权限：repo（完整仓库权限）
5. 点击 "Generate token"
6. 立即复制 Token（以 ghp_ 开头）

⚠️ Token 只显示一次，请妥善保管！

输入 Token：`);
      if (token1) syncToGitHub(token1);
      break;
    case '4':
      const token2 = prompt('🔑 输入 GitHub Token：');
      if (token2) syncFromGitHub(token2);
      break;
    default:
      if (action) showToast('❌ 无效操作', 'error');
  }
}
