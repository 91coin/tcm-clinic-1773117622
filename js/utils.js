/**
 * 中医诊所管理系统 - 工具函数
 * 版本：1.0.0
 */

// 显示通知
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// 格式化时间
function formatTime(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 格式化金额
function formatMoney(amount) {
  return '¥' + Number(amount).toFixed(2);
}

// 生成 ID
function generateId(prefix) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${dateStr}${random}`;
}

// 搜索高亮
function highlightText(text, keyword) {
  if (!keyword || !text) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return String(text).replace(regex, '<mark style="background: #fef3c7; color: #924004; padding: 2px 6px; border-radius: 4px; font-weight: 600;">$1</mark>');
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 确认对话框
function confirm(message, callback) {
  if (window.confirm(message)) {
    callback();
  }
}

// 本地存储操作
const Storage = {
  get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};
