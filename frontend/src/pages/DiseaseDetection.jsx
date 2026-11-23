import { useEffect, useRef, useState } from "react";
import { translate } from "../i18n";

function DiseaseDetection({ language = "English" }) {
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const t = (text) => translate(text, language);

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t("Choose an image file to continue."));
      return;
    }

    setImage(file);
    setError("");
    setShowResult(false);
    event.target.value = "";
  };

  const runAnalysis = (event) => {
    event.preventDefault();
    if (image) setShowResult(true);
  };

  return (
    <main className="disease-page">
      <section className="disease-shell">
        <header className="disease-heading">
          <span className="disease-icon" aria-hidden="true">🦠</span>
          <p>{t("AI FARM TOOL")}</p>
          <h1>{t("Plant Disease Detection")}</h1>
          <span>{t("Choose a clear photo of the affected plant or leaf.")}</span>
        </header>

        <form className="disease-form" onSubmit={runAnalysis}>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={handleImage}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImage}
          />

          <p className="disease-prompt">{t("Add a plant photo")}</p>
          <div className="disease-options">
            <button type="button" onClick={() => cameraRef.current?.click()}>
              <span aria-hidden="true">📷</span>
              <strong>{t("Take a picture")}</strong>
              <small>{t("Open your camera")}</small>
            </button>
            <button type="button" onClick={() => fileRef.current?.click()}>
              <span aria-hidden="true">🖼️</span>
              <strong>{t("Choose from files")}</strong>
              <small>{t("Select an image on your device")}</small>
            </button>
          </div>

          {error && <p className="disease-error" role="alert">{error}</p>}

          {image && (
            <div className="disease-preview">
              <img src={previewUrl} alt={t("Preview of selected plant")} />
              <p title={image.name}>{image.name}</p>
            </div>
          )}

          <button className="disease-submit" type="submit" disabled={!image}>
            {t("RUN ANALYSIS")} <span aria-hidden="true">→</span>
          </button>

          {showResult && (
            <section className="disease-result" aria-live="polite">
              <div className="result-title">
                <div>
                  <p>{t("ANALYSIS RESULT")}</p>
                  <h2>{t("Disease could not be identified")}</h2>
                </div>
                <span className="result-badge">{t("Model not connected")}</span>
              </div>
              <p className="result-explanation">{t("Your photo is ready, but an image diagnosis model is not connected yet. We can’t reliably tell which disease is present or what caused these symptoms from this image.")}</p>
              <h3>{t("What to do now")}</h3>
              <ul>
                <li>{t("Keep the affected plant separate where practical, and avoid touching healthy plants after handling it.")}</li>
                <li>{t("Remove badly damaged leaves and dispose of them away from the crop; clean tools afterward.")}</li>
                <li>{t("Water at the base of the plant and keep foliage dry to reduce the spread of many fungal diseases.")}</li>
                <li>{t("For a confirmed diagnosis, share clear photos of both sides of the leaves with a local agricultural expert.")}</li>
              </ul>
              <aside className="disease-reference">
                <h3>{t("Example disease guide: tomato early blight")}</h3>
                <p><strong>{t("What happens:")}</strong> A fungal disease can cause brown, ring-like spots on older leaves. As spots grow, leaves may yellow and drop, reducing the plant’s ability to produce food.</p>
                <p><strong>{t("Prevention:")}</strong> Rotate crops, remove infected plant debris, give plants space for airflow, and water the soil rather than the leaves. This is general reference information, not a diagnosis of your photo.</p>
              </aside>
            </section>
          )}
        </form>
      </section>
      <style>{`
        .disease-page{min-height:100vh;padding:58px 24px 48px;background:linear-gradient(135deg,#f3fbf3,#fff 55%,#eaf6e9);color:#123f2a;font-family:Arial,sans-serif}
        .disease-shell{width:min(760px,100%);margin:auto;animation:disease-in .5s ease both}
        .disease-heading{text-align:center}
        .disease-icon{display:grid;place-items:center;width:64px;height:64px;margin:auto;border-radius:20px;background:#dff3df;font-size:32px}
        .disease-heading>p,.result-title>div>p{margin:20px 0 8px;color:#208c4a;font-size:11px;font-weight:700;letter-spacing:2px}
        .disease-heading h1{margin:0;font-size:36px}
        .disease-heading>span:last-child{display:block;max-width:570px;margin:12px auto 28px;color:#668073;line-height:1.6}
        .disease-form{padding:30px;border:1px solid #d8eadb;border-radius:16px;background:#fffffff2;box-shadow:0 20px 50px #245b371c}
        .disease-prompt{margin:0 0 12px;color:#315a42;font-size:13px;font-weight:700}
        .disease-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        .disease-options button{display:grid;justify-items:start;gap:7px;min-height:116px;padding:17px;border:1px solid #d8e7db;border-radius:10px;background:#fbfefb;color:#123f2a;text-align:left;cursor:pointer;transition:border-color .18s,background .18s}
        .disease-options button:hover,.disease-options button:focus-visible{border-color:#208c4a;background:#f3fbf3;outline:0}
        .disease-options button>span{font-size:22px}
        .disease-options strong{font-size:14px}
        .disease-options small{color:#668073;font-size:12px}
        .disease-preview{display:flex;align-items:center;gap:14px;margin-top:20px;padding:12px;border:1px solid #e0ece1;border-radius:10px;background:#fbfefb}
        .disease-preview img{width:76px;height:76px;border-radius:7px;object-fit:cover}
        .disease-preview p{overflow:hidden;margin:0;color:#315a42;font-size:13px;text-overflow:ellipsis;white-space:nowrap}
        .disease-error{margin:12px 0 0;color:#a63131;font-size:13px}
        .disease-submit{display:block;width:100%;height:48px;margin-top:24px;border:0;border-radius:9px;color:white;background:#208c4a;font-weight:700;letter-spacing:.7px;cursor:pointer}
        .disease-submit span{margin-left:7px}
        .disease-submit:disabled{background:#9abca2;cursor:not-allowed}
        .disease-result{margin-top:24px;padding-top:23px;border-top:1px solid #d8eadb;animation:disease-in .3s ease both}
        .result-title{display:flex;align-items:center;justify-content:space-between;gap:14px}
        .result-title>div>p{margin:0 0 7px}
        .result-title h2{margin:0;font-size:21px}
        .result-badge{flex:none;padding:7px 10px;border-radius:6px;background:#fff4dd;color:#85550a;font-size:11px;font-weight:700}
        .result-explanation,.disease-result li,.disease-reference p{color:#526b5b;font-size:13px;line-height:1.65}
        .disease-result h3{margin:19px 0 7px;color:#315a42;font-size:14px}
        .disease-result ul{margin:0;padding-left:20px}
        .disease-result li+li{margin-top:5px}
        .disease-reference{margin-top:18px;padding:1px 16px 13px;border-left:3px solid #8cc496;background:#f5fcf4}
        .disease-reference h3{margin-top:14px}
        .disease-reference p{margin:8px 0}
        @keyframes disease-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:560px){.disease-page{padding:36px 16px}.disease-form{padding:20px}.disease-heading h1{font-size:29px}.disease-options{grid-template-columns:1fr}.disease-options button{min-height:96px}.result-title{align-items:flex-start;flex-direction:column}.result-badge{align-self:flex-start}}
        @media(prefers-reduced-motion:reduce){.disease-shell,.disease-result{animation:none}.disease-options button{transition:none}}
      `}</style>
    </main>
  );
}

export default DiseaseDetection;