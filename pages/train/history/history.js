Page({
  data: {
    histories: [],
    loading: true
  },

  onLoad() {
    this.loadHistory();
  },

  loadHistory() {
    this.setData({ loading: true });
    const app = getApp();
    const trainings = app.globalData.localData?.trainings || [];
    this.setData({ histories: trainings, loading: false });
  },

  viewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/train/history-detail/history-detail?id=${id}`
    });
  }
});
