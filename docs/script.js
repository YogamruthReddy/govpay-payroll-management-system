document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Navbar Blur on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 14, 0.8)';
            navbar.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        } else {
            navbar.style.background = 'rgba(255,255,255,0.03)';
            navbar.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
        }
    });

    // 3. Subtle Parallax for Glow Orbs
    const orb1 = document.querySelector('.hero .orb-1');
    const orb2 = document.querySelector('.hero .orb-2');
    if(window.innerWidth > 768 && orb1 && orb2) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            orb1.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
            orb2.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
        });
    }

    // 4. Admin Dashboard Number Counter
    const counterEle = document.querySelector('.animate-counter');
    if(counterEle) {
        let hasCounted = false;
        const countObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !hasCounted) {
                const target = parseInt(counterEle.getAttribute('data-target'));
                let current = 0;
                const increment = target / 60; // 60 frames
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        counterEle.innerText = `₹${Math.ceil(current).toLocaleString('en-IN')}`;
                        requestAnimationFrame(updateCount);
                    } else {
                        counterEle.innerText = `₹${target.toLocaleString('en-IN')}`;
                    }
                };
                updateCount();
                hasCounted = true;
                countObserver.disconnect();
            }
        });
        countObserver.observe(counterEle);
    }

    // --- INTERACTIVE DEMOS --- //

    // DEMO 1: Dynamic Rule Engine Calculator
    const basicInput = document.getElementById('basic-input');
    const ruleToggles = document.querySelectorAll('.rule-toggle');
    const totalAllowancesEl = document.getElementById('total-allowances');
    const totalDeductionsEl = document.getElementById('total-deductions');
    const netPayEl = document.getElementById('net-pay-val');

    const calculatePayroll = () => {
        if (!basicInput) return;
        const basic = parseFloat(basicInput.value) || 0;
        let totalAllowances = 0;
        let totalDeductions = 0;

        ruleToggles.forEach(toggle => {
            if(toggle.checked) {
                const isAllowance = toggle.classList.contains('allowance');
                const type = toggle.getAttribute('data-type');
                const val = parseFloat(toggle.getAttribute('data-val'));
                
                let calculatedValue = 0;
                if(type === 'percent') {
                    calculatedValue = basic * (val / 100);
                } else if(type === 'fixed') {
                    calculatedValue = val;
                }

                if(isAllowance) totalAllowances += calculatedValue;
                else totalDeductions += calculatedValue;
            }
        });

        const netPay = basic + totalAllowances - totalDeductions;
        totalAllowancesEl.innerText = `+ ₹${totalAllowances.toLocaleString('en-IN')}`;
        totalDeductionsEl.innerText = `- ₹${totalDeductions.toLocaleString('en-IN')}`;
        netPayEl.innerText = Math.max(0, netPay).toLocaleString('en-IN');
    };

    if (basicInput) {
        basicInput.addEventListener('input', calculatePayroll);
        ruleToggles.forEach(t => t.addEventListener('change', calculatePayroll));
        calculatePayroll(); 
    }


    // DEMO 2: RBAC Feature Visualizer
    const rbacBtns = document.querySelectorAll('.rbac-btn');
    const rbacActions = document.querySelectorAll('.rbac-action');

    rbacBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rbacBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedRole = btn.getAttribute('data-role');
            rbacActions.forEach(action => {
                let hasAccess = false;
                if (selectedRole === 'admin') {
                    if(!action.classList.contains('employee-only')) hasAccess = true;
                } else if (selectedRole === 'officer') {
                    if(action.classList.contains('officer-only') || action.classList.contains('employee-view')) hasAccess = true;
                } else if (selectedRole === 'employee') {
                    if(action.classList.contains('employee-only')) hasAccess = true;
                }

                if(hasAccess) {
                    action.classList.remove('locked');
                } else {
                    action.classList.add('locked');
                }
            });
        });
    });


    // DEMO 3: Leave Overlap Validator (Calendar)
    const calDays = document.querySelectorAll('.cal-day.selectable');
    const checkBtn = document.getElementById('check-leave-btn');
    const overlapAlert = document.getElementById('overlap-alert');
    let selectedDates = [];

    calDays.forEach(day => {
        day.addEventListener('click', () => {
            const dStr = day.getAttribute('data-date');
            if(!dStr) return;
            const dt = parseInt(dStr);

            if(selectedDates.includes(dt)) {
                selectedDates = selectedDates.filter(d => d !== dt);
                day.classList.remove('selected');
            } else {
                selectedDates.push(dt);
                day.classList.add('selected');
            }
            
            // Re-enable button if something is selected
            if(selectedDates.length > 0) {
                checkBtn.removeAttribute('disabled');
                checkBtn.classList.remove('disabled');
            } else {
                checkBtn.setAttribute('disabled', 'true');
                checkBtn.classList.add('disabled');
                overlapAlert.classList.add('hidden');
            }
        });
    });

    if(checkBtn) {
        checkBtn.addEventListener('click', () => {
            overlapAlert.classList.add('hidden');
            
            // Simulated backend logic: Check if dates [11, 15] overlap with [12,13,14]
            const isOverlap = selectedDates.some(dt => [11, 12, 13, 14, 15].includes(dt) && ([12, 13, 14].includes(dt) || (Math.min(...selectedDates) <= 12 && Math.max(...selectedDates) >= 14)));
            const directHit = selectedDates.includes(12) || selectedDates.includes(13) || selectedDates.includes(14);
            const rangeHits = Math.min(...selectedDates) <= 12 && Math.max(...selectedDates) >= 14;

            if (directHit || rangeHits) {
                // Shake the selected ones near the boundary
                document.querySelectorAll('.cal-day.selected').forEach(el => {
                    el.classList.add('shake-error');
                    setTimeout(() => el.classList.remove('shake-error'), 500);
                });
                
                // Show Alert
                setTimeout(() => overlapAlert.classList.remove('hidden'), 100);
                
                // Shake the button
                checkBtn.classList.add('shake-error');
                setTimeout(() => checkBtn.classList.remove('shake-error'), 500);
            } else {
                // Success
                checkBtn.innerHTML = `<i data-lucide="check" class="icon-small text-emerald"></i> Approved`;
                lucide.createIcons();
                setTimeout(() => {
                    checkBtn.innerHTML = `Apply for Selected Leave`;
                }, 2000);
            }
        });
    }

    // DEMO 4: Anomaly Detection Graph
    const triggerAnomalyBtn = document.getElementById('trigger-anomaly-btn');
    const anomalyBar = document.getElementById('anomaly-bar');
    const anomalyLog = document.getElementById('anomaly-log');
    
    if(triggerAnomalyBtn && anomalyBar && anomalyLog) {
        let isSimulating = false;
        triggerAnomalyBtn.addEventListener('click', () => {
            if(isSimulating) return;
            isSimulating = true;
            
            triggerAnomalyBtn.innerHTML = `<div class="w-4 h-4 border-2 border-rose border-t-transparent rounded-full animate-spin"></div> Parsing`;
            
            setTimeout(() => {
                // Spike the graph
                anomalyBar.style.height = '85%';
                anomalyBar.classList.remove('safe');
                anomalyBar.classList.add('danger');
                
                // Show floating log
                setTimeout(() => {
                    anomalyLog.classList.remove('opacity-0', 'translate-y-4');
                    anomalyLog.classList.add('opacity-100', 'translate-y-0');
                    triggerAnomalyBtn.innerHTML = `<i data-lucide="x" class="text-rose"></i> Blocked`;
                    lucide.createIcons();
                    
                    // Reset after 4 seconds
                    setTimeout(() => {
                        anomalyBar.style.height = '0%';
                        anomalyBar.classList.remove('danger');
                        anomalyBar.classList.add('safe');
                        anomalyLog.classList.remove('opacity-100', 'translate-y-0');
                        anomalyLog.classList.add('opacity-0', 'translate-y-4');
                        triggerAnomalyBtn.innerHTML = `<i data-lucide="zap"></i> Simulate Fraud`;
                        lucide.createIcons();
                        isSimulating = false;
                    }, 4000);

                }, 400); // Wait for transition
            }, 800); // Simulated delay
        });
    }


    // DEMO 5: Token Intercept Terminal Animation
    const terminalScreen = document.getElementById('terminal-screen');
    const runTerminalBtn = document.getElementById('run-terminal-btn');
    
    let isTyping = false;
    const terminalLogs = [
        { text: "> GET /api/v1/analytics/dashboard", type: "text" },
        { text: "[401] Unauthorized: TOKEN_EXPIRED", type: "line-error" },
        { text: "> Interceptor Caught 401. Queuing pending requests...", type: "line-warn" },
        { text: "> Fetching Refresh Token from Secure Storage...", type: "text" },
        { text: "> POST /api/v1/auth/refresh-token", type: "text" },
        { text: "[200] OK: New Access Token Issued (Valid 15m)", type: "line-success" },
        { text: "> Re-attaching Bearer token headers...", type: "text" },
        { text: "> Replaying original request [GET /api/v1/analytics/dashboard]", type: "text" },
        { text: "[200] OK: Data Fetched. Rendering UI.", type: "line-success" }
    ];

    const typeTerminal = async () => {
        if(isTyping || !terminalScreen) return;
        isTyping = true;
        terminalScreen.innerHTML = '';

        for(let i = 0; i < terminalLogs.length; i++) {
            const span = document.createElement('span');
            span.className = terminalLogs[i].type;
            const delay = Math.random() * 400 + 150;
            await new Promise(r => setTimeout(r, delay));
            span.innerText = terminalLogs[i].text;
            terminalScreen.appendChild(span);
        }
        isTyping = false;
    };

    if(runTerminalBtn) {
        runTerminalBtn.addEventListener('click', () => typeTerminal());
        const termObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                typeTerminal();
                termObserver.disconnect();
            }
        }, { threshold: 0.5 });
        termObserver.observe(terminalScreen);
    }
});
