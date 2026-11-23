import { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES, translate } from "../i18n";

const languages = SUPPORTED_LANGUAGES;

const translations = {
    English: { personal: "Personal Details", language: "Preferred Language", fullName: "Full Name", mobile: "Mobile Number", email: "Email (Optional)", password: "Password", confirm: "Confirm Password", location: "Location", state: "State", district: "District", village: "Village / Town", pin: "PIN Code", farm: "Farm Details", farmName: "Farm / Land Name", area: "Total Land Area", unit: "Land Area Unit", ownership: "Land Ownership", acres: "Acres", hectares: "Hectares", owned: "Owned", leased: "Leased", family: "Family-owned", next: "NEXT", back: "BACK", finish: "CREATE ACCOUNT", account: "Create Your AI Farm Account", optional: "Optional" },
    Hindi: { personal: "व्यक्तिगत विवरण", language: "पसंदीदा भाषा", fullName: "पूरा नाम", mobile: "मोबाइल नंबर", email: "ईमेल (वैकल्पिक)", password: "पासवर्ड", confirm: "पासवर्ड की पुष्टि करें", location: "स्थान", state: "राज्य", district: "जिला", village: "गाँव / शहर", pin: "पिन कोड", farm: "खेत का विवरण", farmName: "खेत / भूमि का नाम", area: "कुल भूमि क्षेत्र", unit: "भूमि क्षेत्र की इकाई", ownership: "भूमि का स्वामित्व", acres: "एकड़", hectares: "हेक्टेयर", owned: "स्वयं का", leased: "पट्टे पर", family: "परिवार का", next: "आगे", back: "पीछे", finish: "खाता बनाएँ", account: "अपना AI Farm खाता बनाएँ", optional: "वैकल्पिक" },
    Telugu: { personal: "వ్యక్తిగత వివరాలు", language: "ఇష్టమైన భాష", fullName: "పూర్తి పేరు", mobile: "మొబైల్ నంబర్", email: "ఇమెయిల్ (ఐచ్ఛికం)", password: "పాస్‌వర్డ్", confirm: "పాస్‌వర్డ్ నిర్ధారించండి", location: "ప్రాంతం", state: "రాష్ట్రం", district: "జిల్లా", village: "గ్రామం / పట్టణం", pin: "పిన్ కోడ్", farm: "పొలం వివరాలు", farmName: "పొలం / భూమి పేరు", area: "మొత్తం భూమి విస్తీర్ణం", unit: "భూమి విస్తీర్ణం యూనిట్", ownership: "భూమి యాజమాన్యం", acres: "ఎకరాలు", hectares: "హెక్టార్లు", owned: "సొంతం", leased: "కౌలు", family: "కుటుంబానికి చెందినది", next: "తదుపరి", back: "వెనుకకు", finish: "ఖాతా సృష్టించండి", account: "మీ AI Farm ఖాతాను సృష్టించండి", optional: "ఐచ్ఛికం" },
    Tamil: { personal: "தனிப்பட்ட விவரங்கள்", language: "விருப்பமான மொழி", fullName: "முழு பெயர்", mobile: "மொபைல் எண்", email: "மின்னஞ்சல் (விருப்பம்)", password: "கடவுச்சொல்", confirm: "கடவுச்சொல்லை உறுதிப்படுத்தவும்", location: "இடம்", state: "மாநிலம்", district: "மாவட்டம்", village: "கிராமம் / நகரம்", pin: "அஞ்சல் குறியீடு", farm: "பண்ணை விவரங்கள்", farmName: "பண்ணை / நிலத்தின் பெயர்", area: "மொத்த நிலப்பரப்பு", unit: "நிலப்பரப்பு அலகு", ownership: "நில உரிமை", acres: "ஏக்கர்", hectares: "ஹெக்டேர்", owned: "சொந்தமானது", leased: "குத்தகை", family: "குடும்பத்திற்கு சொந்தமானது", next: "அடுத்து", back: "பின்", finish: "கணக்கை உருவாக்கவும்", account: "உங்கள் AI Farm கணக்கை உருவாக்கவும்", optional: "விருப்பம்" },
    Kannada: { personal: "ವೈಯಕ್ತಿಕ ವಿವರಗಳು", language: "ಆದ್ಯತೆಯ ಭಾಷೆ", fullName: "ಪೂರ್ಣ ಹೆಸರು", mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", email: "ಇಮೇಲ್ (ಐಚ್ಛಿಕ)", password: "ಪಾಸ್‌ವರ್ಡ್", confirm: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ", location: "ಸ್ಥಳ", state: "ರಾಜ್ಯ", district: "ಜಿಲ್ಲೆ", village: "ಗ್ರಾಮ / ಪಟ್ಟಣ", pin: "ಪಿನ್ ಕೋಡ್", farm: "ಕೃಷಿ ವಿವರಗಳು", farmName: "ಕೃಷಿ / ಭೂಮಿಯ ಹೆಸರು", area: "ಒಟ್ಟು ಭೂಮಿ ವಿಸ್ತೀರ್ಣ", unit: "ಭೂಮಿ ವಿಸ್ತೀರ್ಣ ಘಟಕ", ownership: "ಭೂ ಮಾಲೀಕತ್ವ", acres: "ಎಕರೆ", hectares: "ಹೆಕ್ಟೇರ್", owned: "ಸ್ವಂತ", leased: "ಗುತ್ತಿಗೆ", family: "ಕುಟುಂಬದ ಸ್ವಂತ", next: "ಮುಂದೆ", back: "ಹಿಂದೆ", finish: "ಖಾತೆ ರಚಿಸಿ", account: "ನಿಮ್ಮ AI Farm ಖಾತೆಯನ್ನು ರಚಿಸಿ", optional: "ಐಚ್ಛಿಕ" },
};

function Register({ onBack, onComplete, language = "English", onLanguageChange }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ language, fullName: "", mobile: "", email: "", password: "", confirmPassword: "", state: "", district: "", village: "", pin: "", farmName: "", area: "", unit: "Acres", ownership: "Owned" });
    const [errors, setErrors] = useState({});
    const [done, setDone] = useState(false);
    const text = translations[form.language] || translations.English;
    const t = (value) => translate(value, form.language);

    useEffect(() => {
        setForm((current) => ({ ...current, language }));
    }, [language]);

    function update(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
        if (field === "language") onLanguageChange?.(value);
        setErrors((current) => ({ ...current, [field]: "" }));
        setDone(false);
    }

    function validateCurrentStep() {
        const next = {};
        const required = step === 1 ? ["fullName", "mobile", "password", "confirmPassword"] : step === 2 ? ["state", "district", "village", "pin"] : ["area"];
        required.forEach((field) => { if (!form[field].trim()) next[field] = t("This field is required."); });
        if (step === 1 && form.password && form.password !== form.confirmPassword) next.confirmPassword = t("Passwords do not match.");
        if (step === 2 && form.pin && !/^\d{6}$/.test(form.pin)) next.pin = t("Enter a valid 6-digit PIN code.");
        if (step === 3 && form.area && !(Number(form.area) > 0)) next.area = t("Enter a valid land area.");
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleNext(event) {
        event.preventDefault();
        if (!validateCurrentStep()) return;
        if (step < 3) setStep((current) => current + 1);
        else {
            setDone(true);
            onComplete(form.fullName.trim());
        }
    }

    const fields = step === 1 ? [
        ["fullName", text.fullName, "text"], ["mobile", text.mobile, "tel"], ["email", text.email, "email"], ["password", text.password, "password"], ["confirmPassword", text.confirm, "password"],
    ] : step === 2 ? [["state", text.state, "text"], ["district", text.district, "text"], ["village", text.village, "text"], ["pin", text.pin, "text"]] : [["farmName", text.farmName, "text"], ["area", text.area, "number"]];

    return (
        <main className="register-page">
            <button className="register-back" type="button" onClick={onBack}>← {t("Back to login")}</button>
            <section className="register-shell">
                <div className="register-heading">
                    <div className="register-logo">🌱</div>
                    <p className="register-kicker">{t("SMART FARMING PLATFORM")}</p>
                    <h1>{text.account}</h1>
                    <p>{t("Complete these three quick steps to personalize your farming experience.")}</p>
                </div>
                <div className="progress-bar" aria-label={t(`Step ${step} of 3`)}>
                    {[1, 2, 3].map((item) => <span key={item} className={item <= step ? "active" : ""}>{item}</span>)}
                </div>
                <form className="register-card" onSubmit={handleNext} noValidate>
                    <div className="step-title"><span>{t(`STEP ${step} OF 3`)}</span><h2>{step === 1 ? text.personal : step === 2 ? text.location : text.farm}</h2></div>
                    {step === 1 && <label className="register-field full-field"><span>{text.language}</span><select value={form.language} onChange={(event) => update("language", event.target.value)}>{languages.map((language) => <option key={language}>{language}</option>)}</select></label>}
                    <div className="register-grid">
                        {fields.map(([field, label, type]) => <label className="register-field" key={field}><span>{label}{field !== "email" && field !== "farmName" ? " *" : ` (${text.optional})`}</span><input id={field} type={type} value={form[field]} onChange={(event) => update(field, event.target.value)} placeholder={label} />{errors[field] && <small>{errors[field]}</small>}</label>)}
                    </div>
                    {step === 3 && <><fieldset className="choice-field"><legend>{text.unit} *</legend><label><input type="radio" name="unit" checked={form.unit === "Acres"} onChange={() => update("unit", "Acres")} /> {text.acres}</label><label><input type="radio" name="unit" checked={form.unit === "Hectares"} onChange={() => update("unit", "Hectares")} /> {text.hectares}</label></fieldset><fieldset className="choice-field"><legend>{text.ownership} *</legend><label><input type="radio" name="ownership" checked={form.ownership === "Owned"} onChange={() => update("ownership", "Owned")} /> {text.owned}</label><label><input type="radio" name="ownership" checked={form.ownership === "Leased"} onChange={() => update("ownership", "Leased")} /> {text.leased}</label><label><input type="radio" name="ownership" checked={form.ownership === "Family-owned"} onChange={() => update("ownership", "Family-owned")} /> {text.family}</label></fieldset></>}
                    <div className="register-actions">{step > 1 && <button type="button" className="secondary-action" onClick={() => setStep((current) => current - 1)}>{text.back}</button>}<button className="primary-action" type="submit">{step === 3 ? text.finish : text.next} <span>→</span></button></div>
                    {done && <p className="register-success">{t("Your details are ready. Registration can now be connected to the backend.")}</p>}
                </form>
            </section>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap');
                .register-page { min-height: 100vh; padding: 75px 20px 45px; color: #123f2a; background: linear-gradient(135deg,#f3fbf3,#fff 55%,#eaf6e9); font-family:'DM Sans',sans-serif; }
                .register-back { position:absolute; top:28px; left:7vw; border:0; color:#123f2a; background:transparent; font:600 14px 'DM Sans'; cursor:pointer; transition:transform .2s ease,color .2s ease; } .register-back:hover { color:#208c4a; transform:translateX(-4px); }
                .register-shell { width:min(720px,100%); margin:auto; animation:register-rise .55s ease both; }
                .register-heading { text-align:center; } .register-logo { display:grid; place-items:center; width:52px; height:52px; margin:0 auto 16px; border-radius:17px; color:white; background:#208c4a; font-size:27px; box-shadow:0 10px 20px #208c4a33; } .register-kicker { margin:0 0 8px; color:#208c4a; font-size:11px; font-weight:700; letter-spacing:2px; } .register-heading h1 { margin:0; font:800 clamp(28px,5vw,42px)/1.1 'Manrope'; } .register-heading p:last-child { margin:12px auto 25px; color:#668073; font-size:15px; }
                .progress-bar { display:flex; align-items:center; justify-content:center; gap:0; margin:0 auto 22px; } .progress-bar span { display:grid; place-items:center; width:33px; height:33px; border:2px solid #cfe5d1; border-radius:50%; color:#8da194; background:#fff; font-weight:700; font-size:13px; } .progress-bar span:not(:last-child)::after { content:''; display:block; position:absolute; width:80px; height:2px; margin-left:110px; background:#cfe5d1; } .progress-bar span { position:relative; } .progress-bar span.active { border-color:#208c4a; color:white; background:#208c4a; } .progress-bar span.active:not(:last-child)::after { background:#208c4a; }
                .register-card { padding:30px clamp(22px,5vw,48px); border:1px solid #d8eadb; border-radius:22px; background:#fffffff2; box-shadow:0 20px 50px #245b371c; } .step-title { margin-bottom:22px; } .step-title span { color:#208c4a; font-size:10px; font-weight:700; letter-spacing:2px; } .step-title h2 { margin:4px 0 0; font:800 25px 'Manrope'; }
                .register-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:17px 16px; } .register-field { display:block; min-width:0; } .full-field { margin-bottom:17px; } .register-field span, .choice-field legend { display:block; margin-bottom:8px; color:#315a42; font-size:13px; font-weight:700; } .register-field input, .register-field select { box-sizing:border-box; display:block; width:100%; min-width:0; height:47px; padding:0 13px; border:1px solid #d8e7db; border-radius:9px; outline:0; color:#123f2a; background:#fbfefb; font:14px 'DM Sans'; transition:border-color .2s,box-shadow .2s,transform .2s; } .register-field input:focus,.register-field select:focus { border-color:#208c4a; box-shadow:0 0 0 4px #208c4a18; transform:translateY(-1px); } .register-field small { display:block; margin-top:5px; color:#c84a42; font-size:11px; }
                .choice-field { display:flex; flex-wrap:wrap; gap:12px 20px; margin:22px 0 0; padding:0; border:0; } .choice-field legend { width:100%; } .choice-field label { color:#557360; font-size:13px; cursor:pointer; } .choice-field input { accent-color:#208c4a; }
                .register-actions { display:flex; justify-content:flex-end; gap:12px; margin-top:30px; } .primary-action,.secondary-action { min-width:120px; height:46px; padding:0 17px; border-radius:9px; font:700 12px 'DM Sans'; letter-spacing:.6px; cursor:pointer; transition:transform .2s,background .2s,box-shadow .2s; } .primary-action { border:0; color:white; background:#208c4a; box-shadow:0 8px 16px #208c4a2b; } .primary-action:hover { background:#123f2a; transform:translateY(-2px); } .secondary-action { border:1px solid #d0e2d3; color:#315a42; background:white; } .secondary-action:hover { background:#eff9ef; transform:translateY(-2px); } .primary-action:active,.secondary-action:active { transform:scale(.97); } .register-success { margin:18px 0 0; color:#208c4a; text-align:center; font-size:13px; }
                @keyframes register-rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } } @media(max-width:600px) { .register-page { padding-top:80px; } .register-back { left:20px; } .register-grid { grid-template-columns:1fr; } .progress-bar span:not(:last-child)::after { width:45px; margin-left:75px; } .register-card { padding:25px 20px; } }
            `}</style>
        </main>
    );
}

export default Register;
