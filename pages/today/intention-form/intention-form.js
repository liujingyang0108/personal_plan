Page({
  data: {
    title: '',
    category: 'work',
    categoryName: '工作 💼',
    categories: []
  },

  onLoad() {
    const app = getApp();
    const categories = app.globalData.categories;
    this.setData({ categories });
  },

  onTitleChange(e) {
    this.setData({ title: e.detail.value });
  },

  onCategoryChange(e) {
    const { categories } = this.data;
    const selected = categories[e.detail.value];
    this.setData({
      category: selected.id,
      categoryName: `${selected.name} ${selected.icon}`
    });
  },

  saveIntention() {
    const { title, category } = this.data;

    if (!title.trim()) {
      wx.showToast({ title: '请输入意图', icon: 'none' });
      return;
    }

    const app = getApp();
    const today = new Date().toISOString().split('T')[0];
    const newIntention = {
      _id: Date.now().toString(),
      date: today,
      title,
      category,
      is_completed: false,
      is_locked: false
    };

    const intentions = app.globalData.localData?.intentions || [];
    intentions.push(newIntention);
    app.globalData.localData.intentions = intentions;
    app.saveLocalData('intentions', intentions);

    wx.showToast({ title: '添加成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
