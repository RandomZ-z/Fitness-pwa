/**
 * 减脂日记 PWA - 主应用逻辑
 * 功能：日期导航、饮食打卡、运动打卡、饮水记录、食谱展示、运动计划展示、动作库展示
 */

/* ===== 全局状态 ===== */
const App = {
  currentDate: new Date(),
  records: {},       // { 'YYYY-MM-DD': { diet: [], workout: { done: bool, note: '' }, water: [] } }
  currentWeek: 'week1',  // 当前运动计划周
  calExpanded: false,     // 日历展开状态
  calViewDate: new Date(), // 日历当前查看的月份
};

const STORAGE_KEY = 'fitness_pwa_records';
const WEEK_KEY = 'fitness_pwa_current_week';

/** 初始化应用，加载记录并渲染所有页面 */
function initApp() {
  loadRecords();
  loadCurrentWeek();
  renderDate();
  renderHome();
  renderDietPage();
  renderWorkoutPage();
  renderReferencePage();
  renderCalendar();
  bindNavigation();
  bindDateNav();
  bindDietTabs();
  bindWorkoutTabs();
  bindLibraryTabs();
}

/* ===== 数据持久化 (localStorage) ===== */

/** 从 localStorage 加载打卡记录 */
function loadRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      App.records = JSON.parse(data);
    }
  } catch (e) {
    console.warn('加载记录失败，使用空记录', e);
    App.records = {};
  }
}

/** 保存打卡记录到 localStorage */
function saveRecords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(App.records));
  } catch (e) {
    console.warn('保存记录失败', e);
  }
}

/** 从 localStorage 加载当前运动周设置 */
function loadCurrentWeek() {
  try {
    const week = localStorage.getItem(WEEK_KEY);
    if (week && WORKOUT_PLANS[week]) {
      App.currentWeek = week;
    }
  } catch (e) {
    console.warn('加载当前周设置失败', e);
  }
}

/** 保存当前运动周设置到 localStorage */
function saveCurrentWeek() {
  try {
    localStorage.setItem(WEEK_KEY, App.currentWeek);
  } catch (e) {
    console.warn('保存当前周设置失败', e);
  }
}

/** 获取日期键 (YYYY-MM-DD) */
function getDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 获取或创建当日记录，返回记录对象 */
function getDayRecord(dateKey) {
  if (!App.records[dateKey]) {
    App.records[dateKey] = {
      diet: [false, false, false, false],   // [早餐, 午餐, 加餐, 晚餐]
      workout: { done: false, note: '' },
      water: [false, false, false, false, false, false, false]  // 7个饮水时段
    };
  }
  return App.records[dateKey];
}

/* ===== 日期导航 ===== */

/** 渲染头部日期显示和日期导航区域的日期文本 */
function renderDate() {
  const dateEl = document.getElementById('dateDisplay');
  const dayEl = document.getElementById('dayLabel');
  const headerEl = document.getElementById('headerDate');

  dateEl.textContent = formatDateCN(App.currentDate);
  const dayName = DAY_NAMES[App.currentDate.getDay()];
  dayEl.textContent = dayName;
  headerEl.textContent = formatDateCN(App.currentDate) + ' ' + dayName;
}

/** 切换日期并播放滑动动画
 * @param {number} direction -1 为前一天，+1 为后一天
 */
function animateDayChange(direction) {
  const body = document.getElementById('homeBody');
  if (!body || body.classList.contains('animating')) return;

  // 防止重复点击
  body.classList.add('animating');

  // 方向判定：-1 = 前一天（内容右出左进），+1 = 后一天（内容左出右进）
  const outClass = direction < 0 ? 'slide-out-right' : 'slide-out-left';
  const inClass  = direction < 0 ? 'slide-in-left'  : 'slide-in-right';

  // 第一步：内容滑出
  body.classList.add(outClass);

  setTimeout(() => {
    // 第二步：更新日期并重新渲染
    App.currentDate.setDate(App.currentDate.getDate() + direction);
    renderDate();
    renderHome();

    // 移除滑出类，添加滑入类
    body.classList.remove(outClass);
    body.classList.add(inClass);

    setTimeout(() => {
      // 第三步：动画结束，清理状态
      body.classList.remove(inClass, 'animating');
    }, 260);
  }, 180);
}

/** 切换到前一天 */
function prevDay() {
  animateDayChange(-1);
}

/** 切换到后一天 */
function nextDay() {
  animateDayChange(+1);
}

/** 绑定日期导航按钮的前后切换事件 */
function bindDateNav() {
  document.getElementById('prevDay').addEventListener('click', prevDay);
  document.getElementById('nextDay').addEventListener('click', nextDay);
}

/* ===== 底部导航 ===== */

/** 绑定底部导航栏的四个页面切换按钮事件，并驱动滑块指示器滑动 */
function bindNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const navBar = document.querySelector('.bottom-nav');

  // 根据当前激活项把滑块定位到正确位置（无过渡，避免首屏滑动动画）
  const initActive = document.querySelector('.nav-item.active');
  const initIdx = initActive ? Array.from(navItems).indexOf(initActive) : 0;
  navBar.style.setProperty('--nav-idx', initIdx);

  navItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      const pageName = item.getAttribute('data-page');
      switchPage(pageName);
      // 更新导航栏激活状态
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      // 移动滑块到被点击项的位置
      navBar.style.setProperty('--nav-idx', idx);
    });
  });
}

/** 切换到指定页面，隐藏其他页面并显示目标页面 */
function switchPage(pageName) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageName}`);
  if (target) {
    target.classList.add('active');
  }
}

/* ===== 首页渲染 ===== */

/** 渲染首页全部打卡内容（饮食、运动、饮水、统计、日历） */
function renderHome() {
  renderDietCheckin();
  renderWorkoutCheckin();
  renderWaterCheckin();
  updateStats();
  renderCalendar();
}

/** 渲染首页饮食打卡区域，根据当前星期几显示对应食谱 */
function renderDietCheckin() {
  const dayName = getDayKeyFromDate(App.currentDate);
  const dayDiet = WEEKLY_DIET[dayName];
  const dateKey = getDateKey(App.currentDate);
  const record = getDayRecord(dateKey);

  const titleEl = document.getElementById('dietDayTitle');
  const calEl = document.getElementById('dietDayCal');
  const badgeEl = document.getElementById('dietBadge');
  const listEl = document.getElementById('dietCheckinList');

  if (!dayDiet) {
    titleEl.textContent = '今日食谱';
    calEl.textContent = '';
    badgeEl.textContent = '0/0';
    badgeEl.classList.remove('done');
    listEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:0.85rem;">暂无今日食谱数据</div>';
    return;
  }

  titleEl.textContent = `${dayName}食谱`;
  calEl.textContent = '约 1700 kcal';

  // 餐次配置：key 对应 WEEKLY_DIET 的字段，icon 和 label 用于显示
  const mealKeys = [
    { key: 'breakfast', icon: '🌅', label: '早餐', cls: 'breakfast' },
    { key: 'lunch', icon: '☀️', label: '午餐', cls: 'lunch' },
    { key: 'snack', icon: '🍎', label: '加餐', cls: 'snack' },
    { key: 'dinner', icon: '🌙', label: '晚餐', cls: 'dinner' }
  ];

  let html = '';
  mealKeys.forEach((meal, index) => {
    const mealData = dayDiet[meal.key];
    if (!mealData) return;
    const isChecked = record.diet[index] ? ' checked' : '';
    const checkedClass = record.diet[index] ? ' checked' : '';

    html += `
      <li class="meal-checkin-item${checkedClass}" onclick="toggleDietItem('diet', ${index})">
        <div class="meal-type-icon ${meal.cls}">${meal.icon}</div>
        <div class="meal-info">
          <div class="meal-label">${meal.label}</div>
          <div class="meal-cal">${mealData.calories}</div>
        </div>
        <div class="checkin-checkbox${isChecked}"></div>
      </li>
    `;
  });

  listEl.innerHTML = html;

  // 更新打卡进度角标
  const doneCount = record.diet.filter(Boolean).length;
  badgeEl.textContent = `${doneCount}/4`;
  if (doneCount === 4) {
    badgeEl.classList.add('done');
  } else {
    badgeEl.classList.remove('done');
  }
}

/** 渲染首页运动打卡区域，显示当天运动计划或休息日横幅 */
function renderWorkoutCheckin() {
  const area = document.getElementById('workoutCheckinArea');
  const dayKey = getDayKeyFromDate(App.currentDate);
  const plan = WORKOUT_PLANS[App.currentWeek];
  const dateKey = getDateKey(App.currentDate);
  const record = getDayRecord(dateKey);

  if (!plan) {
    area.innerHTML = '<div class="empty-state"><div class="empty-icon">💪</div><div class="empty-text">暂无运动计划</div></div>';
    return;
  }

  // 在当前周计划中查找匹配今天的运动日
  const todayWorkout = findWorkoutForDay(plan.schedule, dayKey);

  if (!todayWorkout) {
    // 休息日
    area.innerHTML = `
      <div class="rest-day-banner">
        <div class="rest-icon">😴</div>
        <div class="rest-title">今天是休息日</div>
        <div class="rest-text">好好休息，让身体恢复，为下次运动积蓄能量</div>
      </div>
    `;
    return;
  }

  // 有运动计划时显示打卡卡片
  const isDone = record.workout.done;
  const cardClass = isDone ? 'checkin-card workout-checkin-card completed' : 'checkin-card workout-checkin-card';

  let phasesHtml = '';
  if (todayWorkout.phases && todayWorkout.phases.length > 0) {
    todayWorkout.phases.forEach(phase => {
      const dotClass = getPhaseDotClass(phase.name);
      phasesHtml += `
        <div class="phase-item">
          <div class="phase-dot ${dotClass}"></div>
          <div class="phase-content">
            <div class="phase-name">${phase.name} ${phase.duration ? '· ' + phase.duration : ''}</div>
            <div class="phase-desc">${phase.content}</div>
          </div>
        </div>
      `;
    });
  }

  let tipsHtml = '';
  if (todayWorkout.tips && todayWorkout.tips.length > 0) {
    tipsHtml = `
      <div class="tips-section">
        <div class="tips-title">小提示</div>
        <ul class="tips-list">
          ${todayWorkout.tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  const btnText = isDone ? '已完成运动' : '完成运动';
  const btnClass = isDone ? 'checkin-btn secondary' : 'checkin-btn primary';

  area.innerHTML = `
    <div class="${cardClass}">
      <div class="card-header">
        <div>
          <div class="card-title">${todayWorkout.title}</div>
          <div class="card-subtitle">${todayWorkout.day} · ${todayWorkout.total}</div>
        </div>
      </div>
      <div class="phase-list">
        ${phasesHtml}
      </div>
      ${tipsHtml}
      <button class="${btnClass}" onclick="toggleWorkout()">${btnText}</button>
    </div>
  `;
}

/** 渲染首页饮水打卡区域，显示7个饮水时段和进度条 */
function renderWaterCheckin() {
  const listEl = document.getElementById('waterCheckinList');
  const progressEl = document.getElementById('waterProgress');
  const summaryEl = document.getElementById('waterSummary');
  const dateKey = getDateKey(App.currentDate);
  const record = getDayRecord(dateKey);

  let html = '';
  WATER_PLAN.forEach((item, index) => {
    const isChecked = record.water[index] ? ' checked' : '';
    const doneClass = record.water[index] ? ' done' : '';
    html += `
      <li class="checkin-item${record.water[index] ? ' checked' : ''}" onclick="toggleWaterItem(${index})">
        <div class="checkin-checkbox${isChecked}"></div>
        <div class="item-content">
          <div class="item-text">${item.time} · ${item.amount}</div>
          <div class="item-detail">${item.note}</div>
        </div>
      </li>
    `;
  });

  listEl.innerHTML = html;

  const doneCount = record.water.filter(Boolean).length;
  const percent = Math.round((doneCount / 7) * 100);
  progressEl.style.width = percent + '%';
  summaryEl.textContent = `已完成 ${doneCount}/7（${Math.round(doneCount * 2000 / 7)}ml / 2000ml）`;
}

/** 更新首页统计数字（饮食、运动、饮水） */
function updateStats() {
  const dateKey = getDateKey(App.currentDate);
  const record = getDayRecord(dateKey);

  // 饮食统计
  const dietDone = record.diet.filter(Boolean).length;
  document.getElementById('statDiet').textContent = `${dietDone}/4`;

  // 运动统计
  const dayKey = getDayKeyFromDate(App.currentDate);
  const plan = WORKOUT_PLANS[App.currentWeek];
  const todayWorkout = plan ? findWorkoutForDay(plan.schedule, dayKey) : null;

  if (todayWorkout) {
    document.getElementById('statWorkout').textContent = record.workout.done ? '已完成' : '待完成';
    document.getElementById('statWorkout').className = 'stat-number ' + (record.workout.done ? 'green' : 'blue');
  } else {
    document.getElementById('statWorkout').textContent = '休息';
    document.getElementById('statWorkout').className = 'stat-number orange';
  }

  // 饮水统计
  const waterDone = record.water.filter(Boolean).length;
  document.getElementById('statWater').textContent = `${waterDone}/7`;
}

/** 切换饮食项打卡状态（首页），并更新界面 */
function toggleDietItem(mealKey, itemIndex) {
  const dateKey = getDateKey(App.currentDate);
  const record = getDayRecord(dateKey);
  record.diet[itemIndex] = !record.diet[itemIndex];
  saveRecords();
  renderDietCheckin();
  updateStats();

  if (record.diet[itemIndex]) {
    const mealLabels = ['早餐', '午餐', '加餐', '晚餐'];
    showToast(`${mealLabels[itemIndex]}打卡成功`);
  }
}

/** 切换运动打卡状态，并更新界面 */
function toggleWorkout() {
  const dateKey = getDateKey(App.currentDate);
  const record = getDayRecord(dateKey);
  record.workout.done = !record.workout.done;
  saveRecords();
  renderWorkoutCheckin();
  updateStats();

  if (record.workout.done) {
    showToast('运动打卡成功');
  } else {
    showToast('已取消运动打卡');
  }
}

/** 切换饮水项打卡状态，并更新界面 */
function toggleWaterItem(index) {
  const dateKey = getDateKey(App.currentDate);
  const record = getDayRecord(dateKey);
  record.water[index] = !record.water[index];
  saveRecords();
  renderWaterCheckin();
  updateStats();

  if (record.water[index]) {
    showToast(`饮水打卡：${WATER_PLAN[index].time} ${WATER_PLAN[index].amount}`);
  }
}

/* ===== 饮食页面渲染 ===== */

/** 渲染饮食页面所有子标签内容（本周食谱、饮食原则、饮水计划、烹饪建议） */
function renderDietPage() {
  renderWeekMenu();
  renderPrinciples();
  renderWaterPlan();
  renderCookAdvice();
}

/** 渲染一周食谱，每天显示餐次卡片（可展开/折叠） */
function renderWeekMenu() {
  const container = document.getElementById('weekDietMenu');
  let html = '';

  DAY_KEYS.forEach(day => {
    const dayDiet = WEEKLY_DIET[day];
    if (!dayDiet) return;

    const mealEntries = [
      { key: 'breakfast', data: dayDiet.breakfast },
      { key: 'lunch', data: dayDiet.lunch },
      { key: 'snack', data: dayDiet.snack },
      { key: 'dinner', data: dayDiet.dinner }
    ].filter(m => m.data);

    html += `<div class="meal-group">`;
    html += `<div style="font-family:var(--font-display);font-size:0.9rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">${day}</div>`;

    mealEntries.forEach(meal => {
      const id = `meal-${day}-${meal.key}`;
      html += `
        <div class="meal-card" id="${id}">
          <div class="meal-header" onclick="toggleMealCard('${id}')">
            <div>
              <div class="meal-name">${meal.data.title}</div>
              <div class="meal-calories">${meal.data.calories}</div>
            </div>
            <div class="meal-arrow">▾</div>
          </div>
          <div class="meal-body">
            <div class="meal-items">
              ${meal.data.items.map(item => `<div class="meal-item">${item}</div>`).join('')}
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

/** 切换食谱卡片展开/折叠状态 */
function toggleMealCard(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.classList.toggle('expanded');
  }
}

/** 渲染饮食原则网格和推荐/避免食材表格 */
function renderPrinciples() {
  // 渲染饮食原则网格
  const gridEl = document.getElementById('principleGrid');
  gridEl.innerHTML = DIET_PRINCIPLES.map(p => `
    <div class="principle-item">
      <div class="p-icon">${p.icon}</div>
      <div class="p-text">${p.text}</div>
    </div>
  `).join('');

  // 渲染避免食物
  const avoidEl = document.getElementById('avoidFoods');
  avoidEl.innerHTML = `<div class="food-table">` +
    AVOID_FOODS.map(cat => `
      <div class="food-row">
        <div class="food-category">${cat.category}</div>
        <div class="food-items">
          ${cat.items.map(item => `<span class="food-tag avoid">${item}</span>`).join('')}
        </div>
      </div>
    `).join('') +
    `</div>`;

  // 渲染推荐食材
  const recEl = document.getElementById('recommendFoods');
  recEl.innerHTML = `<div class="food-table">` +
    RECOMMEND_FOODS.map(cat => `
      <div class="food-row">
        <div class="food-category">${cat.category}</div>
        <div class="food-items">
          ${cat.items.map(item => `<span class="food-tag">${item}</span>`).join('')}
        </div>
      </div>
    `).join('') +
    `</div>`;
}

/** 渲染饮水计划列表 */
function renderWaterPlan() {
  const container = document.getElementById('waterPlanList');
  container.innerHTML = WATER_PLAN.map(item => `
    <div class="water-item">
      <div class="water-time">${item.time}</div>
      <div class="water-amount">${item.amount}</div>
      <div class="water-note">${item.note}</div>
    </div>
  `).join('');
}

/** 渲染烹饪建议（推荐烹饪方式 + 调味料选择） */
function renderCookAdvice() {
  // 推荐烹饪方式
  const cookMethods = [
    { rank: 1, name: '蒸', desc: '最大程度保留营养，少油少盐' },
    { rank: 2, name: '煮', desc: '水煮蔬菜、瘦肉，低热量' },
    { rank: 3, name: '烤', desc: '烤箱烤制，无需额外油脂' },
    { rank: 4, name: '煎', desc: '少量橄榄油煎制' },
    { rank: 5, name: '炒', desc: '少油快炒，控制油量' }
  ];

  const cookEl = document.getElementById('cookMethods');
  cookEl.innerHTML = cookMethods.map(m => `
    <div class="cook-method">
      <div class="rank">${m.rank}</div>
      <div>
        <div class="method-name">${m.name}</div>
        <div class="method-desc">${m.desc}</div>
      </div>
    </div>
  `).join('');

  // 调味料选择
  const seasonGood = ['盐（适量）', '黑胡椒', '柠檬汁', '醋', '姜、蒜、葱', '低钠酱油', '辣椒（适量）', '香草（罗勒、迷迭香）'];
  const seasonBad = ['白糖/红糖', '蜂蜜（少量可用）', '沙拉酱（高热量）', '番茄酱（含糖）', '蚝油（含糖较高）', '芝麻酱/花生酱'];

  const seasonEl = document.getElementById('seasoningInfo');
  seasonEl.innerHTML = `
    <div class="food-table">
      <div class="food-row">
        <div class="food-category" style="color:var(--accent);">推荐调味料</div>
        <div class="food-items">
          ${seasonGood.map(item => `<span class="food-tag">${item}</span>`).join('')}
        </div>
      </div>
      <div class="food-row">
        <div class="food-category" style="color:var(--red);">限量/避免</div>
        <div class="food-items">
          ${seasonBad.map(item => `<span class="food-tag avoid">${item}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

/** 绑定饮食页面的子标签切换事件 */
function bindDietTabs() {
  const tabs = document.querySelectorAll('#dietTabs .sub-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 更新标签激活状态
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // 切换子页面
      const tabName = tab.getAttribute('data-diet-tab');
      document.querySelectorAll('.diet-sub-page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`dietTab-${tabName}`);
      if (target) target.classList.add('active');
    });
  });
}

/* ===== 运动页面渲染 ===== */

/** 渲染运动页面全部内容（运动计划 + 动作库） */
function renderWorkoutPage() {
  renderWeekSelector();
  renderWorkoutPlan(App.currentWeek);
  renderExerciseLibrary();
  renderWarmup();
  renderStretch();
}

/** 渲染运动计划的周选择器按钮 */
function renderWeekSelector() {
  const container = document.getElementById('weekSelector');
  const weeks = [
    { key: 'week1', label: '第一周' },
    { key: 'week2', label: '第二周' },
    { key: 'week3', label: '第三周' },
    { key: 'week4plus', label: '第四周+' }
  ];

  container.innerHTML = weeks.map(w => {
    const activeClass = w.key === App.currentWeek ? ' active' : '';
    return `<button class="week-tab${activeClass}" data-week="${w.key}" onclick="selectWeek('${w.key}')">${w.label}</button>`;
  }).join('');
}

/** 切换当前运动计划周并重新渲染 */
function selectWeek(weekKey) {
  App.currentWeek = weekKey;
  saveCurrentWeek();
  renderWeekSelector();
  renderWorkoutPlan(weekKey);
}

/** 渲染指定周的运动计划，显示每天的运动安排卡片 */
function renderWorkoutPlan(weekKey) {
  const container = document.getElementById('workoutPlanContent');
  const plan = WORKOUT_PLANS[weekKey];

  if (!plan) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">暂无运动计划</div></div>';
    return;
  }

  // 渲染周标题
  let html = `
    <div style="margin-bottom:16px;">
      <div style="font-family:var(--font-display);font-size:1.05rem;font-weight:700;color:var(--text-primary);">${plan.label}</div>
      <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px;">${plan.subtitle}</div>
    </div>
  `;

  // 渲染每天的运动卡片
  plan.schedule.forEach(day => {
    html += renderWorkoutDayCard(day);
  });

  container.innerHTML = html;
}

/** 渲染单个运动日的详细卡片 */
function renderWorkoutDayCard(day) {
  let phasesHtml = '';
  if (day.phases && day.phases.length > 0) {
    phasesHtml = '<div class="phase-list">';
    day.phases.forEach(phase => {
      const dotClass = getPhaseDotClass(phase.name);
      phasesHtml += `
        <div class="phase-item">
          <div class="phase-dot ${dotClass}"></div>
          <div class="phase-content">
            <div class="phase-name">${phase.name} ${phase.duration ? '· ' + phase.duration : ''}</div>
            <div class="phase-desc">${phase.content}</div>
          </div>
        </div>
      `;
    });
    phasesHtml += '</div>';
  }

  let tipsHtml = '';
  if (day.tips && day.tips.length > 0) {
    tipsHtml = `
      <div class="tips-section">
        <div class="tips-title">小提示</div>
        <ul class="tips-list">
          ${day.tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  return `
    <div class="workout-day-card">
      <div class="day-header">
        <div class="day-title">${day.day} - ${day.title}</div>
        <div class="day-duration">${day.total}</div>
      </div>
      ${phasesHtml}
      ${tipsHtml}
    </div>
  `;
}

/** 渲染动作库（力量训练），按上肢、下肢、核心分类展示 */
function renderExerciseLibrary() {
  const container = document.getElementById('exerciseLibrary');
  const categories = [
    { key: 'upper', title: '上肢训练', color: 'var(--blue)' },
    { key: 'lower', title: '下肢训练', color: 'var(--accent)' },
    { key: 'core', title: '核心训练', color: 'var(--orange)' }
  ];

  let html = '';
  categories.forEach(cat => {
    const exercises = EXERCISE_LIBRARY[cat.key];
    if (!exercises || exercises.length === 0) return;

    html += `
      <div class="exercise-category">
        <div class="exercise-category-title">
          <div class="cat-dot" style="background:${cat.color}"></div>
          ${cat.title}
        </div>
    `;

    exercises.forEach(ex => {
      html += `
        <div class="exercise-item">
          <div class="exercise-name">${ex.name}</div>
          <ol class="exercise-steps">
            ${ex.steps.map((step, i) => `<li data-step="${i + 1}.">${step}</li>`).join('')}
          </ol>
          <div class="exercise-note">注意：${ex.note}</div>
        </div>
      `;
    });

    html += '</div>';
  });

  container.innerHTML = html;
}

/** 渲染热身动作列表 */
function renderWarmup() {
  const container = document.getElementById('warmupLibrary');
  container.innerHTML = `
    <div class="exercise-category">
      <div class="exercise-category-title">
        <div class="cat-dot" style="background:var(--orange)"></div>
        运动前热身动作
      </div>
      ${WARMUP_EXERCISES.map(ex => `
        <div class="exercise-item">
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-steps">
            <li data-step="·" style="color:var(--text-secondary);font-size:0.85rem;">时长：${ex.duration}</li>
            <li data-step="·" style="color:var(--text-secondary);font-size:0.85rem;">目的：${ex.purpose}</li>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/** 渲染拉伸动作列表，按下肢和上肢分类 */
function renderStretch() {
  const container = document.getElementById('stretchLibrary');
  let html = '';

  // 下肢拉伸
  if (STRETCH_EXERCISES.lower && STRETCH_EXERCISES.lower.length > 0) {
    html += `
      <div class="exercise-category">
        <div class="exercise-category-title">
          <div class="cat-dot" style="background:var(--blue)"></div>
          下肢拉伸
        </div>
        <div class="stretch-table">
          ${STRETCH_EXERCISES.lower.map(s => `
            <div class="stretch-row">
              <div>
                <div class="stretch-name">${s.name}</div>
                <div class="stretch-target">${s.method} → ${s.target}</div>
              </div>
              <div class="stretch-duration">${s.duration}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 上肢拉伸
  if (STRETCH_EXERCISES.upper && STRETCH_EXERCISES.upper.length > 0) {
    html += `
      <div class="exercise-category">
        <div class="exercise-category-title">
          <div class="cat-dot" style="background:var(--accent)"></div>
          上肢拉伸
        </div>
        <div class="stretch-table">
          ${STRETCH_EXERCISES.upper.map(s => `
            <div class="stretch-row">
              <div>
                <div class="stretch-name">${s.name}</div>
                <div class="stretch-target">${s.method} → ${s.target}</div>
              </div>
              <div class="stretch-duration">${s.duration}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/** 绑定运动页面主标签（运动计划 / 动作库）切换事件 */
function bindWorkoutTabs() {
  const tabs = document.querySelectorAll('#workoutTabs .sub-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.getAttribute('data-workout-tab');
      document.querySelectorAll('.workout-sub-page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`workoutTab-${tabName}`);
      if (target) target.classList.add('active');
    });
  });
}

/** 绑定动作库子标签（力量训练 / 热身 / 拉伸）切换事件 */
function bindLibraryTabs() {
  const tabs = document.querySelectorAll('#libraryTabs .sub-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.getAttribute('data-lib-tab');
      document.querySelectorAll('.lib-sub-page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`libTab-${tabName}`);
      if (target) target.classList.add('active');
    });
  });
}

/* ===== 参考页面渲染 ===== */

/** 渲染参考页面的里程碑列表 */
function renderReferencePage() {
  const milestones = [
    { weight: '190 斤', desc: '减少 10 斤，衣服开始变宽松', color: 'var(--accent)' },
    { weight: '180 斤', desc: '减少 20 斤，BMI 进入超重范围', color: 'var(--accent)' },
    { weight: '170 斤', desc: '减少 30 斤，体力明显提升', color: 'var(--accent)' },
    { weight: '160 斤', desc: '减少 40 斤，BMI 接近正常', color: 'var(--blue)' },
    { weight: '150 斤', desc: '减少 50 斤，BMI 进入正常范围', color: 'var(--blue)' },
    { weight: '140 斤', desc: '减重目标达成！', color: 'var(--orange)' }
  ];

  const list = document.getElementById('milestoneList');
  list.innerHTML = milestones.map(m => `
    <li style="padding:12px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;">
      <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:${m.color};min-width:70px;">${m.weight}</div>
      <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.4;">${m.desc}</div>
    </li>
  `).join('');
}

/* ===== 工具函数 ===== */

/** 显示居中 Toast 提示消息，2秒后自动消失 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

/** 根据日期获取星期键（周一/周二...），用于匹配食谱和运动计划 */
function getDayKeyFromDate(date) {
  const dayIndex = date.getDay();
  // DAY_KEYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  // getDay() 返回 0=周日, 1=周一, ..., 6=周六
  // 需要映射：0(周日)->'周日', 1(周一)->'周一', ...
  return DAY_NAMES[dayIndex];  // DAY_NAMES = ['周日', '周一', ... '周六']
}

/** 格式化日期为中文显示格式（M月D日） */
function formatDateCN(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

/** 根据运动阶段名称返回对应的 CSS 圆点样式类名 */
function getPhaseDotClass(phaseName) {
  if (phaseName.includes('热身')) return 'warmup';
  if (phaseName.includes('拉伸') || phaseName.includes('放松')) return 'stretch';
  return 'main';
}

/** 在一周运动计划中查找匹配指定星期几的运动安排 */
function findWorkoutForDay(schedule, dayKey) {
  if (!schedule) return null;

  // 直接匹配星期名称（如 '周一'）
  for (const item of schedule) {
    if (item.day === dayKey) return item;
  }

  // 匹配 '周末'（周六或周日）
  for (const item of schedule) {
    if (item.day === '周末' && (dayKey === '周六' || dayKey === '周日')) return item;
  }

  // 匹配描述中包含天数的（如 week4plus 的 '周四' 表示休息日，返回 null 即可）
  // 对于 week4plus 中明确有每天计划的，上面已直接匹配
  return null;
}

/* ===== 启动 ===== */
document.addEventListener('DOMContentLoaded', initApp);

/* ===== 日历模块 ===== */

/**
 * 计算指定日期的打卡完成等级 (0-3)
 * 等级 0: 无任何模块完成
 * 等级 1: 完成 1 个模块
 * 等级 2: 完成 2 个模块
 * 等级 3: 完成 3 个模块（全部完成）
 *
 * 饮食模块完成条件：早餐、午餐、晚餐 3 个打卡点全部勾选（加餐不计入）
 * 运动模块完成条件：运动打卡按钮已勾选
 * 饮水模块完成条件：当日已完成饮食或运动任意其一，则饮水视为完成
 */
function getDayCompletionLevel(dateKey) {
  const record = App.records[dateKey];
  if (!record) return 0;

  // 饮食模块：index 0=早餐, 1=午餐, 2=加餐, 3=晚餐
  // 加餐(index=2)不影响饮食完成判断
  const dietDone = record.diet[0] && record.diet[1] && record.diet[3];

  // 运动模块：点击完成按钮
  const workoutDone = record.workout && record.workout.done;

  // 饮水模块：若当日完成饮食或运动任意其一，则饮水算完成
  const waterDone = dietDone || workoutDone;

  // 统计完成的模块数
  let completedModules = 0;
  if (dietDone) completedModules++;
  if (workoutDone) completedModules++;
  if (waterDone) completedModules++;

  // 饮水依赖于饮食/运动，所以实际最多 3 种组合：
  // 0个完成 → level 0
  // 1个完成 → level 1（仅有饮食或仅有运动）
  // 2个完成 → level 2（饮食+运动 → 饮水自动完成）
  // 3个完成 → level 3（不可能，因为饮水依赖另外两个）
  // 修正：实际只有 0、1、2 三种，但为了4级区分：
  // 当 dietDone && workoutDone 时 = 全部3模块完成 = level 3
  if (completedModules >= 3 || (dietDone && workoutDone)) return 3;
  if (completedModules === 2) return 2;
  if (completedModules === 1) return 1;
  return 0;
}

/** 渲染日历模块（折叠态预览 + 展开态月历） */
function renderCalendar() {
  renderCalendarPreview();
  renderCalendarMonth();
  updateCalendarStats();
}

/** 渲染折叠态的当前周预览（7天） */
function renderCalendarPreview() {
  const container = document.getElementById('calendarPreview');
  if (!container) return;

  const today = new Date();
  // 找到本周一（周一为一周起始）
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const weekLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  let html = '';

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === today.toDateString();
    const isOtherMonth = d.getMonth() !== today.getMonth();
    const dateKey = getDateKey(d);
    const level = getDayCompletionLevel(dateKey);

    // 预览态用小圆点表示打卡程度
    let dotStyle = '';
    if (level > 0 && !isOtherMonth) {
      const opacity = 0.2 + level * 0.25;
      dotStyle = `background: rgba(52, 211, 153, ${opacity});`;
    }

    html += `
      <div class="preview-day">
        <div class="preview-label">${weekLabels[i]}</div>
        <div class="preview-date${isToday ? ' today' : ''}${isOtherMonth ? ' other-month' : ''}"
             style="${dotStyle}">${isToday ? '今' : d.getDate()}</div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/** 渲染展开态的完整月历 */
function renderCalendarMonth() {
  const grid = document.getElementById('calendarGrid');
  const display = document.getElementById('calMonthDisplay');
  if (!grid || !display) return;

  const year = App.calViewDate.getFullYear();
  const month = App.calViewDate.getMonth();

  display.textContent = `${year}年${String(month + 1).padStart(2, '0')}月`;

  const today = new Date();
  const todayStr = today.toDateString();

  // 获取当月第一天是周几（0=周日）
  const firstDay = new Date(year, month, 1).getDay();
  // 转换为周一=0的偏移量
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  // 当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 上月天数
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  let html = '';

  // 星期标签行
  weekdayLabels.forEach(label => {
    html += `<div class="grid-weekday">${label}</div>`;
  });

  // 上月填充
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    html += `
      <div class="grid-day">
        <div class="grid-day-cell other-month">${day}</div>
      </div>
    `;
  }

  // 当月日期
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toDateString();
    const isToday = dateStr === todayStr;
    const isFuture = date > today;
    const dateKey = getDateKey(date);
    const level = getDayCompletionLevel(dateKey);

    let classes = 'grid-day-cell';
    if (isToday) classes += ' today';
    if (isFuture) classes += ' future';
    if (level > 0 && !isFuture) classes += ` level-${level}`;

    html += `
      <div class="grid-day">
        <div class="${classes}">${d}</div>
      </div>
    `;
  }

  // 下月填充（补齐到 6 行 = 42 格）
  const totalCells = startOffset + daysInMonth;
  const remaining = (Math.ceil(totalCells / 7) * 7) - totalCells;
  for (let i = 1; i <= remaining; i++) {
    html += `
      <div class="grid-day">
        <div class="grid-day-cell other-month">${i}</div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

/** 更新日历统计（连续打卡天数、累计、本月） */
function updateCalendarStats() {
  const streakEl = document.getElementById('calStreak');
  const totalEl = document.getElementById('calTotalDays');
  const streakDaysEl = document.getElementById('calStreakDays');
  const monthDaysEl = document.getElementById('calMonthDays');

  // 计算连续打卡天数（从今天往回数）
  let streak = 0;
  const today = new Date();
  const d = new Date(today);

  // 先检查今天是否有记录（可能今天还没打卡，从昨天开始算）
  while (true) {
    const dateKey = getDateKey(d);
    const level = getDayCompletionLevel(dateKey);
    if (level > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  // 累计打卡天数（所有有记录且 level > 0 的日期）
  let total = 0;
  Object.keys(App.records).forEach(dateKey => {
    if (getDayCompletionLevel(dateKey) > 0) total++;
  });

  // 本月打卡天数
  const year = today.getFullYear();
  const month = today.getMonth();
  let monthCount = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date > today) break;
    const dateKey = getDateKey(date);
    if (getDayCompletionLevel(dateKey) > 0) monthCount++;
  }

  if (streakEl) streakEl.textContent = `连续打卡 ${streak} 天`;
  if (totalEl) totalEl.textContent = total;
  if (streakDaysEl) streakDaysEl.textContent = streak;
  if (monthDaysEl) monthDaysEl.textContent = monthCount;
}

/** 切换日历展开/折叠 */
function toggleCalendar() {
  App.calExpanded = !App.calExpanded;
  const widget = document.getElementById('calendarWidget');
  const preview = document.getElementById('calendarPreview');

  if (App.calExpanded) {
    widget.classList.add('expanded');
    // 展开时隐藏预览行
    preview.style.display = 'none';
    // 重置到当前月
    App.calViewDate = new Date();
    renderCalendarMonth();
    updateCalendarStats();
  } else {
    widget.classList.remove('expanded');
    preview.style.display = 'flex';
  }
}

/** 日历月份向前翻 */
function calendarPrevMonth(event) {
  event.stopPropagation();
  App.calViewDate.setMonth(App.calViewDate.getMonth() - 1);
  renderCalendarMonth();
}

/** 日历月份向后翻 */
function calendarNextMonth(event) {
  event.stopPropagation();
  App.calViewDate.setMonth(App.calViewDate.getMonth() + 1);
  renderCalendarMonth();
}
