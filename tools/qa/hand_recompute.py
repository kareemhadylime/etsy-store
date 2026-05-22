"""Hand-recompute the key KPIs for each persona from the same seed data
that build_personas.py wrote, then dump expected vs. what the workbook
should report. We can't recalc via Python (formulas lib chokes on LET),
so we audit by re-deriving from seeds + re-reading the formula refs.
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PERSONAS = {
    "p1-solo": dict(
        income=[5200],
        expenses=[1700,380,95,16,11,60,75,50,220,45,30,120],
        needs=[1700,380,95,60,50,220],
        wants=[16,11,75,45,30,120],
        savings=[],
        cc_balance=[1850,620], cc_limit=[8000,5000], cc_min=[40,25], cc_apr=[0.244,0.221],
        bills_paid=3, bills_due=2, bills_total=5,
        bills_amount_due=[50,27], bills_total_amount=1961,
        ef=5200, hh=1, target_sr=0.20,
        monthly_income=5200,
    ),
    "p2-couple": dict(
        income=[7000,5000],
        expenses=[2900,600,1800,240,60,450,380,180,320,140,95,280,250,1000,500,55],
        needs=[2900,600,1800,240,60,450,380,180,140,95,280],
        wants=[320,250,55],
        savings=[1000,500],
        cc_balance=[2400,1200,800], cc_limit=[12000,10000,5000], cc_min=[50,30,25], cc_apr=[0.219,0.221,0.198],
        bills_paid=4, bills_due=3, bills_total=7,
        bills_amount_due=[140,55,220], bills_total_amount=5450,
        ef=18000, hh=2, target_sr=0.18,
        monthly_income=12000,
    ),
    "p3-freelancer": dict(
        income=[4200,1500,900,2800],
        expenses=[1500,1850,350,480,145,89,60,240,220,180,1200,22],
        needs=[1500,1850,350,480,145,89,60,240,180],
        wants=[220,22],
        savings=[1200],
        cc_balance=[3400,800], cc_limit=[15000,25000], cc_min=[75,30], cc_apr=[0.249,0.219],
        bills_paid=2, bills_due=3, bills_total=5,
        bills_amount_due=[480,145,60], bills_total_amount=3035,
        ef=8500, hh=1, target_sr=0.25,
        monthly_income=9400,
    ),
}

def derive(p):
    tot_inc  = sum(p["income"])
    tot_exp  = sum(p["expenses"])
    net      = tot_inc - tot_exp
    needs_t  = sum(p["needs"])
    wants_t  = sum(p["wants"])
    save_t   = sum(p["savings"])
    cc_bal   = sum(p["cc_balance"])
    cc_lim   = sum(p["cc_limit"])
    cc_util  = cc_bal / cc_lim if cc_lim else 0
    cc_minpm = sum(p["cc_min"])
    cc_int   = sum(b*r/12 for b, r in zip(p["cc_balance"], p["cc_apr"]))

    months_cover = p["ef"] / max(tot_exp, 1)
    needs_pct = needs_t / (needs_t + wants_t + save_t) if (needs_t + wants_t + save_t) else 0
    wants_pct = wants_t / (needs_t + wants_t + save_t) if (needs_t + wants_t + save_t) else 0
    save_pct  = save_t  / (needs_t + wants_t + save_t) if (needs_t + wants_t + save_t) else 0

    # Health sub-scores
    income_for_score = max(p["monthly_income"], tot_inc)
    sr_value = (income_for_score - tot_exp) / income_for_score if income_for_score else 0
    sr_score = max(0, min(100, round(sr_value / p["target_sr"] * 100)))
    ef_ratio = p["ef"] / max(tot_exp, 1)
    ef_target_months = 6 if p["hh"] >= 2 else 3
    ef_score = max(0, min(100, round(ef_ratio / ef_target_months * 100)))
    dti = cc_minpm / income_for_score if income_for_score else 0
    if dti <= 0.20:   dti_score = 100
    elif dti <= 0.36: dti_score = 80
    elif dti <= 0.43: dti_score = 50
    else:             dti_score = 25
    if cc_util <= 0.10: util_score = 100
    elif cc_util <= 0.30: util_score = 80
    elif cc_util <= 0.50: util_score = 50
    else:               util_score = 25
    on_time = (p["bills_paid"] / p["bills_total"]) * 100 if p["bills_total"] else 100
    on_time_score = round(on_time)
    composite = round(sr_score*0.25 + ef_score*0.25 + dti_score*0.20 + util_score*0.15 + on_time_score*0.15)

    return dict(
        tot_inc=tot_inc, tot_exp=tot_exp, net=net,
        needs_t=needs_t, wants_t=wants_t, save_t=save_t,
        needs_pct=needs_pct, wants_pct=wants_pct, save_pct=save_pct,
        cc_bal=cc_bal, cc_lim=cc_lim, cc_util=cc_util, cc_minpm=cc_minpm, cc_int=cc_int,
        months_cover=months_cover,
        sr_value=sr_value, sr_score=sr_score,
        ef_score=ef_score,
        dti=dti, dti_score=dti_score,
        util_score=util_score,
        on_time_score=on_time_score,
        composite=composite,
        bills_total_amount=p["bills_total_amount"],
        bills_total=p["bills_total"],
    )

for name, p in PERSONAS.items():
    d = derive(p)
    print(f"\n===== {name} expected =====")
    print(f"  Income M-T-D            : ${d['tot_inc']:,.0f}")
    print(f"  Expenses M-T-D          : ${d['tot_exp']:,.0f}")
    print(f"  Net Flow                : ${d['net']:,.0f}")
    print(f"  Needs % / Wants % / Sav%: {d['needs_pct']:.0%} / {d['wants_pct']:.0%} / {d['save_pct']:.0%}")
    print(f"  CC Bal / Lim / Util     : ${d['cc_bal']:,.0f} / ${d['cc_lim']:,.0f} / {d['cc_util']:.1%}")
    print(f"  CC min payments         : ${d['cc_minpm']:,.2f}/mo  · CC monthly int: ${d['cc_int']:,.2f}")
    print(f"  EF months coverage      : {d['months_cover']:.1f} mo")
    print(f"  Health sub-scores       : SR={d['sr_score']} EF={d['ef_score']} DTI={d['dti_score']} Util={d['util_score']} OnTime={d['on_time_score']}")
    print(f"  Health composite (25/25/20/15/15): {d['composite']}/100")
    print(f"  Savings rate value      : {d['sr_value']:.1%}")
    print(f"  DTI value               : {d['dti']:.1%}")
    print(f"  Bills total amount      : ${d['bills_total_amount']:,.0f}")
    print(f"  Bills count             : {d['bills_total']}")
