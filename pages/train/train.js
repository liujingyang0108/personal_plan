Page({
  data: {
    templates: [
      { id: 'push', name: '推', icon: '🏋️', description: '胸部、肩部、三头肌' },
      { id: 'pull', name: '拉', icon: '💪', description: '背部、二头肌' },
      { id: 'legs', name: '腿', icon: '🦵', description: '腿部、臀部' },
      { id: 'full', name: '全身', icon: '🔥', description: '全身综合训练' }
    ],
    currentTemplate: null,
    exercises: [],
    training: false,
    restTimer: null,
    restSeconds: 0
  },

  onLoad() {},

  selectTemplate(e) {
    const { id } = e.currentTarget.dataset;
    const template = this.data.templates.find(t => t.id === id);
    const exercises = this.getTemplateExercises(id);
    this.setData({ currentTemplate: template, exercises, training: true });
  },

  getTemplateExercises(templateId) {
    const exerciseMap = {
      push: [
        { name: '卧推', sets: [{ weight: 60, reps: 10, completed: false }], targetSets: 4 },
        { name: '肩推', sets: [{ weight: 40, reps: 10, completed: false }], targetSets: 4 },
        { name: '飞鸟', sets: [{ weight: 15, reps: 12, completed: false }], targetSets: 3 },
        { name: '绳索下压', sets: [{ weight: 25, reps: 12, completed: false }], targetSets: 3 }
      ],
      pull: [
        { name: '引体向上', sets: [{ weight: 0, reps: 8, completed: false }], targetSets: 4 },
        { name: '坐姿划船', sets: [{ weight: 50, reps: 10, completed: false }], targetSets: 4 },
        { name: '面拉', sets: [{ weight: 20, reps: 15, completed: false }], targetSets: 3 },
        { name: '二头弯举', sets: [{ weight: 15, reps: 12, completed: false }], targetSets: 3 }
      ],
      legs: [
        { name: '深蹲', sets: [{ weight: 80, reps: 10, completed: false }], targetSets: 5 },
        { name: '罗马尼亚硬拉', sets: [{ weight: 60, reps: 10, completed: false }], targetSets: 4 },
        { name: '腿举', sets: [{ weight: 120, reps: 12, completed: false }], targetSets: 4 },
        { name: '腿弯举', sets: [{ weight: 30, reps: 12, completed: false }], targetSets: 3 }
      ],
      full: [
        { name: '深蹲', sets: [{ weight: 60, reps: 10, completed: false }], targetSets: 4 },
        { name: '卧推', sets: [{ weight: 50, reps: 10, completed: false }], targetSets: 4 },
        { name: '硬拉', sets: [{ weight: 80, reps: 6, completed: false }], targetSets: 3 },
        { name: '引体向上', sets: [{ weight: 0, reps: 8, completed: false }], targetSets: 3 }
      ]
    };
    return exerciseMap[templateId] || [];
  },

  completeSet(e) {
    const { exerciseIndex, setIndex } = e.currentTarget.dataset;
    const { exercises } = this.data;
    const exercise = exercises[exerciseIndex];

    if (setIndex >= exercise.sets.length) {
      const prevSet = exercise.sets[setIndex - 1];
      exercise.sets.push({
        weight: prevSet?.weight || 0,
        reps: prevSet?.reps || 0,
        completed: false
      });
    }

    exercise.sets[setIndex].completed = true;
    this.setData({ exercises });

    if (setIndex < exercise.targetSets - 1) {
      this.startRestTimer(exerciseIndex, setIndex + 1);
    }
  },

  startRestTimer(exerciseIndex, nextSetIndex) {
    const restSeconds = getApp().globalData.defaultRestSeconds || 90;
    this.setData({ restTimer: { exerciseIndex, setIndex: nextSetIndex }, restSeconds });

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      const { restSeconds } = this.data;
      if (restSeconds <= 0) {
        clearInterval(this.timer);
        this.setData({ restTimer: null });
        try {
          wx.vibrateShort();
        } catch (e) {}
      } else {
        this.setData({ restSeconds: restSeconds - 1 });
      }
    }, 1000);
  },

  cancelRest() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setData({ restTimer: null, restSeconds: 0 });
  },

  finishTraining() {
    wx.showModal({
      title: '结束训练',
      content: '确定要结束本次训练吗？',
      success: (res) => {
        if (res.confirm) {
          this.saveTraining();
          this.setData({ training: false, currentTemplate: null, exercises: [] });
          wx.showToast({ title: '训练已保存', icon: 'success' });
        }
      }
    });
  },

  saveTraining() {
    const { currentTemplate, exercises } = this.data;
    const app = getApp();
    const now = new Date().toISOString().split('T')[0];

    const training = {
      _id: Date.now().toString(),
      date: now,
      template_name: currentTemplate.name,
      exercises: exercises.map(e => ({
        exercise_name: e.name,
        sets: e.sets.map((s, i) => ({
          set_number: i + 1,
          weight: s.weight,
          reps: s.reps,
          is_completed: s.completed
        }))
      })),
      created_at: now
    };

    const trainings = app.globalData.localData?.trainings || [];
    trainings.unshift(training);
    app.globalData.localData.trainings = trainings;
    app.saveLocalData('trainings', trainings);
  },

  goBack() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setData({ training: false, currentTemplate: null, exercises: [], restTimer: null });
  },

  viewHistory() {
    wx.navigateTo({ url: '/pages/train/history/history' });
  }
});
