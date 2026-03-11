/**
 * 中医诊所管理系统 - 数据管理
 * 版本：1.2
 * 功能：数据存储、初始化、导入导出、GitHub 同步
 */

// 数据存储
let patients = [];
let registrations = [];
let cases = [];
let prescriptions = [];
let herbs = [];
let formulas = [];
let payments = [];
let users = [];

// 从存储加载
function loadFromStorage() {
  const saved = localStorage.getItem('tcm-clinic-data');
  if (saved) {
    const data = JSON.parse(saved);
    patients = data.patients || [];
    registrations = data.registrations || [];
    cases = data.cases || [];
    prescriptions = data.prescriptions || [];
    herbs = data.herbs || [];
    formulas = data.formulas || [];
    payments = data.payments || [];
    users = data.users || [];
  }
  
  // 如果是第一次使用，初始化数据
  if (patients.length === 0) {
    initializeData();
  }
}

// 保存到存储
function saveToStorage() {
  const data = { patients, registrations, cases, prescriptions, herbs, formulas, payments, users };
  localStorage.setItem('tcm-clinic-data', JSON.stringify(data));
}

// 生成 ID
function generateId(prefix) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${dateStr}${random}`;
}

// 导出数据
function exportData() {
  const data = {
    version: '1.2',
    export_date: new Date().toISOString(),
    patients,
    registrations,
    cases,
    prescriptions,
    herbs,
    formulas,
    payments,
    users
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `中医诊所数据_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ 数据导出成功', 'success');
}

// 导入数据
function importData(jsonString) {
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
    showToast('✅ 数据导入成功，请刷新页面', 'success');
    setTimeout(() => location.reload(), 1500);
  } catch (error) {
    showToast('❌ 数据导入失败：' + error.message, 'error');
  }
}

// 从 GitHub 同步数据
async function syncFromGitHub(token) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/91coin/tcm-clinic-1773117622/main/data.json', {
      headers: {
        'Authorization': `token ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      importData(JSON.stringify(data));
      showToast('✅ 从 GitHub 同步成功', 'success');
    } else {
      showToast('❌ 同步失败：' + response.statusText, 'error');
    }
  } catch (error) {
    showToast('❌ 同步失败：' + error.message, 'error');
  }
}

// 同步数据到 GitHub
async function syncToGitHub(token) {
  try {
    const data = {
      version: '1.2',
      sync_date: new Date().toISOString(),
      patients,
      registrations,
      cases,
      prescriptions,
      herbs,
      formulas,
      payments,
      users
    };
    
    const content = btoa(JSON.stringify(data, null, 2));
    
    // 先获取当前文件的 SHA
    const getResponse = await fetch('https://api.github.com/repos/91coin/tcm-clinic-1773117622/contents/data.json', {
      headers: {
        'Authorization': `token ${token}`
      }
    });
    
    let sha = null;
    if (getResponse.ok) {
      const getData = await getResponse.json();
      sha = getData.sha;
    }
    
    // 上传文件
    const putResponse = await fetch('https://api.github.com/repos/91coin/tcm-clinic-1773117622/contents/data.json', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`
      },
      body: JSON.stringify({
        message: 'Sync data from clinic system',
        content: content,
        ...(sha ? { sha } : {})
      })
    });
    
    if (putResponse.ok) {
      showToast('✅ 同步到 GitHub 成功', 'success');
    } else {
      showToast('❌ 同步失败：' + putResponse.statusText, 'error');
    }
  } catch (error) {
    showToast('❌ 同步失败：' + error.message, 'error');
  }
}

// 初始化数据
function initializeData() {
  console.log('🔄 初始化数据...');
  
  // 初始化用户（7 人）
  users = [
    { id: 'U001', username: 'admin', password: '123456', name: '管理员', role: '管理员', status: '正常' },
    { id: 'D001', username: 'doctor_li', password: '123456', name: '李医师', role: '医生', status: '正常' },
    { id: 'D002', username: 'doctor_wang', password: '123456', name: '王医师', role: '医生', status: '正常' },
    { id: 'D003', username: 'doctor_zhang', password: '123456', name: '张医师', role: '医生', status: '正常' },
    { id: 'C001', username: 'cashier_wang', password: '123456', name: '王收费', role: '收费员', status: '正常' },
    { id: 'C002', username: 'cashier_li', password: '123456', name: '李收费', role: '收费员', status: '正常' },
    { id: 'P001', username: 'pharmacist_zhang', password: '123456', name: '张药师', role: '药师', status: '正常' }
  ];
  
  // 初始化患者（30 人）
  const patientNames = [
    '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
    '郑一', '王二', '冯三', '陈四', '褚五', '卫六', '蒋七', '沈八',
    '韩九', '杨十', '朱一', '秦二', '尤六', '许七', '何八', '吕九',
    '施十', '张明', '李娜', '王芳', '刘强', '陈杰'
  ];
  
  for (let i = 0; i < 30; i++) {
    patients.push({
      id: generateId('P'),
      name: patientNames[i],
      gender: i % 2 === 0 ? '男' : '女',
      age: 25 + Math.floor(Math.random() * 40),
      phone: `13${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      constitution: ['平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质'][i % 9],
      allergies: ['无', '青霉素', '磺胺类', '阿司匹林', '头孢'][i % 5],
      medical_history: ['无', '高血压', '糖尿病', '冠心病', '慢性胃炎'][i % 5],
      register_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
      visit_count: Math.floor(Math.random() * 10) + 1,
      last_visit_date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')
    });
  }
  
  // 初始化挂号记录（20 条）
  for (let i = 0; i < 20; i++) {
    const patient = patients[i % patients.length];
    registrations.push({
      id: generateId('R'),
      patient_id: patient.id,
      patient_name: patient.name,
      gender: patient.gender,
      age: patient.age,
      phone: patient.phone,
      date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
      time: `${String(8 + Math.floor(Math.random() * 9)).padStart(2, '0')}:${['00', '30'][Math.floor(Math.random() * 2)]}`,
      type: ['初诊', '复诊'][Math.floor(Math.random() * 2)],
      doctor_id: ['D001', 'D002', 'D003'][Math.floor(Math.random() * 3)],
      doctor_name: ['李医师', '王医师', '张医师'][Math.floor(Math.random() * 3)],
      chief_complaint: ['感冒发热', '咳嗽', '胃痛', '失眠', '头痛', '腰膝酸软'][Math.floor(Math.random() * 6)],
      status: ['已完成', '就诊中', '待就诊'][i % 3]
    });
  }
  
  // 初始化病历记录（15 份）
  const diagnoses = ['感冒', '咳嗽', '胃痛', '失眠', '头痛', '月经不调', '腰痛', '乏力'];
  const syndromes = ['风寒感冒', '风热感冒', '肝阳上亢', '脾胃虚弱', '肾阴不足', '气血两虚', '肝气郁结', '痰湿内阻'];
  
  for (let i = 0; i < 15; i++) {
    const patient = patients[i % patients.length];
    cases.push({
      id: generateId('C'),
      registration_id: registrations[i]?.id || '',
      patient_id: patient.id,
      patient_name: patient.name,
      date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
      chief_complaint: ['发热 3 天', '咳嗽 1 周', '胃痛半月', '失眠 2 月'][i % 4],
      present_illness: '患者自述' + ['近期劳累', '饮食不节', '情志不畅', '外感风寒'][i % 4],
      past_history: patient.medical_history,
      inspection: ['舌淡红，苔薄白', '舌红，苔黄', '舌淡，苔白腻'][i % 3],
      smelling_hearing: '语声正常，无异常气味',
      questioning: '发热，恶寒，无汗，头痛',
      pulsing: ['脉浮紧', '脉浮数', '脉滑'][i % 3],
      diagnosis: diagnoses[i % diagnoses.length],
      syndrome: syndromes[i % syndromes.length],
      treatment_plan: ['辛温解表', '疏风清热', '健脾和胃'][i % 3],
      formula_id: formulas[i % formulas.length]?.id || '',
      prescription_composition: formulas[i % formulas.length]?.composition.map(c => `${c.name} ${c.dosage}`).join('\n') || '麻黄 9g\n桂枝 6g\n杏仁 9g\n甘草 3g',
      usage_instruction: '水煎服，日一剂，分两次温服',
      days: 7,
      advice: '避风寒，清淡饮食',
      doctor_id: ['D001', 'D002', 'D003'][i % 3],
      doctor_name: ['李医师', '王医师', '张医师'][i % 3]
    });
  }
  
  // 初始化处方记录（15 张）
  for (let i = 0; i < 15; i++) {
    const caseItem = cases[i];
    const formula = formulas[i % formulas.length];
    const herbCount = 5 + Math.floor(Math.random() * 10);
    const days = 7 + Math.floor(Math.random() * 7);
    const totalAmount = herbCount * 10 * days;
    
    prescriptions.push({
      id: generateId('PR'),
      case_id: caseItem.id,
      patient_id: caseItem.patient_id,
      patient_name: caseItem.patient_name,
      date: caseItem.date,
      type: '中药',
      formula_id: formula.id,
      formula_name: formula.name,
      prescription_composition: formula.composition.map(c => `${c.name} ${c.dosage}`).join('\n'),
      usage_instruction: '水煎服，日一剂，分两次温服',
      days: days,
      total_amount: totalAmount,
      status: ['已缴费', '待缴费'][i % 2],
      doctor_id: caseItem.doctor_id,
      doctor_name: caseItem.doctor_name,
      diagnosis: caseItem.diagnosis,
      syndrome: caseItem.syndrome
    });
  }
  
  // 初始化收费记录（10 笔）
  for (let i = 0; i < 10; i++) {
    const prescription = prescriptions[i];
    payments.push({
      id: generateId('PAY'),
      prescription_id: prescription.id,
      patient_id: prescription.patient_id,
      patient_name: prescription.patient_name,
      date: prescription.date,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      items: [{ name: '药费', amount: prescription.total_amount }],
      total_amount: prescription.total_amount,
      payment_method: ['现金', '微信', '支付宝'][i % 3],
      status: '已完成',
      operator_id: ['C001', 'C002'][i % 2]
    });
  }
  
  // 保存数据
  saveToStorage();
  console.log('✅ 数据初始化完成！');
  console.log(`   - 用户：${users.length}人`);
  console.log(`   - 患者：${patients.length}人`);
  console.log(`   - 挂号记录：${registrations.length}条`);
  console.log(`   - 病历记录：${cases.length}份`);
  console.log(`   - 处方记录：${prescriptions.length}张`);
  console.log(`   - 收费记录：${payments.length}笔`);
  console.log(`   - 方剂：${formulas.length}个`);
  console.log(`   - 药材：${herbs.length}种`);
  console.log(`   总计：${users.length + patients.length + registrations.length + cases.length + prescriptions.length + payments.length + formulas.length + herbs.length} 条数据`);
}
