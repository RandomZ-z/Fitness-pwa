/**
 * 减脂日记 - 核心数据定义
 * 包含一周食谱、四周运动计划、动作库
 */

/** 饮食原则 */
const DIET_PRINCIPLES = [
  { icon: '🥦', text: '天然食材优先' },
  { icon: '🚫', text: '避免添加糖' },
  { icon: '🌾', text: '全谷物替代白米白面' },
  { icon: '🥩', text: '每餐保证蛋白质' },
  { icon: '🥬', text: '蔬菜占盘子一半' },
  { icon: '💧', text: '每日饮水2000-2500ml' }
];

/** 避免食物列表 */
const AVOID_FOODS = [
  { category: '含糖饮料', items: ['奶茶', '可乐', '果汁饮料'] },
  { category: '油炸食品', items: ['炸鸡', '薯条', '油条'] },
  { category: '精制碳水', items: ['白面包', '蛋糕', '饼干'] },
  { category: '加工肉类', items: ['香肠', '培根', '火腿'] },
  { category: '高盐零食', items: ['薯片', '辣条', '咸菜'] }
];

/** 推荐食材 */
const RECOMMEND_FOODS = [
  { category: '蛋白质', items: ['鸡胸肉', '鱼', '虾', '鸡蛋', '豆腐', '瘦牛肉'] },
  { category: '碳水', items: ['糙米', '燕麦', '红薯', '玉米', '全麦面包'] },
  { category: '蔬菜', items: ['西兰花', '菠菜', '黄瓜', '番茄', '芹菜', '生菜'] },
  { category: '水果', items: ['苹果', '蓝莓', '草莓', '柚子', '猕猴桃'] },
  { category: '脂肪', items: ['橄榄油', '牛油果', '坚果（少量）'] }
];

/** 一周食谱数据 */
const WEEKLY_DIET = {
  '周一': {
    breakfast: { title: '早餐', calories: '约450 kcal', items: ['燕麦 50g + 牛奶 250ml', '水煮蛋 2 个', '小番茄 6-8 颗'] },
    lunch: { title: '午餐', calories: '约600 kcal', items: ['糙米饭 100g（生重）', '香煎鸡胸肉 150g', '蒜蓉西兰花 200g', '凉拌黄瓜 1 根'] },
    snack: { title: '加餐', calories: '约150 kcal', items: ['苹果 1 个 或 无糖酸奶 150g'] },
    dinner: { title: '晚餐', calories: '约500 kcal', items: ['蒸红薯 150g', '清蒸鱼 150g', '白灼菠菜 200g'] }
  },
  '周二': {
    breakfast: { title: '早餐', calories: '约450 kcal', items: ['全麦面包 2 片', '煎蛋 1 个 + 牛油果 半个', '无糖豆浆 300ml'] },
    lunch: { title: '午餐', calories: '约600 kcal', items: ['杂粮饭 100g（生重）', '番茄炒蛋（鸡蛋 2 个，番茄 2 个）', '清炒芹菜 200g', '豆腐汤 1 碗'] },
    snack: { title: '加餐', calories: '约150 kcal', items: ['蓝莓 100g 或 核桃 2 颗'] },
    dinner: { title: '晚餐', calories: '约500 kcal', items: ['玉米 1 根', '白灼虾 150g', '凉拌生菜 200g'] }
  },
  '周三': {
    breakfast: { title: '早餐', calories: '约450 kcal', items: ['紫薯 150g', '水煮蛋 2 个', '脱脂牛奶 250ml'] },
    lunch: { title: '午餐', calories: '约600 kcal', items: ['藜麦饭 100g（生重）', '洋葱炒牛肉（瘦牛肉 120g）', '清炒芦笋 200g', '紫菜蛋花汤 1 碗'] },
    snack: { title: '加餐', calories: '约150 kcal', items: ['猕猴桃 2 个 或 无糖酸奶 150g'] },
    dinner: { title: '晚餐', calories: '约500 kcal', items: ['南瓜 200g', '烤鸡胸 150g', '凉拌菠菜 200g'] }
  },
  '周四': {
    breakfast: { title: '早餐', calories: '约450 kcal', items: ['燕麦 50g + 希腊酸奶 150g', '坚果 10g（约 6-8 颗杏仁）', '草莓 5-6 颗'] },
    lunch: { title: '午餐', calories: '约600 kcal', items: ['黑米饭 100g（生重）', '清蒸鲈鱼 150g', '蒜蓉秋葵 200g', '凉拌木耳黄瓜'] },
    snack: { title: '加餐', calories: '约150 kcal', items: ['柚子 2-3 瓣 或 苹果 1 个'] },
    dinner: { title: '晚餐', calories: '约500 kcal', items: ['全麦卷饼 1 张', '鸡胸肉条 100g', '生菜、番茄、黄瓜 适量'] }
  },
  '周五': {
    breakfast: { title: '早餐', calories: '约450 kcal', items: ['红薯 150g', '茶叶蛋 2 个', '无糖豆浆 300ml'] },
    lunch: { title: '午餐', calories: '约600 kcal', items: ['糙米饭 100g（生重）', '宫保鸡丁（鸡胸肉 150g，少油版）', '白灼菜心 200g', '番茄蛋汤 1 碗'] },
    snack: { title: '加餐', calories: '约150 kcal', items: ['无糖酸奶 150g + 少量蓝莓'] },
    dinner: { title: '晚餐', calories: '约500 kcal', items: ['荞麦面 80g（干重）', '水煮虾 120g', '凉拌黄瓜丝、胡萝卜丝'] }
  },
  '周六': {
    breakfast: { title: '早餐', calories: '约450 kcal', items: ['全麦三明治 1 份（全麦面包 2 片 + 煎蛋 1 个 + 生菜、番茄）', '黑咖啡 1 杯（无糖无奶）'] },
    lunch: { title: '午餐', calories: '约600 kcal', items: ['藜麦沙拉碗（藜麦 80g + 烤鸡胸 120g + 混合蔬菜 + 油醋汁）'] },
    snack: { title: '加餐', calories: '约150 kcal', items: ['香蕉 1 根 或 苹果 1 个'] },
    dinner: { title: '晚餐', calories: '约500 kcal', items: ['蒸玉米 1 根', '清蒸鳕鱼 150g', '白灼生菜 200g'] }
  },
  '周日': {
    breakfast: { title: '早餐', calories: '约450 kcal', items: ['燕麦 50g + 牛奶 250ml + 奇亚籽 5g', '水煮蛋 1 个', '猕猴桃 1 个'] },
    lunch: { title: '午餐', calories: '约600 kcal', items: ['杂粮饭 100g（生重）', '红烧豆腐（老豆腐 200g，少油版）', '清炒西兰花 200g', '萝卜排骨汤（去油，排骨 2-3 块）'] },
    snack: { title: '加餐', calories: '约150 kcal', items: ['草莓 10 颗 或 无糖酸奶 150g'] },
    dinner: { title: '晚餐', calories: '约500 kcal', items: ['南瓜 200g', '煎三文鱼 120g', '凉拌菠菜 200g'] }
  }
};

/** 饮水计划 */
const WATER_PLAN = [
  { time: '起床后', amount: '300ml', note: '温水，促进代谢' },
  { time: '早餐前', amount: '200ml', note: '帮助消化' },
  { time: '上午', amount: '400ml', note: '工作期间小口喝' },
  { time: '午餐前', amount: '200ml', note: '增加饱腹感' },
  { time: '下午', amount: '400ml', note: '避免口渴才喝' },
  { time: '晚餐前', amount: '200ml', note: '控制晚餐食量' },
  { time: '晚间', amount: '300ml', note: '睡前1小时避免大量饮水' }
];

/** 四周运动计划 */
const WORKOUT_PLANS = {
  week1: {
    label: '第一周 · 适应期',
    subtitle: '建立运动习惯，重点在于"动起来"',
    schedule: [
      {
        day: '周一',
        title: '快走入门',
        total: '30 分钟',
        phases: [
          { name: '热身', content: '关节活动（踝、膝、髋、肩）+ 慢走', duration: '5 分钟' },
          { name: '主训练', content: '快走（能说话但稍有气喘的速度）', duration: '20 分钟' },
          { name: '拉伸', content: '小腿、大腿前侧/后侧、臀部拉伸', duration: '5 分钟' }
        ],
        tips: ['选择平坦路面，公园或操场塑胶跑道最佳', '步幅正常，不要刻意迈大步', '手臂自然摆动']
      },
      {
        day: '周三',
        title: '居家全身唤醒',
        total: '30 分钟',
        phases: [
          { name: '热身', content: '原地踏步 + 手臂画圈', duration: '5 分钟' },
          { name: '主训练', content: '动作循环做 2 轮（靠墙静蹲、椅子辅助深蹲、跪姿俯卧撑、平板支撑、臀桥、死虫式）', duration: '20 分钟' },
          { name: '拉伸', content: '全身拉伸', duration: '5 分钟' }
        ],
        tips: ['每个动作 30 秒，动作间休息 15 秒', '轮间休息 1 分钟']
      },
      {
        day: '周五',
        title: '低强度有氧',
        total: '35 分钟',
        phases: [
          { name: '热身', content: '慢速骑行/慢走', duration: '5 分钟' },
          { name: '主训练', content: '户外骑车 或 椭圆机（低阻力）', duration: '25 分钟' },
          { name: '拉伸', content: '下肢拉伸', duration: '5 分钟' }
        ],
        tips: ['循序渐进，不要急于增加强度']
      },
      {
        day: '周末',
        title: '主动恢复',
        total: '30-40 分钟',
        phases: [
          { name: '活动', content: '散步 20-30 分钟（配速随意）或 游泳 20 分钟', duration: '' },
          { name: '拉伸', content: '全身拉伸 10 分钟', duration: '10 分钟' }
        ],
        tips: ['放松恢复，为下周做准备']
      }
    ]
  },
  week2: {
    label: '第二周 · 巩固期',
    subtitle: '增加运动时长，加入更多力量元素',
    schedule: [
      {
        day: '周一',
        title: '快走进阶',
        total: '40 分钟',
        phases: [
          { name: '热身', content: '关节活动 + 慢走', duration: '5 分钟' },
          { name: '主训练', content: '间歇：快走 3 分钟 + 常速走 1 分钟，循环', duration: '30 分钟' },
          { name: '拉伸', content: '下肢拉伸', duration: '5 分钟' }
        ],
        tips: ['尝试间歇快走，提升心率']
      },
      {
        day: '周二',
        title: '上肢力量',
        total: '35 分钟',
        phases: [
          { name: '热身', content: '肩关节环绕 + 手臂摆动', duration: '5 分钟' },
          { name: '主训练', content: '力量循环 3 轮（跪姿俯卧撑、俯身哑铃划船、侧平举、哑铃弯举、平板支撑）', duration: '25 分钟' },
          { name: '拉伸', content: '上肢拉伸', duration: '5 分钟' }
        ],
        tips: ['每个动作 12-15 次，动作间休息 20 秒', '可用矿泉水瓶替代哑铃']
      },
      {
        day: '周四',
        title: '骑行/椭圆机',
        total: '40 分钟',
        phases: [
          { name: '热身', content: '低阻力骑行', duration: '5 分钟' },
          { name: '主训练', content: '中等阻力骑行，保持稳定节奏', duration: '30 分钟' },
          { name: '拉伸', content: '下肢拉伸', duration: '5 分钟' }
        ],
        tips: ['保持稳定节奏，不要忽快忽慢']
      },
      {
        day: '周六',
        title: '下肢力量 + 核心',
        total: '35 分钟',
        phases: [
          { name: '热身', content: '髋关节活动 + 原地踏步', duration: '5 分钟' },
          { name: '主训练', content: '力量循环 3 轮（椅子辅助深蹲、臀桥、侧卧抬腿、死虫式、鸟狗式、平板支撑）', duration: '25 分钟' },
          { name: '拉伸', content: '全身拉伸', duration: '5 分钟' }
        ],
        tips: ['臀桥顶峰停留 2 秒']
      }
    ]
  },
  week3: {
    label: '第三周 · 提升期',
    subtitle: '加入更多间歇元素，力量训练增加负重',
    schedule: [
      {
        day: '周一',
        title: '间歇快走',
        total: '40 分钟',
        phases: [
          { name: '热身', content: '慢走', duration: '5 分钟' },
          { name: '主训练', content: '快走 4 分钟 + 慢走 1 分钟，循环 6 组', duration: '30 分钟' },
          { name: '拉伸', content: '下肢拉伸', duration: '5 分钟' }
        ],
        tips: []
      },
      {
        day: '周二',
        title: '全身力量 A',
        total: '40 分钟',
        phases: [
          { name: '热身', content: '全身动态拉伸', duration: '5 分钟' },
          { name: '主训练', content: '力量 3 轮（高脚杯深蹲、俯卧撑、单臂哑铃划船、臀桥、平板支撑）', duration: '30 分钟' },
          { name: '拉伸', content: '全身拉伸', duration: '5 分钟' }
        ],
        tips: ['每个动作 12 次，休息 30 秒', '哑铃/壶铃 5-8kg']
      },
      {
        day: '周三',
        title: '骑行间歇',
        total: '40 分钟',
        phases: [
          { name: '热身', content: '低阻力骑行', duration: '5 分钟' },
          { name: '主训练', content: '中等阻力 3 分钟 + 高阻力冲刺 30 秒，循环 6 组', duration: '25 分钟' },
          { name: '放松', content: '低阻力骑行', duration: '5 分钟' },
          { name: '拉伸', content: '下肢拉伸', duration: '5 分钟' }
        ],
        tips: []
      },
      {
        day: '周四',
        title: '核心专项',
        total: '45 分钟',
        phases: [
          { name: '热身', content: '腹部激活', duration: '5 分钟' },
          { name: '主训练', content: '核心循环 3 轮（死虫式、鸟狗式、侧平板支撑、登山者、平板支撑、仰卧抬腿）', duration: '20 分钟' },
          { name: '有氧', content: '快走 15 分钟', duration: '15 分钟' },
          { name: '拉伸', content: '全身拉伸', duration: '5 分钟' }
        ],
        tips: ['登山者要慢速，膝盖找胸口']
      },
      {
        day: '周六',
        title: '全身力量 B',
        total: '40 分钟',
        phases: [
          { name: '热身', content: '动态拉伸', duration: '5 分钟' },
          { name: '主训练', content: '力量 3 轮（哑铃推举、罗马尼亚硬拉、俯卧撑、分腿蹲、哑铃弯举、平板支撑）', duration: '30 分钟' },
          { name: '拉伸', content: '全身拉伸', duration: '5 分钟' }
        ],
        tips: ['每个动作 12 次，休息 30 秒']
      },
      {
        day: '周日',
        title: '主动恢复',
        total: '30-40 分钟',
        phases: [
          { name: '活动', content: '游泳 30 分钟 或 散步 30-40 分钟', duration: '' },
          { name: '放松', content: '全身拉伸 + 泡沫轴放松', duration: '15 分钟' }
        ],
        tips: ['放松恢复']
      }
    ]
  },
  week4plus: {
    label: '第四周及以后 · 稳定期',
    subtitle: '建立可持续的运动习惯，保持每周 4-5 次运动',
    schedule: [
      { day: '周一', title: '间歇快走 / 户外徒步', total: '40-50 分钟', phases: [], tips: [] },
      { day: '周二', title: '全身力量训练 A', total: '40-45 分钟', phases: [], tips: [] },
      { day: '周三', title: '骑行/椭圆机/游泳（有氧）', total: '40 分钟', phases: [], tips: [] },
      { day: '周四', title: '休息 或 轻度活动（散步）', total: '20-30 分钟', phases: [], tips: [] },
      { day: '周五', title: '全身力量训练 B', total: '40-45 分钟', phases: [], tips: [] },
      { day: '周六', title: '长时有氧（骑行/游泳/快走）', total: '50-60 分钟', phases: [], tips: [] },
      { day: '周日', title: '主动恢复（拉伸/泡沫轴/散步）', total: '30 分钟', phases: [], tips: [] }
    ]
  }
};

/** 力量训练动作库 */
const EXERCISE_LIBRARY = {
  upper: [
    {
      name: '跪姿俯卧撑',
      steps: ['双膝跪地，双手略宽于肩', '身体从头到膝盖成一条直线', '胸部下沉至接近地面，再推起'],
      note: '腹部收紧，不要塌腰'
    },
    {
      name: '俯身哑铃划船',
      steps: ['一手扶椅子，同侧膝盖跪椅', '另一手持哑铃，背部挺直', '哑铃拉向腰部，挤压背部肌肉'],
      note: '不要耸肩，用背部发力而非手臂'
    },
    {
      name: '侧平举',
      steps: ['站姿，手持哑铃/矿泉水', '双臂向两侧抬起至肩高', '缓慢放下'],
      note: '肘部微屈，不要借力甩动'
    }
  ],
  lower: [
    {
      name: '椅子辅助深蹲',
      steps: ['双脚与肩同宽，脚尖微外八', '臀部向后下方坐，轻触椅子即起'],
      note: '膝盖方向与脚尖一致，不要内扣'
    },
    {
      name: '高脚杯深蹲',
      steps: ['双手持哑铃于胸前', '深蹲至大腿与地面平行'],
      note: '背部挺直，核心收紧'
    },
    {
      name: '臀桥',
      steps: ['仰卧，双脚平放，屈膝', '臀部向上顶起，至身体成一条直线', '顶峰停留 2-3 秒，缓慢放下'],
      note: '用臀部发力，不要过度顶腰'
    },
    {
      name: '罗马尼亚硬拉',
      steps: ['站姿，手持哑铃/壶铃', '臀部向后推，上身前倾，哑铃沿腿下滑', '感受到大腿后侧拉伸后，臀部发力站直'],
      note: '背部始终挺直，膝盖微屈固定'
    }
  ],
  core: [
    {
      name: '平板支撑',
      steps: ['前臂撑地，肘关节在肩膀正下方', '身体从头到脚成一条直线'],
      note: '不要塌腰或撅屁股，收腹夹臀'
    },
    {
      name: '死虫式',
      steps: ['仰卧，手臂上举垂直地面，大腿抬起屈膝 90°', '对侧手脚缓慢下放（手向头后，脚向地面），腰部始终贴地'],
      note: '如果腰拱起，说明核心不够，减小下放幅度'
    },
    {
      name: '鸟狗式',
      steps: ['四点跪姿（手在肩下，膝在臀下）', '对侧手脚同时向前后伸展'],
      note: '保持躯干稳定，不要左右晃动'
    }
  ]
};

/** 热身动作 */
const WARMUP_EXERCISES = [
  { name: '原地踏步/慢走', duration: '2 分钟', purpose: '提升心率' },
  { name: '踝关节环绕', duration: '每侧 10 圈', purpose: '激活脚踝' },
  { name: '膝关节环绕', duration: '每侧 10 圈', purpose: '润滑膝盖' },
  { name: '髋关节环绕', duration: '每侧 10 圈', purpose: '激活髋部' },
  { name: '手臂画圈', duration: '前后各 10 圈', purpose: '活动肩关节' },
  { name: '开合跳（可选）', duration: '30 秒', purpose: '全身热身' }
];

/** 拉伸动作 */
const STRETCH_EXERCISES = {
  lower: [
    { name: '小腿拉伸', method: '弓箭步，后脚跟着地', target: '小腿后侧', duration: '每侧 30 秒' },
    { name: '大腿前侧拉伸', method: '手拉脚背，膝盖并拢', target: '股四头肌', duration: '每侧 30 秒' },
    { name: '大腿后侧拉伸', method: '坐姿前屈', target: '腘绳肌', duration: '30 秒' },
    { name: '臀部拉伸', method: '鸽子式或坐姿跷二郎腿前屈', target: '臀肌', duration: '每侧 30 秒' },
    { name: '髋屈肌拉伸', method: '单膝跪地，身体前倾', target: '髋前侧', duration: '每侧 30 秒' }
  ],
  upper: [
    { name: '胸部拉伸', method: '双手背后交叉，挺胸', target: '胸肌', duration: '30 秒' },
    { name: '肩部拉伸', method: '一手横过胸前按压', target: '三角肌后束', duration: '每侧 30 秒' },
    { name: '背部拉伸', method: '双手前伸，上身下压', target: '背阔肌', duration: '30 秒' },
    { name: '三头肌拉伸', method: '手肘弯曲过头按压', target: '肱三头肌', duration: '每侧 30 秒' }
  ]
};

/** 星期映射（中文 → 索引） */
const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const DAY_KEYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
