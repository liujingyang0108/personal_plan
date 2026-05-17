App({
  globalData: {
    userInfo: null,
    openid: null,
    categories: [
      { id: 'fitness', name: '健身', icon: '💪', color: '#FF6B6B' },
      { id: 'finance', name: '财务', icon: '💰', color: '#4ECDC4' },
      { id: 'learning', name: '学习', icon: '📚', color: '#45B7D1' },
      { id: 'work', name: '工作', icon: '💼', color: '#96CEB4' }
    ],
    defaultTimerMinutes: 25,
    defaultRestSeconds: 90,
    localData: { goals: [], intentions: [], trainings: [] }
  },

  onLaunch() {
    this.loadLocalData();
  },

  loadLocalData() {
    try {
      const goals = wx.getStorageSync('goals') || [];
      const intentions = wx.getStorageSync('intentions') || [];
      const trainings = wx.getStorageSync('trainings') || [];
      this.globalData.localData = { goals, intentions, trainings };
    } catch (e) {
      this.globalData.localData = { goals: [], intentions: [], trainings: [] };
    }
  },

  saveLocalData(key, data) {
    try {
      wx.setStorageSync(key, data);
    } catch (e) {
      console.error('本地存储失败', e);
    }
  }
});
