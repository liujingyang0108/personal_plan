Page({
  data: {
    date: '',
    intentions: [],
    locked: false,
    loading: true,
    showSummary: false,
    stats: { completed: 0, total: 0, distractionMinutes: 0, completionRate: 0 }
  },

  onLoad() {
    this.setData({ date: this.formatDate(new Date()) });
    this.loadIntentions();
  },

  onShow() {
    this.loadIntentions();
  },

  formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 ${weekday}`;
  },

  loadIntentions() {
    this.setData({ loading: true });
    const app = getApp();
    const today = new Date().toISOString().split('T')[0];
    const allIntentions = app.globalData.localData?.intentions || [];
    const todayIntentions = allIntentions.filter(i => i.date === today);
    this.setData({ intentions: todayIntentions, locked: false, loading: false });
    this.calculateStats();
  },

  addIntention() {
    if (this.data.locked) {
      wx.showToast({ title: '已锁定，不可添加', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/today/intention-form/intention-form' });
  },

  toggleComplete(e) {
    const { id } = e.currentTarget.dataset;
    const { intentions } = this.data;
    const intention = intentions.find(i => i._id === id);
    if (!intention) return;

    intention.is_completed = !intention.is_completed;
    this.setData({ intentions });
    this.calculateStats();
    this.saveToLocal();
  },

  saveToLocal() {
    const app = getApp();
    const today = new Date().toISOString().split('T')[0];
    const allIntentions = app.globalData.localData?.intentions || [];
    const others = allIntentions.filter(i => i.date !== today);
    const updated = [...others, ...this.data.intentions];
    app.globalData.localData.intentions = updated;
    app.saveLocalData('intentions', updated);
  },

  toggleLock() {
    const { locked } = this.data;
    this.setData({ locked: !locked });
  },

  calculateStats() {
    const { intentions } = this.data;
    const completed = intentions.filter(i => i.is_completed).length;
    const total = intentions.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    this.setData({
      stats: { completed, total, completionRate: rate, distractionMinutes: 0 }
    });
  },

  showEveningSummary() {
    this.calculateStats();
    this.setData({ showSummary: true });
  },

  closeSummary() {
    this.setData({ showSummary: false });
  }
});
