Page({
  data: {
    goal: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.loadGoal(options.id);
    } else if (options.category) {
      this.setData({
        goal: { category: options.category, status: 'active', title: '新目标' },
        loading: false
      });
    }
  },

  loadGoal(id) {
    const app = getApp();
    const goals = app.globalData.localData?.goals || [];
    const goal = goals.find(g => g._id === id);

    if (goal) {
      this.setData({ goal, loading: false });
    } else {
      this.setData({ goal: null, loading: false });
    }
  },

  changeStatus(e) {
    const { status } = e.currentTarget.dataset;
    const { goal } = this.data;
    if (!goal) return;

    goal.status = status;
    this.setData({ goal });

    const app = getApp();
    const goals = app.globalData.localData?.goals || [];
    const index = goals.findIndex(g => g._id === goal._id);
    if (index !== -1) {
      goals[index].status = status;
      app.globalData.localData.goals = goals;
      app.saveLocalData('goals', goals);
    }

    wx.showToast({ title: '状态已更新', icon: 'success' });
  }
});
