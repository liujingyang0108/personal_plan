Page({
  data: {
    category: '',
    categoryName: '',
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    editing: false,
    goalId: ''
  },

  onLoad(options) {
    const app = getApp();
    const categories = app.globalData.categories;

    if (options.category) {
      const cat = categories.find(c => c.id === options.category);
      this.setData({
        category: options.category,
        categoryName: cat ? `${cat.name} ${cat.icon}` : options.category
      });
    }
    if (options.id) {
      this.setData({ editing: true, goalId: options.id });
      this.loadGoal(options.id);
    }
  },

  loadGoal(id) {
    const app = getApp();
    const goals = app.globalData.localData?.goals || [];
    const goal = goals.find(g => g._id === id);
    if (goal) {
      const cat = app.globalData.categories.find(c => c.id === goal.category);
      this.setData({
        category: goal.category,
        categoryName: cat ? `${cat.name} ${cat.icon}` : goal.category,
        title: goal.title,
        description: goal.description || '',
        start_date: goal.start_date || '',
        end_date: goal.end_date || ''
      });
    }
  },

  onTitleChange(e) {
    this.setData({ title: e.detail.value });
  },

  onDescChange(e) {
    this.setData({ description: e.detail.value });
  },

  onStartDateChange(e) {
    this.setData({ start_date: e.detail.value });
  },

  onEndDateChange(e) {
    this.setData({ end_date: e.detail.value });
  },

  saveGoal() {
    const { category, title, description, start_date, end_date, editing, goalId } = this.data;

    if (!title.trim()) {
      wx.showToast({ title: '请输入目标标题', icon: 'none' });
      return;
    }

    const app = getApp();
    const goals = app.globalData.localData?.goals || [];
    const now = new Date().toISOString().split('T')[0];

    if (editing) {
      const index = goals.findIndex(g => g._id === goalId);
      if (index !== -1) {
        goals[index] = { ...goals[index], title, description, start_date, end_date };
      }
    } else {
      goals.push({
        _id: Date.now().toString(),
        category,
        title,
        description,
        start_date,
        end_date,
        status: 'active',
        created_at: now
      });
    }

    app.globalData.localData.goals = goals;
    app.saveLocalData('goals', goals);

    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
