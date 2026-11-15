/**
 * ふじみ野スポーツクラブ - リアルタイム活動日历 & 予約枠コンポーネント
 * 支持 API 1: /api/public/group-activities/{id}/calendar
 * 包含智能 Fallback: /api/group-activities/{id}/booking-data
 */
(function () {
    const API_BASE = 'https://fujimirv.jptungri.shop';
    const ACTIVITY_ID = 38;

    // 多语言字典
    const I18N = {
        ja: {
            title: '活動開催カレンダー・予約状況',
            desc: 'リアルタイムの枠の空き状況（残席数）を確認し、希望日をクリックして予約できます。',
            legend: '凡例:',
            legendAvailable: '空きあり（予約可）',
            legendFull: '満席',
            legendNone: '予定なし / 過去',
            daysOfWeek: ['日', '月', '火', '水', '木', '金', '土'],
            prevMonth: '◀ 前月',
            nextMonth: '次月 ▶',
            todayBtn: '今月',
            loadingText: '日程データを読み込み中...',
            errorText: '日程の読み込みに失敗しました。再試行してください。',
            retryBtn: '再読み込み',
            selectDatePrompt: 'カレンダーの日付をクリックすると、その日の開催枠・時間・場所および予約ボタンが表示されます',
            noSlotsOnDate: 'この日は開催予定の枠がありません',
            slotsForDate: (date, count) => `🗓️ ${date} の開催枠（${count}件）`,
            remainingText: (rem, cap) => `残り ${rem}名 / 定員 ${cap}名`,
            unlimitedText: '定員制限なし',
            bookBtn: '予約する ↗',
            fullBtn: '満席',
            pastSlot: '終了',
            openDirectly: '予約システムで直接開く ↗'
        },
        zh: {
            title: '活动举办日历・实时预约状态',
            desc: '支持实时查看活动排期与剩余名额，点击指定日期即可查看详情并在线预约。',
            legend: '图例:',
            legendAvailable: '有空位（可预约）',
            legendFull: '已满席',
            legendNone: '无排期 / 已过期',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            prevMonth: '◀ 上月',
            nextMonth: '下月 ▶',
            todayBtn: '本月',
            loadingText: '正在加载排期数据...',
            errorText: '排期加载失败，请重试。',
            retryBtn: '重新加载',
            selectDatePrompt: '点击上方日历中的日期，即可查看当天的活动场次、时间、场地及在线预约按钮',
            noSlotsOnDate: '所选日期暂无活动安排',
            slotsForDate: (date, count) => `🗓️ ${date} 的活动排期（${count}场）`,
            remainingText: (rem, cap) => `剩余 ${rem}名 / 总名额 ${cap}名`,
            unlimitedText: '不限人数',
            bookBtn: '立即预约 ↗',
            fullBtn: '已满席',
            pastSlot: '已结束',
            openDirectly: '在主站预约系统打开 ↗'
        },
        'zh-tw': {
            title: '活動舉辦日曆・即時預約狀態',
            desc: '支援即時查看活動排程與剩餘名額，點擊指定日期即可查看詳情並線上預約。',
            legend: '圖例:',
            legendAvailable: '有空位（可預約）',
            legendFull: '已滿席',
            legendNone: '無排程 / 已過期',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            prevMonth: '◀ 上月',
            nextMonth: '下月 ▶',
            todayBtn: '本月',
            loadingText: '正在載入排程資料...',
            errorText: '排程載入失敗，請重試。',
            retryBtn: '重新載入',
            selectDatePrompt: '點擊上方日曆中的日期，即可查看當天的活動場次、時間、場地及線上預約按鈕',
            noSlotsOnDate: '所選日期暫無活動安排',
            slotsForDate: (date, count) => `🗓️ ${date} 的活動排程（${count}場）`,
            remainingText: (rem, cap) => `剩餘 ${rem}名 / 總名額 ${cap}名`,
            unlimitedText: '不限人數',
            bookBtn: '立即預約 ↗',
            fullBtn: '已滿席',
            pastSlot: '已結束',
            openDirectly: '在主站預約系統打開 ↗'
        },
        en: {
            title: 'Activity Calendar & Booking Slots',
            desc: 'Check real-time slot availability, remaining seats, and reserve your spot directly.',
            legend: 'Legend:',
            legendAvailable: 'Available',
            legendFull: 'Full',
            legendNone: 'No Slots / Past',
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            prevMonth: '◀ Prev',
            nextMonth: 'Next ▶',
            todayBtn: 'Today',
            loadingText: 'Loading schedule data...',
            errorText: 'Failed to load schedule. Please retry.',
            retryBtn: 'Retry',
            selectDatePrompt: 'Click on a date above to view available sessions, venue details, and reservation buttons',
            noSlotsOnDate: 'No sessions scheduled for this date',
            slotsForDate: (date, count) => `🗓️ Sessions on ${date} (${count})`,
            remainingText: (rem, cap) => `${rem} spots left / Capacity: ${cap}`,
            unlimitedText: 'Unlimited capacity',
            bookBtn: 'Book Now ↗',
            fullBtn: 'Full',
            pastSlot: 'Ended',
            openDirectly: 'Open in Booking System ↗'
        },
        vi: {
            title: 'Lịch hoạt động & Tình trạng đặt chỗ',
            desc: 'Xem tình trạng chỗ trống theo thời gian thực và đặt chỗ tham gia.',
            legend: 'Chú thích:',
            legendAvailable: 'Còn chỗ',
            legendFull: 'Đã hết chỗ',
            legendNone: 'Không có lịch / Đã qua',
            daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            prevMonth: '◀ Tháng trước',
            nextMonth: 'Tháng sau ▶',
            todayBtn: 'Tháng này',
            loadingText: 'Đang tải dữ liệu lịch...',
            errorText: 'Tải lịch thất bại. Vui lòng thử lại.',
            retryBtn: 'Thử lại',
            selectDatePrompt: 'Nhấn vào ngày trên lịch để xem các buổi tập, thời gian, địa điểm và nút đặt chỗ',
            noSlotsOnDate: 'Không có buổi tập nào vào ngày này',
            slotsForDate: (date, count) => `🗓️ Buổi tập ngày ${date} (${count})`,
            remainingText: (rem, cap) => `Còn ${rem} chỗ / Tổng ${cap} chỗ`,
            unlimitedText: 'Không giới hạn',
            bookBtn: 'Đặt chỗ ngay ↗',
            fullBtn: 'Đã kín chỗ',
            pastSlot: 'Đã kết thúc',
            openDirectly: 'Mở trong hệ thống đặt chỗ ↗'
        }
    };

    function getLang() {
        const docLang = (window.CALENDAR_LANG || document.documentElement.lang || 'ja').toLowerCase();
        if (docLang.includes('zh-tw') || docLang.includes('zh-hant')) return 'zh-tw';
        if (docLang.includes('zh')) return 'zh';
        if (docLang.includes('en')) return 'en';
        if (docLang.includes('vi')) return 'vi';
        return 'ja';
    }

    const t = I18N[getLang()] || I18N.ja;

    // 当前状态
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1; // 1-12
    let selectedDate = null;
    let calendarDaysData = []; // calendar array from API
    let dailySlotsData = {};   // { 'YYYY-MM-DD': [ ...slots ] }

    function padZero(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function formatYearMonth(y, m) {
        return `${y}-${padZero(m)}`;
    }

    function formatFullDate(y, m, d) {
        return `${y}-${padZero(m)}-${padZero(d)}`;
    }

    // 初始化日历 DOM
    function initDOM() {
        const container = document.getElementById('calendar-app');
        if (!container) return;

        container.innerHTML = `
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
            <!-- 头部 -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>📅</span> <span>${t.title}</span>
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">
                        ${t.desc}
                    </p>
                </div>
                <!-- 切换月份按钮组 -->
                <div class="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
                    <button id="cal-prev-btn" class="px-2.5 py-1.5 rounded-lg hover:bg-white hover:shadow-xs transition text-slate-700 font-bold" title="${t.prevMonth}">
                        ${t.prevMonth}
                    </button>
                    <span id="cal-month-label" class="px-3 py-1 font-bold text-slate-900 text-sm min-w-[110px] text-center select-none">
                        ${currentYear}年 ${currentMonth}月
                    </span>
                    <button id="cal-next-btn" class="px-2.5 py-1.5 rounded-lg hover:bg-white hover:shadow-xs transition text-slate-700 font-bold" title="${t.nextMonth}">
                        ${t.nextMonth}
                    </button>
                    <button id="cal-today-btn" class="ml-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition font-bold">
                        ${t.todayBtn}
                    </button>
                </div>
            </div>

            <!-- 图例说明 -->
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <div class="flex flex-wrap items-center gap-4">
                    <span class="font-bold text-slate-700">${t.legend}</span>
                    <span class="inline-flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> ${t.legendAvailable}
                    </span>
                    <span class="inline-flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> ${t.legendFull}
                    </span>
                    <span class="inline-flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-slate-300"></span> ${t.legendNone}
                    </span>
                </div>
                <a href="${API_BASE}/group-activity-booking_ja.html?activityId=${ACTIVITY_ID}" target="_blank" rel="noopener noreferrer"
                    class="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 transition">
                    ${t.openDirectly}
                </a>
            </div>

            <!-- 日历表格 -->
            <div class="space-y-2">
                <!-- 星期标头 -->
                <div class="grid grid-cols-7 gap-1 text-center font-bold text-xs py-2 bg-slate-100/90 rounded-xl text-slate-600 select-none">
                    <div class="text-rose-500">${t.daysOfWeek[0]}</div>
                    <div>${t.daysOfWeek[1]}</div>
                    <div>${t.daysOfWeek[2]}</div>
                    <div>${t.daysOfWeek[3]}</div>
                    <div>${t.daysOfWeek[4]}</div>
                    <div>${t.daysOfWeek[5]}</div>
                    <div class="text-indigo-600">${t.daysOfWeek[6]}</div>
                </div>

                <!-- 日历格子网格 -->
                <div id="cal-grid" class="grid grid-cols-7 gap-1.5 min-h-[300px] relative">
                    <!-- 动态生成 -->
                </div>
            </div>

            <!-- 选中日期枠列表卡片 -->
            <div id="cal-slots-section" class="border-t border-slate-100 pt-5 space-y-3">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 id="cal-selected-header" class="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>🗓️</span> <span>${t.selectDatePrompt}</span>
                    </h4>
                    <span id="cal-slots-count-badge" class="text-xs text-slate-500 font-medium"></span>
                </div>

                <div id="cal-slots-container" class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <!-- 动态插入卡片 -->
                </div>
            </div>
        </div>
        `;

        // 绑定事件
        document.getElementById('cal-prev-btn').addEventListener('click', () => changeMonth(-1));
        document.getElementById('cal-next-btn').addEventListener('click', () => changeMonth(1));
        document.getElementById('cal-today-btn').addEventListener('click', () => goToToday());
    }

    function changeMonth(delta) {
        currentMonth += delta;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        } else if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        updateMonthLabel();
        loadCalendar();
    }

    function goToToday() {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1;
        updateMonthLabel();
        loadCalendar();
    }

    function updateMonthLabel() {
        const el = document.getElementById('cal-month-label');
        if (el) el.textContent = `${currentYear}年 ${currentMonth}月`;
    }

    // 显示骨架/加载动画
    function renderLoading() {
        const grid = document.getElementById('cal-grid');
        if (!grid) return;
        grid.innerHTML = `
            <div class="col-span-7 flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <div class="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-xs font-medium">${t.loadingText}</p>
            </div>
        `;
    }

    // 主数据加载流程：优先调用新 API，失败时调用备选接口自算
    async function loadCalendar() {
        renderLoading();
        const yearMonthStr = formatYearMonth(currentYear, currentMonth);

        // 1. 尝试新 API
        const newApiUrl = `${API_BASE}/api/public/group-activities/${ACTIVITY_ID}/calendar?month=${yearMonthStr}`;
        try {
            const resp = await fetch(newApiUrl, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.calendar) {
                    processCalendarData(data);
                    return;
                }
            }
        } catch (err) {
            console.warn('[Calendar] New API failed or not permitted, trying fallback adapter...', err);
        }

        // 2. 备用源：/api/group-activities/38/booking-data
        const fallbackUrl = `${API_BASE}/api/group-activities/${ACTIVITY_ID}/booking-data?_=${Date.now()}`;
        try {
            const fbResp = await fetch(fallbackUrl, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            if (fbResp.ok) {
                const fbData = await fbResp.json();
                const adapted = adaptBookingData(fbData, currentYear, currentMonth);
                processCalendarData(adapted);
                return;
            }
        } catch (fbErr) {
            console.error('[Calendar] Both endpoints failed:', fbErr);
        }

        // 失败展示重试按钮
        const grid = document.getElementById('cal-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-7 flex flex-col items-center justify-center py-16 text-slate-500 gap-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <span class="text-2xl">⚠️</span>
                    <p class="text-xs">${t.errorText}</p>
                    <button onclick="window.refreshSportsCalendar && window.refreshSportsCalendar()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">
                        ${t.retryBtn}
                    </button>
                </div>
            `;
        }
    }

    // 将老接口数据组装为标准日历数据结构
    function adaptBookingData(raw, year, month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const settings = raw.settings || [];
        const reservationCounts = raw.reservationCounts || {};
        const overrides = raw.slotTitleOverrides || [];
        const todayStr = new Date().toISOString().slice(0, 10);

        const calendarList = [];
        const dailySlots = {};

        const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const JA_DAYS = ['日', '月', '火', '水', '木', '金', '土'];

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = formatFullDate(year, month, d);
            const dateObj = new Date(year, month - 1, d);
            const dayOfWeekIdx = dateObj.getDay();
            const dayOfWeekName = DAY_NAMES[dayOfWeekIdx];

            // 查找当天的 slots
            const slotsForThisDay = [];

            settings.forEach(setting => {
                let matches = false;
                if (setting.registrationMode === 'SINGLE' && setting.targetDate === dateStr) {
                    matches = true;
                } else if (setting.registrationMode === 'BULK') {
                    const start = setting.bulkStartDate || '2000-01-01';
                    const end = setting.bulkEndDate || '2099-12-31';
                    if (dateStr >= start && dateStr <= end && setting.dayType === dayOfWeekName) {
                        matches = true;
                    }
                }

                if (matches) {
                    const key = `${setting.id}|${dateStr}`;
                    const reserved = reservationCounts[key] || 0;
                    const cap = setting.maxPeople || 10;
                    const remaining = Math.max(0, cap - reserved);
                    const isFull = remaining <= 0;
                    const isPast = dateStr < todayStr;

                    // 检查 overrides
                    let title = setting.title || 'バドミントン';
                    let loc = setting.location || '市民体育館';
                    let startT = setting.startTime || '18:00';
                    let endT = setting.endTime || '20:00';

                    const override = overrides.find(o => o.timeSettingId === setting.id && o.targetDate === dateStr);
                    if (override) {
                        if (override.title) title = override.title;
                        if (override.location) loc = override.location;
                        if (override.startTime) startT = override.startTime;
                        if (override.endTime) endT = override.endTime;
                    }

                    slotsForThisDay.push({
                        slotId: setting.id,
                        title: title,
                        startTime: startT,
                        endTime: endT,
                        timeRange: `${startT} - ${endT}`,
                        location: loc,
                        capacity: cap,
                        reservedPeople: reserved,
                        remainingPeople: remaining,
                        isUnlimited: false,
                        isFull: isFull,
                        isPast: isPast,
                        bookingUrl: `/group-activity-booking_ja.html?activityId=${ACTIVITY_ID}&date=${dateStr}&slotId=${setting.id}`
                    });
                }
            });

            dailySlots[dateStr] = slotsForThisDay;

            // 汇总当天状态
            const hasSlots = slotsForThisDay.length > 0;
            const totalRemaining = slotsForThisDay.reduce((acc, cur) => acc + cur.remainingPeople, 0);
            const allFull = hasSlots && slotsForThisDay.every(s => s.isFull);
            const isPast = dateStr < todayStr;

            let status = 'NONE';
            let statusLabel = '-';
            if (hasSlots) {
                if (isPast) {
                    status = 'PAST';
                    statusLabel = totalRemaining > 0 ? `残${totalRemaining}` : '満';
                } else if (allFull) {
                    status = 'FULL';
                    statusLabel = '満';
                } else {
                    status = 'AVAILABLE';
                    statusLabel = `残${totalRemaining}`;
                }
            }

            calendarList.push({
                date: dateStr,
                day: d,
                dayOfWeek: dayOfWeekName,
                dayOfWeekJa: JA_DAYS[dayOfWeekIdx],
                available: hasSlots,
                hasUnlimited: false,
                isFull: allFull,
                isPast: isPast,
                totalRemaining: totalRemaining,
                slotsCount: slotsForThisDay.length,
                status: status,
                statusLabel: hasSlots ? statusLabel : ''
            });
        }

        return {
            yearMonth: formatYearMonth(year, month),
            calendar: calendarList,
            dailySlots: dailySlots
        };
    }

    // 渲染日历数据
    function processCalendarData(data) {
        calendarDaysData = data.calendar || [];
        dailySlotsData = data.dailySlots || {};

        renderGrid();

        // 默认选中逻辑：优先选中传入的 selectedDate，或者选今天，或者当月第一个有排期的未来日期
        const todayStr = new Date().toISOString().slice(0, 10);
        let targetDateToSelect = data.selectedDate;

        if (!targetDateToSelect) {
            const todaySlot = calendarDaysData.find(d => d.date === todayStr && d.available);
            if (todaySlot) {
                targetDateToSelect = todayStr;
            } else {
                const firstAvailable = calendarDaysData.find(d => d.available && !d.isPast);
                if (firstAvailable) {
                    targetDateToSelect = firstAvailable.date;
                } else {
                    // 若无未来排期，取当月第一个有排期的
                    const anySlot = calendarDaysData.find(d => d.available);
                    targetDateToSelect = anySlot ? anySlot.date : null;
                }
            }
        }

        if (targetDateToSelect) {
            selectDate(targetDateToSelect);
        } else {
            clearSlotsView();
        }
    }

    // 生成网格
    function renderGrid() {
        const grid = document.getElementById('cal-grid');
        if (!grid) return;

        // 计算 1 号是周几 (0 = Sun, 1 = Mon, ..., 6 = Sat)
        const firstDayIdx = new Date(currentYear, currentMonth - 1, 1).getDay();

        let html = '';

        // 补足 1 号前面的空白格子
        for (let i = 0; i < firstDayIdx; i++) {
            html += `<div class="bg-slate-50/50 rounded-xl border border-transparent min-h-[58px] sm:min-h-[70px]"></div>`;
        }

        const todayStr = new Date().toISOString().slice(0, 10);

        // 渲染每个日子
        calendarDaysData.forEach(dayItem => {
            const isToday = dayItem.date === todayStr;
            const isSelected = dayItem.date === selectedDate;
            const hasSlots = dayItem.available;
            const isPast = dayItem.isPast;
            const isFull = dayItem.isFull;

            // 基础样式
            let borderClass = 'border-slate-100';
            let bgClass = 'bg-white hover:bg-slate-50';
            let cursorClass = hasSlots ? 'cursor-pointer' : 'cursor-default opacity-60';
            let ringClass = '';

            if (isSelected) {
                ringClass = 'ring-2 ring-indigo-600 bg-indigo-50/60 border-indigo-400 font-extrabold shadow-sm';
            } else if (isToday) {
                ringClass = 'border-indigo-300 bg-indigo-50/30';
            }

            // 状态徽章
            let badgeHtml = '';
            if (hasSlots) {
                if (isPast) {
                    badgeHtml = `<span class="mt-1 text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-500">${dayItem.statusLabel || '-'}</span>`;
                } else if (isFull) {
                    badgeHtml = `<span class="mt-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-rose-100 text-rose-700 animate-pulse">${dayItem.statusLabel || t.fullBtn}</span>`;
                } else {
                    badgeHtml = `<span class="mt-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 shadow-xs">${dayItem.statusLabel}</span>`;
                }
            }

            // 星期文字颜色 (周日红，周六蓝)
            const dateObj = new Date(dayItem.date);
            const dayOfWeek = dateObj.getDay();
            let dayNumColor = 'text-slate-800';
            if (dayOfWeek === 0) dayNumColor = 'text-rose-600';
            if (dayOfWeek === 6) dayNumColor = 'text-indigo-600';

            html += `
            <div data-date="${dayItem.date}"
                 class="cal-day-cell relative rounded-xl border p-1.5 sm:p-2 min-h-[58px] sm:min-h-[72px] flex flex-col justify-between items-center transition-all ${bgClass} ${borderClass} ${cursorClass} ${ringClass}">
                <div class="flex items-center justify-between w-full">
                    <span class="text-xs sm:text-sm font-bold ${dayNumColor}">
                        ${dayItem.day}
                    </span>
                    ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-indigo-600" title="今日"></span>' : ''}
                </div>
                ${badgeHtml}
            </div>
            `;
        });

        grid.innerHTML = html;

        // 绑定点击事件
        grid.querySelectorAll('.cal-day-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const date = cell.getAttribute('data-date');
                if (date) selectDate(date);
            });
        });
    }

    // 选中指定日期
    function selectDate(dateStr) {
        selectedDate = dateStr;

        // 更新日历网格的高亮样式
        const grid = document.getElementById('cal-grid');
        if (grid) {
            grid.querySelectorAll('.cal-day-cell').forEach(cell => {
                const d = cell.getAttribute('data-date');
                if (d === selectedDate) {
                    cell.classList.add('ring-2', 'ring-indigo-600', 'bg-indigo-50/60', 'border-indigo-400', 'font-extrabold', 'shadow-sm');
                } else {
                    cell.classList.remove('ring-2', 'ring-indigo-600', 'bg-indigo-50/60', 'border-indigo-400', 'font-extrabold', 'shadow-sm');
                }
            });
        }

        renderSlotsView(dateStr);
    }

    // 渲染下方枠详情
    function renderSlotsView(dateStr) {
        const header = document.getElementById('cal-selected-header');
        const countBadge = document.getElementById('cal-slots-count-badge');
        const container = document.getElementById('cal-slots-container');
        if (!container) return;

        const slots = dailySlotsData[dateStr] || [];

        if (header) {
            header.innerHTML = `<span>🗓️</span> <span>${t.slotsForDate(dateStr, slots.length)}</span>`;
        }
        if (countBadge) {
            countBadge.textContent = slots.length > 0 ? `${slots.length} 件` : '';
        }

        if (slots.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-8 text-center text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                    ${t.noSlotsOnDate}
                </div>
            `;
            return;
        }

        let html = '';
        slots.forEach(slot => {
            const isFull = slot.isFull;
            const isPast = slot.isPast;

            let badgeHtml = '';
            let actionBtnHtml = '';

            const bookingUrl = slot.bookingUrl.startsWith('http')
                ? slot.bookingUrl
                : `${API_BASE}${slot.bookingUrl}`;

            if (isPast) {
                badgeHtml = `<span class="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md">${t.pastSlot}</span>`;
                actionBtnHtml = `
                    <button disabled class="w-full sm:w-auto bg-slate-200 text-slate-400 cursor-not-allowed font-semibold px-4 py-2 rounded-xl text-xs">
                        ${t.pastSlot}
                    </button>
                `;
            } else if (isFull) {
                badgeHtml = `<span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md">${t.fullBtn}</span>`;
                actionBtnHtml = `
                    <button disabled class="w-full sm:w-auto bg-rose-50 text-rose-400 border border-rose-200 cursor-not-allowed font-semibold px-4 py-2 rounded-xl text-xs">
                        ${t.fullBtn}
                    </button>
                `;
            } else {
                badgeHtml = `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">${t.remainingText(slot.remainingPeople, slot.capacity)}</span>`;
                actionBtnHtml = `
                    <a href="${bookingUrl}" target="_blank" rel="noopener noreferrer"
                       class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5">
                       <span>👉</span> ${t.bookBtn}
                    </a>
                `;
            }

            html += `
            <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between gap-3 group">
                <div class="space-y-2">
                    <div class="flex items-start justify-between gap-2">
                        <h5 class="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                            ${slot.title}
                        </h5>
                        ${badgeHtml}
                    </div>

                    <div class="space-y-1.5 text-xs text-slate-600">
                        <p class="flex items-center gap-1.5">
                            <span class="text-indigo-500 font-bold">⏰</span>
                            <span class="font-semibold text-slate-800">${slot.timeRange || (slot.startTime + ' - ' + slot.endTime)}</span>
                        </p>
                        <p class="flex items-center gap-1.5">
                            <span class="text-rose-500 font-bold">📍</span>
                            <span>${slot.location || 'ふじみ野市施設'}</span>
                        </p>
                    </div>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-end">
                    ${actionBtnHtml}
                </div>
            </div>
            `;
        });

        container.innerHTML = html;
    }

    function clearSlotsView() {
        const container = document.getElementById('cal-slots-container');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    ${t.selectDatePrompt}
                </div>
            `;
        }
    }

    // 全局刷新钩子
    window.refreshSportsCalendar = function () {
        loadCalendar();
    };

    // DOM 加载完成启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initDOM();
            loadCalendar();
        });
    } else {
        initDOM();
        loadCalendar();
    }
})();
