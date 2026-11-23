import { useState } from "react";
import { translate } from "../i18n";

export default function FarmFeaturePage({ title, icon, description, fields = [], upload = false, onNavigate, embedded = false, language = "English" }) {
    const [values, setValues] = useState({});
    const [message, setMessage] = useState("");
    const t = (text) => translate(text, language);

    function submit(event) {
        event.preventDefault();
        setMessage(t("Your information is ready. Connect the backend endpoint to receive a live result."));
    }

    return (
        <main className={`feature-page ${embedded ? "feature-page-embedded" : ""}`}>
            {!embedded && <button className="feature-back" type="button" onClick={() => onNavigate("dashboard")}>{t("← Dashboard")}</button>}
            <section className="feature-shell">
                <div className="feature-heading"><span className="feature-icon">{icon}</span><p>{t("AI FARM TOOL")}</p><h1>{t(title)}</h1><span>{t(description)}</span></div>
                <form className="feature-form" onSubmit={submit}>
                    {upload && <label className="upload-box"><strong>{t("Upload information or report")}</strong><span>{t("Choose a file from your device")}</span><input type="file" onChange={(event) => setValues({ ...values, file: event.target.files?.[0]?.name || "" })} /></label>}
                    <div className="feature-fields">{fields.map((field) => <label key={field.name}><span>{t(field.label)}{field.required ? " *" : ""}</span><input required={field.required} type={field.type || "text"} value={values[field.name] || ""} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} placeholder={t(field.placeholder || field.label)} /></label>)}</div>
                    <button className="feature-submit" type="submit">{t("RUN ANALYSIS")} <span>→</span></button>
                    {message && <p className="feature-message">{message}</p>}
                </form>
            </section>
            <style>{`
                .feature-page{min-height:100vh;padding:80px 24px 50px;background:linear-gradient(135deg,#f3fbf3,#fff 55%,#eaf6e9);color:#123f2a;font-family:Arial,sans-serif}.feature-page-embedded{min-height:0;padding:0;background:transparent}.feature-back{position:absolute;top:28px;left:7vw;border:0;background:transparent;color:#123f2a;font-weight:700;cursor:pointer}.feature-shell{width:min(760px,100%);margin:auto;animation:feature-in .5s ease both}.feature-heading{text-align:center}.feature-icon{display:grid;place-items:center;width:64px;height:64px;margin:auto;border-radius:20px;background:#dff3df;font-size:34px}.feature-heading p{margin:20px 0 8px;color:#208c4a;font-size:11px;font-weight:700;letter-spacing:2px}.feature-heading h1{margin:0;font-size:36px}.feature-heading>span:last-child{display:block;max-width:570px;margin:12px auto 28px;color:#668073;line-height:1.6}.feature-form{padding:30px;border:1px solid #d8eadb;border-radius:20px;background:#fffffff2;box-shadow:0 20px 50px #245b371c}.feature-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.feature-fields label{display:block}.feature-fields label:first-child:last-child{grid-column:1/-1}.feature-fields span,.upload-box strong{display:block;margin-bottom:8px;color:#315a42;font-size:13px;font-weight:700}.feature-fields input{box-sizing:border-box;width:100%;height:47px;padding:0 13px;border:1px solid #d8e7db;border-radius:9px;outline:0;color:#123f2a;background:#fbfefb}.feature-fields input:focus{border-color:#208c4a;box-shadow:0 0 0 4px #208c4a18}.upload-box{display:block;margin-bottom:20px;padding:22px;border:1px dashed #8cc496;border-radius:12px;background:#f5fcf4;text-align:center;cursor:pointer}.upload-box span{display:block;margin:4px 0 10px;color:#668073;font-size:13px}.upload-box input{max-width:100%;font-size:12px}.feature-submit{display:block;width:100%;height:48px;margin-top:26px;border:0;border-radius:9px;color:white;background:#208c4a;font-weight:700;letter-spacing:.7px;cursor:pointer;transition:.2s}.feature-submit:hover{background:#123f2a;transform:translateY(-2px)}.feature-message{margin:15px 0 0;color:#208c4a;text-align:center;font-size:13px;line-height:1.5}@keyframes feature-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@media(max-width:600px){.feature-page{padding:80px 18px 35px}.feature-page-embedded{padding:0}.feature-back{left:18px}.feature-heading h1{font-size:29px}.feature-form{padding:22px 18px}.feature-fields{grid-template-columns:1fr}}
            `}</style>
        </main>
    );
}
