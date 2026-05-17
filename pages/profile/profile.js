Page({
  data: {
    calendar: [],
    currentMonth: '',
    milestones: [],
    distractionStats: { totalMinutes: 0, reasons: [] },
    loading: true
  },

  onLoad() {
    this.initCalendar();
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  formatMonth(date) {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return `${date.getFullYear()}年${months[date.getMonth()]}`;
  },

  initCalendar() {
    const now = new Date();
    this.setData({ currentMonth: this.formatMonth(now) });
    this.renderCalendar(now);
  },

  renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    for (let i = 0; i < firstDay; i++) {
      calendar.push({ day: '', empty: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push({ day: i, empty: false });
    }
    this.setData({ calendar });
  },

  loadData() {
    this.setData({ loading: true });
    const app = getApp();
    const trainings = app.globalData.localData?.trainings || [];

    const milestones = trainings.slice(0, 5).map(t => ({
      date: t.date,
      template: t.template_name,
      exerciseCount: t.exercises?.length || 0
    }));

    this.setData({
      milestones,
      distractionStats: { totalMinutes: 0, reasons: [] },
      loading: false
    });
  },

  prevMonth() {
    const currentStr = this.data.currentMonth;
    const [year, monthStr] = currentStr.split('年');
    const month = parseInt(monthStr);
    const date = new Date(parseInt(year), month - 2, 1);
    this.setData({ currentMonth: this.formatMonth(date) });
    this.renderCalendar(date);
  },

  nextMonth() {
    const currentStr = this.data.currentMonth;
    const [year, monthStr] = currentStr.split('年');
    const month = parseInt(monthStr);
    const date = new Date(parseInt(year), month, 1);
    this.setData({ currentMonth: this.formatMonth(date) });
    this.renderCalendar(date);
  },

  generateReview() {
    wx.showToast({ title: 'AI复盘功能开发中', icon: 'none' });
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    const urls = ['/pages/plan/plan', '/pages/today/today', '/pages/train/train', '/pages/profile/profile'];
    wx.reLaunch({ url: urls[index] });
  }
});
