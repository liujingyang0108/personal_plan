Page({
  data: {
    categories: [],
    goalsByCategory: {},
    loading: true
  },

  onLoad() {
    const app = getApp();
    this.setData({ categories: app.globalData.categories });
    this.loadGoals();
  },

  onShow() {
    this.loadGoals();
  },

  loadGoals() {
    this.setData({ loading: true });
    const app = getApp();
    const goals = app.globalData.localData?.goals || [];
    this.processGoals(goals);
  },

  processGoals(goals) {
    const goalsByCategory = {};
    this.data.categories.forEach(c => {
      goalsByCategory[c.id] = [];
    });
    goals.forEach(goal => {
      if (goalsByCategory[goal.category]) {
        goalsByCategory[goal.category].push(goal);
      }
    });
    this.setData({ goalsByCategory, loading: false });
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    const urls = ['/pages/plan/plan', '/pages/today/today', '/pages/train/train', '/pages/profile/profile'];
    wx.reLaunch({ url: urls[index] });
  },

  goToGoalDetail(e) {
    const { id, category } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/plan/goal-detail/goal-detail?id=${id}&category=${category}`
    });
  },

  addGoal(e) {
    const { category } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/plan/goal-form/goal-form?category=${category}`
    });
  }
});
