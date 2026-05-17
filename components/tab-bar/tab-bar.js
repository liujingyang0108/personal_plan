Component({
  properties: {
    current: {
      type: Number,
      value: 0
    }
  },

  data: {
    tabs: [
      { text: '计划', icon: '📋' },
      { text: '今天', icon: '✅' },
      { text: '训练', icon: '💪' },
      { text: '我的', icon: '👤' }
    ],
    list: [
      { pagePath: 'pages/plan/plan' },
      { pagePath: 'pages/today/today' },
      { pagePath: 'pages/train/train' },
      { pagePath: 'pages/profile/profile' }
    ]
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const pagePath = this.data.list[index].pagePath;
      wx.switchTab({ url: pagePath });
    }
  }
});
