/**
 * 中医诊所管理系统 - 数据管理
 * 版本：1.0.0
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

// 初始化数据
function initializeData() {
  console.log('🔄 初始化数据...');
  
  // 初始化用户
  users = [
    { id: 'U001', username: 'admin', password: '123456', name: '管理员', role: '管理员', status: '正常' },
    { id: 'D001', username: 'doctor_li', password: '123456', name: '李医师', role: '医生', status: '正常' },
    { id: 'C001', username: 'cashier_wang', password: '123456', name: '王收费', role: '收费员', status: '正常' },
    { id: 'P001', username: 'pharmacist_zhang', password: '123456', name: '张药师', role: '药师', status: '正常' }
  ];
  
  // 初始化 20 个患者
  const patientNames = [
    '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
    '郑一', '王二', '冯三', '陈四', '褚五', '卫六', '蒋七', '沈八',
    '韩九', '杨十', '朱一', '秦二'
  ];
  
  for (let i = 0; i < 20; i++) {
    patients.push({
      id: generateId('P'),
      name: patientNames[i],
      gender: i % 2 === 0 ? '男' : '女',
      age: 25 + Math.floor(Math.random() * 40),
      phone: `13${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      constitution: ['气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质'][i % 5],
      allergies: ['无', '青霉素', '磺胺类', '阿司匹林'][i % 4],
      medical_history: ['无', '高血压', '糖尿病', '冠心病'][i % 4],
      register_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
      visit_count: Math.floor(Math.random() * 10) + 1
    });
  }
  
  // 初始化 15 个经典方剂
  formulas = [
    { id: 'F001', name: '桂枝汤', source: '《伤寒论》', effects: '解肌发表，调和营卫', indications: '外感风寒表虚证', composition: [{name:'桂枝',dosage:'9g'},{name:'白芍',dosage:'9g'},{name:'生姜',dosage:'9g'},{name:'大枣',dosage:'3 枚'},{name:'甘草',dosage:'6g'}], usage: '水煎服' },
    { id: 'F002', name: '麻黄汤', source: '《伤寒论》', effects: '发汗解表，宣肺平喘', indications: '外感风寒表实证', composition: [{name:'麻黄',dosage:'9g'},{name:'桂枝',dosage:'6g'},{name:'杏仁',dosage:'9g'},{name:'甘草',dosage:'3g'}], usage: '水煎服' },
    { id: 'F003', name: '小柴胡汤', source: '《伤寒论》', effects: '和解少阳', indications: '伤寒少阳证', composition: [{name:'柴胡',dosage:'12g'},{name:'黄芩',dosage:'9g'},{name:'人参',dosage:'6g'},{name:'半夏',dosage:'9g'},{name:'甘草',dosage:'6g'},{name:'生姜',dosage:'9g'},{name:'大枣',dosage:'4 枚'}], usage: '水煎服' },
    { id: 'F004', name: '六味地黄丸', source: '《小儿药证直诀》', effects: '滋阴补肾', indications: '肾阴虚证', composition: [{name:'熟地黄',dosage:'24g'},{name:'山茱萸',dosage:'12g'},{name:'山药',dosage:'12g'},{name:'泽泻',dosage:'9g'},{name:'牡丹皮',dosage:'9g'},{name:'茯苓',dosage:'9g'}], usage: '水煎服' },
    { id: 'F005', name: '补中益气汤', source: '《脾胃论》', effects: '补中益气，升阳举陷', indications: '脾胃气虚证', composition: [{name:'黄芪',dosage:'15g'},{name:'人参',dosage:'9g'},{name:'白术',dosage:'9g'},{name:'当归',dosage:'9g'},{name:'陈皮',dosage:'6g'},{name:'升麻',dosage:'6g'},{name:'柴胡',dosage:'6g'},{name:'甘草',dosage:'6g'}], usage: '水煎服' },
    { id: 'F006', name: '四君子汤', source: '《太平惠民和剂局方》', effects: '益气健脾', indications: '脾胃气虚证', composition: [{name:'人参',dosage:'9g'},{name:'白术',dosage:'9g'},{name:'茯苓',dosage:'9g'},{name:'甘草',dosage:'6g'}], usage: '水煎服' },
    { id: 'F007', name: '逍遥散', source: '《太平惠民和剂局方》', effects: '疏肝解郁，养血健脾', indications: '肝郁血虚脾弱证', composition: [{name:'柴胡',dosage:'9g'},{name:'当归',dosage:'9g'},{name:'白芍',dosage:'9g'},{name:'白术',dosage:'9g'},{name:'茯苓',dosage:'9g'},{name:'甘草',dosage:'6g'}], usage: '水煎服' },
    { id: 'F008', name: '归脾汤', source: '《济生方》', effects: '益气补血，健脾养心', indications: '心脾气血两虚证', composition: [{name:'白术',dosage:'9g'},{name:'茯苓',dosage:'10g'},{name:'黄芪',dosage:'12g'},{name:'龙眼肉',dosage:'10g'},{name:'酸枣仁',dosage:'10g'},{name:'人参',dosage:'6g'},{name:'木香',dosage:'5g'},{name:'甘草',dosage:'3g'}], usage: '水煎服' },
    { id: 'F009', name: '温胆汤', source: '《三因极一病证方论》', effects: '理气化痰，清胆和胃', indications: '胆胃不和，痰热内扰证', composition: [{name:'半夏',dosage:'9g'},{name:'竹茹',dosage:'9g'},{name:'枳实',dosage:'9g'},{name:'陈皮',dosage:'9g'},{name:'甘草',dosage:'6g'},{name:'茯苓',dosage:'5g'}], usage: '水煎服' },
    { id: 'F010', name: '血府逐瘀汤', source: '《医林改错》', effects: '活血化瘀，行气止痛', indications: '胸中血瘀证', composition: [{name:'桃仁',dosage:'12g'},{name:'红花',dosage:'9g'},{name:'当归',dosage:'9g'},{name:'生地黄',dosage:'9g'},{name:'川芎',dosage:'5g'},{name:'赤芍',dosage:'6g'},{name:'牛膝',dosage:'9g'},{name:'桔梗',dosage:'5g'},{name:'柴胡',dosage:'3g'},{name:'枳壳',dosage:'6g'},{name:'甘草',dosage:'3g'}], usage: '水煎服' },
    { id: 'F011', name: '参苓白术散', source: '《太平惠民和剂局方》', effects: '益气健脾，渗湿止泻', indications: '脾虚湿盛证', composition: [{name:'人参',dosage:'10g'},{name:'茯苓',dosage:'10g'},{name:'白术',dosage:'10g'},{name:'山药',dosage:'10g'},{name:'白扁豆',dosage:'8g'},{name:'莲子',dosage:'5g'},{name:'薏苡仁',dosage:'5g'},{name:'砂仁',dosage:'5g'},{name:'桔梗',dosage:'5g'},{name:'甘草',dosage:'10g'}], usage: '水煎服' },
    { id: 'F012', name: '二陈汤', source: '《太平惠民和剂局方》', effects: '燥湿化痰，理气和中', indications: '湿痰证', composition: [{name:'半夏',dosage:'15g'},{name:'橘红',dosage:'15g'},{name:'茯苓',dosage:'9g'},{name:'甘草',dosage:'5g'}], usage: '水煎服' },
    { id: 'F013', name: '平胃散', source: '《太平惠民和剂局方》', effects: '燥湿运脾，行气和胃', indications: '湿滞脾胃证', composition: [{name:'苍术',dosage:'12g'},{name:'厚朴',dosage:'9g'},{name:'陈皮',dosage:'9g'},{name:'甘草',dosage:'4g'}], usage: '水煎服' },
    { id: 'F014', name: '藿香正气散', source: '《太平惠民和剂局方》', effects: '解表化湿，理气和中', indications: '外感风寒，内伤湿滞证', composition: [{name:'藿香',dosage:'9g'},{name:'紫苏',dosage:'6g'},{name:'白芷',dosage:'3g'},{name:'大腹皮',dosage:'3g'},{name:'茯苓',dosage:'3g'},{name:'白术',dosage:'6g'},{name:'半夏曲',dosage:'6g'},{name:'陈皮',dosage:'6g'},{name:'厚朴',dosage:'6g'},{name:'桔梗',dosage:'6g'},{name:'甘草',dosage:'8g'}], usage: '水煎服' },
    { id: 'F015', name: '龙胆泻肝汤', source: '《医方集解》', effects: '清泻肝胆实火，清利肝经湿热', indications: '肝胆实火上炎证', composition: [{name:'龙胆草',dosage:'6g'},{name:'黄芩',dosage:'9g'},{name:'栀子',dosage:'9g'},{name:'泽泻',dosage:'12g'},{name:'木通',dosage:'6g'},{name:'车前子',dosage:'9g'},{name:'当归',dosage:'3g'},{name:'生地黄',dosage:'9g'},{name:'柴胡',dosage:'6g'},{name:'生甘草',dosage:'6g'}], usage: '水煎服' }
  ];
  
  // 初始化 50 种常用药材
  herbs = [
    { id: 'H001', name: '人参', category: '补虚药', nature: '甘、微苦，微温', meridian: '脾、肺、心经', effects: '大补元气，复脉固脱，补脾益肺，生津养血，安神益智', price: 15.00, stock: 500, unit: 'g' },
    { id: 'H002', name: '黄芪', category: '补虚药', nature: '甘，微温', meridian: '脾、肺经', effects: '补气升阳，固表止汗，利水消肿，生津养血', price: 8.00, stock: 800, unit: 'g' },
    { id: 'H003', name: '当归', category: '补虚药', nature: '甘、辛，温', meridian: '肝、心、脾经', effects: '补血活血，调经止痛，润肠通便', price: 12.00, stock: 600, unit: 'g' },
    { id: 'H004', name: '白术', category: '补虚药', nature: '苦、甘，温', meridian: '脾、胃经', effects: '健脾益气，燥湿利水，止汗，安胎', price: 6.00, stock: 700, unit: 'g' },
    { id: 'H005', name: '茯苓', category: '利水渗湿药', nature: '甘、淡，平', meridian: '心、肺、脾、肾经', effects: '利水渗湿，健脾，宁心', price: 5.00, stock: 900, unit: 'g' },
    { id: 'H006', name: '甘草', category: '补虚药', nature: '甘，平', meridian: '心、肺、脾、胃经', effects: '补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药', price: 3.00, stock: 1000, unit: 'g' },
    { id: 'H007', name: '白芍', category: '补虚药', nature: '苦、酸，微寒', meridian: '肝、脾经', effects: '养血调经，敛阴止汗，柔肝止痛，平抑肝阳', price: 7.00, stock: 550, unit: 'g' },
    { id: 'H008', name: '川芎', category: '活血化瘀药', nature: '辛，温', meridian: '肝、胆、心包经', effects: '活血行气，祛风止痛', price: 9.00, stock: 450, unit: 'g' },
    { id: 'H009', name: '熟地黄', category: '补虚药', nature: '甘，微温', meridian: '肝、肾经', effects: '补血滋阴，益精填髓', price: 10.00, stock: 650, unit: 'g' },
    { id: 'H010', name: '柴胡', category: '解表药', nature: '苦、辛，微寒', meridian: '肝、胆、肺经', effects: '疏散退热，疏肝解郁，升举阳气', price: 8.00, stock: 500, unit: 'g' },
    { id: 'H011', name: '黄芩', category: '清热药', nature: '苦，寒', meridian: '肺、胆、脾、胃、大肠经', effects: '清热燥湿，泻火解毒，止血，安胎', price: 6.00, stock: 600, unit: 'g' },
    { id: 'H012', name: '黄连', category: '清热药', nature: '苦，寒', meridian: '心、脾、胃、肝、胆、大肠经', effects: '清热燥湿，泻火解毒', price: 11.00, stock: 400, unit: 'g' },
    { id: 'H013', name: '陈皮', category: '理气药', nature: '苦、辛，温', meridian: '肺、脾经', effects: '理气健脾，燥湿化痰', price: 4.00, stock: 750, unit: 'g' },
    { id: 'H014', name: '半夏', category: '化痰止咳平喘药', nature: '辛，温；有毒', meridian: '脾、胃、肺经', effects: '燥湿化痰，降逆止呕，消痞散结', price: 7.00, stock: 500, unit: 'g' },
    { id: 'H015', name: '生姜', category: '解表药', nature: '辛，微温', meridian: '肺、脾、胃经', effects: '解表散寒，温中止呕，化痰止咳', price: 2.00, stock: 300, unit: 'g' },
    { id: 'H016', name: '大枣', category: '补虚药', nature: '甘，温', meridian: '脾、胃、心经', effects: '补中益气，养血安神', price: 3.00, stock: 800, unit: 'g' },
    { id: 'H017', name: '桂枝', category: '解表药', nature: '辛、甘，温', meridian: '心、肺、膀胱经', effects: '发汗解肌，温通经脉，助阳化气', price: 5.00, stock: 550, unit: 'g' },
    { id: 'H018', name: '麻黄', category: '解表药', nature: '辛、微苦，温', meridian: '肺、膀胱经', effects: '发汗散寒，宣肺平喘，利水消肿', price: 6.00, stock: 400, unit: 'g' },
    { id: 'H019', name: '杏仁', category: '化痰止咳平喘药', nature: '苦，微温；有小毒', meridian: '肺、大肠经', effects: '降气止咳平喘，润肠通便', price: 5.00, stock: 600, unit: 'g' },
    { id: 'H020', name: '泽泻', category: '利水渗湿药', nature: '甘、淡，寒', meridian: '肾、膀胱经', effects: '利水渗湿，泄热，化浊降脂', price: 4.00, stock: 700, unit: 'g' },
    { id: 'H021', name: '牡丹皮', category: '清热药', nature: '苦、辛，微寒', meridian: '心、肝、肾经', effects: '清热凉血，活血化瘀', price: 6.00, stock: 500, unit: 'g' },
    { id: 'H022', name: '山茱萸', category: '收涩药', nature: '酸、涩，微温', meridian: '肝、肾经', effects: '补益肝肾，收涩固脱', price: 8.00, stock: 450, unit: 'g' },
    { id: 'H023', name: '山药', category: '补虚药', nature: '甘，平', meridian: '脾、肺、肾经', effects: '补脾养胃，生津益肺，补肾涩精', price: 4.00, stock: 850, unit: 'g' },
    { id: 'H024', name: '枸杞子', category: '补虚药', nature: '甘，平', meridian: '肝、肾经', effects: '滋补肝肾，益精明目', price: 9.00, stock: 600, unit: 'g' },
    { id: 'H025', name: '菊花', category: '解表药', nature: '辛、甘、苦，微寒', meridian: '肺、肝经', effects: '疏散风热，平抑肝阳，清肝明目', price: 5.00, stock: 500, unit: 'g' },
    { id: 'H026', name: '金银花', category: '清热药', nature: '甘，寒', meridian: '肺、心、胃经', effects: '清热解毒，疏散风热', price: 7.00, stock: 650, unit: 'g' },
    { id: 'H027', name: '连翘', category: '清热药', nature: '苦，微寒', meridian: '肺、心、小肠经', effects: '清热解毒，消肿散结，疏散风热', price: 6.00, stock: 550, unit: 'g' },
    { id: 'H028', name: '板蓝根', category: '清热药', nature: '苦，寒', meridian: '心、胃经', effects: '清热解毒，凉血利咽', price: 4.00, stock: 700, unit: 'g' },
    { id: 'H029', name: '蒲公英', category: '清热药', nature: '苦、甘，寒', meridian: '肝、胃经', effects: '清热解毒，消肿散结，利尿通淋', price: 3.00, stock: 600, unit: 'g' },
    { id: 'H030', name: '薄荷', category: '解表药', nature: '辛，凉', meridian: '肺、肝经', effects: '疏散风热，清利头目，利咽，透疹', price: 4.00, stock: 400, unit: 'g' },
    { id: 'H031', name: '杜仲', category: '补虚药', nature: '甘，温', meridian: '肝、肾经', effects: '补肝肾，强筋骨，安胎', price: 8.00, stock: 500, unit: 'g' },
    { id: 'H032', name: '牛膝', category: '活血化瘀药', nature: '苦、甘、酸，平', meridian: '肝、肾经', effects: '逐瘀通经，补肝肾，强筋骨', price: 6.00, stock: 550, unit: 'g' },
    { id: 'H033', name: '桃仁', category: '活血化瘀药', nature: '苦、甘，平', meridian: '心、肝、大肠经', effects: '活血祛瘀，润肠通便', price: 7.00, stock: 450, unit: 'g' },
    { id: 'H034', name: '红花', category: '活血化瘀药', nature: '辛，温', meridian: '心、肝经', effects: '活血通经，散瘀止痛', price: 8.00, stock: 400, unit: 'g' },
    { id: 'H035', name: '丹参', category: '活血化瘀药', nature: '苦，微寒', meridian: '心、肝经', effects: '活血祛瘀，通经止痛，清心除烦', price: 6.00, stock: 650, unit: 'g' },
    { id: 'H036', name: '党参', category: '补虚药', nature: '甘，平', meridian: '脾、肺经', effects: '补中益气，健脾益肺', price: 10.00, stock: 500, unit: 'g' },
    { id: 'H037', name: '麦冬', category: '补虚药', nature: '甘、微苦，微寒', meridian: '心、肺、胃经', effects: '养阴生津，润肺清心', price: 8.00, stock: 550, unit: 'g' },
    { id: 'H038', name: '五味子', category: '收涩药', nature: '酸、甘，温', meridian: '肺、心、肾经', effects: '收敛固涩，益气生津，补肾宁心', price: 12.00, stock: 400, unit: 'g' },
    { id: 'H039', name: '酸枣仁', category: '安神药', nature: '甘、酸，平', meridian: '肝、胆、心经', effects: '养心补肝，宁心安神，敛汗生津', price: 15.00, stock: 350, unit: 'g' },
    { id: 'H040', name: '远志', category: '安神药', nature: '苦、辛，温', meridian: '心、肾、肺经', effects: '安神益智，交通心肾，祛痰，消肿', price: 10.00, stock: 400, unit: 'g' },
    { id: 'H041', name: '天麻', category: '平肝息风药', nature: '甘，平', meridian: '肝经', effects: '息风止痉，平抑肝阳，祛风通络', price: 20.00, stock: 300, unit: 'g' },
    { id: 'H042', name: '钩藤', category: '平肝息风药', nature: '甘，凉', meridian: '肝、心包经', effects: '息风定惊，清热平肝', price: 8.00, stock: 450, unit: 'g' },
    { id: 'H043', name: '石决明', category: '平肝息风药', nature: '咸，寒', meridian: '肝经', effects: '平肝潜阳，清肝明目', price: 6.00, stock: 500, unit: 'g' },
    { id: 'H044', name: '龙骨', category: '安神药', nature: '甘、涩，平', meridian: '心、肝、肾经', effects: '镇惊安神，平肝潜阳，收敛固涩', price: 5.00, stock: 550, unit: 'g' },
    { id: 'H045', name: '牡蛎', category: '安神药', nature: '咸，微寒', meridian: '肝、胆、肾经', effects: '重镇安神，潜阳补阴，软坚散结', price: 5.00, stock: 550, unit: 'g' },
    { id: 'H046', name: '珍珠母', category: '安神药', nature: '咸，寒', meridian: '肝、心经', effects: '平肝潜阳，安神定惊，明目退翳', price: 4.00, stock: 600, unit: 'g' },
    { id: 'H047', name: '罗布麻叶', category: '平肝息风药', nature: '甘、苦，凉', meridian: '肝经', effects: '平肝安神，清热利水', price: 6.00, stock: 500, unit: 'g' },
    { id: 'H048', name: '蒺藜', category: '平肝息风药', nature: '辛、苦，微温', meridian: '肝经', effects: '平肝解郁，活血祛风，明目，止痒', price: 7.00, stock: 450, unit: 'g' },
    { id: 'H049', name: '羚羊角', category: '平肝息风药', nature: '咸，寒', meridian: '肝、心经', effects: '平肝息风，清肝明目，清热解毒', price: 50.00, stock: 100, unit: 'g' },
    { id: 'H050', name: '牛黄', category: '平肝息风药', nature: '甘，凉', meridian: '心、肝经', effects: '清心，豁痰，开窍，凉肝，息风，解毒', price: 100.00, stock: 50, unit: 'g' }
  ];
  
  // 保存数据
  saveToStorage();
  console.log('✅ 数据初始化完成！');
  console.log(`   - 用户：${users.length}人`);
  console.log(`   - 患者：${patients.length}人`);
  console.log(`   - 方剂：${formulas.length}个`);
  console.log(`   - 药材：${herbs.length}种`);
}

// 导出数据
function exportData() {
  const data = { patients, registrations, cases, prescriptions, herbs, formulas, payments, users };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `中医诊所数据_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('数据导出成功', 'success');
}
