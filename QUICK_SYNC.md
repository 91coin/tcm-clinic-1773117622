# ⚡ GitHub 同步快速指南

**5 分钟完成跨设备同步配置**

---

## 📋 第一步：获取 GitHub Token（2 分钟）

### 1. 访问 Token 设置页面
打开：https://github.com/settings/tokens

### 2. 创建新 Token
- 点击 **"Generate new token (classic)"**
- Note 填写：`Clinic System Sync`
- Expiration 选择：**No expiration**（或 90 天）

### 3. 勾选权限
✅ **repo**（完整仓库权限）
  - repo:status
  - repo_deployment
  - public_repo
  - repo:invite
  - security_events

### 4. 生成并复制
- 点击 **"Generate token"**
- **立即复制 Token**（以 `ghp_` 开头）
- ⚠️ Token 只显示一次，关闭页面就看不到了！

---

## 🖥️ 第二步：电脑端首次同步（1 分钟）

### 1. 打开系统
访问：https://91coin.github.io/tcm-clinic-1773117622/

### 2. 进入系统管理
点击左侧菜单 **"⚙️ 系统管理"**

### 3. 点击数据同步
点击 **"🔄 数据同步"** 按钮

### 4. 选择同步到 GitHub
输入：`3`（同步到 GitHub）

### 5. 粘贴 Token
粘贴刚才复制的 GitHub Token

### 6. 等待成功提示
看到 **"✅ 同步到 GitHub 成功"** 即可

---

## 📱 第三步：移动端下载数据（1 分钟）

### 1. 打开手机浏览器
访问：https://91coin.github.io/tcm-clinic-1773117622/

### 2. 进入系统管理
点击 **"⚙️ 系统管理"**

### 3. 点击数据同步
点击 **"🔄 数据同步"** 按钮

### 4. 选择从 GitHub 下载
输入：`4`（从 GitHub 下载）

### 5. 粘贴 Token
粘贴**相同的**GitHub Token

### 6. 等待成功提示
看到 **"✅ 从 GitHub 同步成功"** 即可

---

## ✅ 完成！现在可以：

### 电脑端录入 → 移动端查看
```
电脑接诊患者 → 同步到 GitHub → 手机下载查看
```

### 移动端录入 → 电脑端查看
```
手机外出接诊 → 同步到 GitHub → 电脑下载查看
```

---

## 🔄 日常使用

### 每次使用系统后
- 点击 **"🔄 数据同步"**
- 选择 **"3 - 同步到 GitHub"**
- 输入 Token（第一次后会自动保存）

### 切换设备时
- 点击 **"🔄 数据同步"**
- 选择 **"4 - 从 GitHub 下载"**
- 输入 Token
- 刷新页面

---

## 💡 最佳实践

### 同步频率
- **每次接诊后**：同步一次
- **每天下班前**：同步一次
- **切换设备前**：同步一次

### 数据安全
- ✅ Token 妥善保管
- ✅ 定期 JSON 备份
- ✅ 使用私密网络

### 故障处理
- **同步失败**：检查网络，重试
- **Token 失效**：重新生成 Token
- **数据冲突**：以最新同步为准

---

## 📞 需要帮助？

- **完整文档**：见 SYNC_GUIDE.md
- **GitHub Issues**：https://github.com/91coin/tcm-clinic-1773117622/issues

---

**配置完成时间：** < 5 分钟  
**同步速度：** < 10 秒/次  
**数据安全性：** ⭐⭐⭐⭐⭐
