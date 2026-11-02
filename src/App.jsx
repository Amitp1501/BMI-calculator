import { useState } from "react";
import "./App.css";

const bmiCategories = [
  { name: "Underweight", range: "Below 18.5", className: "underweight" },
  { name: "Healthy", range: "18.5 – 24.9", className: "healthy" },
  { name: "Overweight", range: "25 – 29.9", className: "overweight" },
  { name: "Obesity", range: "30 and above", className: "obesity" },
];

const wellnessSlides = [
  {
    label: "A useful starting point",
    title: "One number, not the whole story.",
    description:
      "BMI compares weight with height. It can help start a health conversation, but it does not measure body fat directly or describe your overall wellbeing.",
    number: "01",
  },
  {
    label: "Put your result in context",
    title: "Your body has its own context.",
    description:
      "Age, muscle mass, pregnancy, and other factors can affect how useful BMI is. A healthcare professional can help interpret your result for you.",
    number: "02",
  },
  {
    label: "A gentle reminder",
    title: "Small habits matter more.",
    description:
      "A calculator is a snapshot, not a score. Sleep, movement, nourishment, and how you feel are all meaningful parts of your health.",
    number: "03",
  },
];

function getCategory(bmi) {
  if (bmi < 18.5) return bmiCategories[0];
  if (bmi < 25) return bmiCategories[1];
  if (bmi < 30) return bmiCategories[2];
  return bmiCategories[3];
}

function App() {
  const [units, setUnits] = useState("metric");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightLb, setWeightLb] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const clearResult = () => {
    setResult(null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const weight = Number(units === "metric" ? weightKg : weightLb);
    const feetValue = Number(feet);
    const inchesValue = Number(inches);

    if (
      units === "imperial" &&
      (!Number.isInteger(feetValue) ||
        feetValue < 0 ||
        inchesValue < 0 ||
        inchesValue >= 12)
    ) {
      setError("Enter whole feet and between 0 and 11.9 inches for your height.");
      setResult(null);
      return;
    }

    const height =
      units === "metric"
        ? Number(heightCm) / 100
        : feetValue * 12 + inchesValue;

    if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(height) || height <= 0) {
      setError("Enter a weight and height greater than zero to calculate your BMI.");
      setResult(null);
      return;
    }

    const bmi =
      units === "metric"
        ? weight / (height * height)
        : (703 * weight) / (height * height);

    if (!Number.isFinite(bmi)) {
      setError("We couldn't calculate that result. Check your measurements and try again.");
      setResult(null);
      return;
    }

    setError("");
    setResult({ value: bmi, category: getCategory(bmi) });
  };

  const handleReset = () => {
    setWeightKg("");
    setHeightCm("");
    setWeightLb("");
    setFeet("");
    setInches("");
    setResult(null);
    setError("");
  };

  const updateValue = (setter) => (event) => {
    setter(event.target.value);
    clearResult();
  };

  const markerPosition = result
    ? `${Math.max(0, Math.min(100, ((result.value - 14) / 26) * 100))}%`
    : "0%";
  const changeSlide = (direction) => {
    setActiveSlide(
      (current) =>
        (current + direction + wellnessSlides.length) % wellnessSlides.length,
    );
  };
  const slide = wellnessSlides[activeSlide];

  return (
    <div className="App">
      <main className="page-shell">
        <header className="topbar">
          <a className="brand" href="#home" aria-label="Wellwise home">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>wellwise</span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#home">Home</a>
            <a href="#calculator">Calculator</a>
            <a href="#wellness">Wellness notes</a>
          </nav>
          <a className="nav-cta" href="#calculator">
            Check your BMI <span aria-hidden="true">↗</span>
          </a>
        </header>

        <section className="hero-grid" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR PERSONAL WELLNESS TOOL
            </div>
            <h1>
              Make sense of
              <br />
              <span>your numbers.</span>
            </h1>
            <p className="hero-description">
              A quick check-in with your body. Calculate your BMI and get a
              simple guide to what your number may mean.
            </p>

            <div className="hero-actions">
              <a className="hero-primary" href="#calculator">
                Calculate your BMI <span aria-hidden="true">↘</span>
              </a>
              <a className="hero-secondary" href="#wellness">
                Explore the guide
              </a>
            </div>

            <div className="insight-card">
              <span className="insight-icon" aria-hidden="true">
                ✳
              </span>
              <p>
                <strong>Progress, not perfection.</strong>
                <span>Your health is more than a number on a screen.</span>
              </p>
            </div>

            <div className="range-guide">
              <div className="range-guide-heading">
                <span>BMI ranges</span>
                <span>Adult guide</span>
              </div>
              <div className="range-list">
                {bmiCategories.map((category) => (
                  <div className="range-item" key={category.name}>
                    <span className={`range-dot ${category.className}`} />
                    <span>{category.name}</span>
                    <span className="range-value">{category.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section
            className="calculator-card"
            id="calculator"
            aria-labelledby="calculator-title"
          >
            <div className="card-heading">
              <div>
                <span className="card-kicker">LET’S CHECK IN</span>
                <h2 id="calculator-title">BMI calculator</h2>
                <p>Enter your details to get started.</p>
              </div>
              <div className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <path
                    d="M10 35V22a14 14 0 0 1 28 0v13"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M24 22l7-7M10 35h28"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="24" cy="22" r="3" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="unit-switch" role="group" aria-label="Measurement units">
              <button
                type="button"
                className={units === "metric" ? "unit-option active" : "unit-option"}
                aria-pressed={units === "metric"}
                onClick={() => {
                  setUnits("metric");
                  clearResult();
                }}
              >
                Metric <span>kg, cm</span>
              </button>
              <button
                type="button"
                className={units === "imperial" ? "unit-option active" : "unit-option"}
                aria-pressed={units === "imperial"}
                onClick={() => {
                  setUnits("imperial");
                  clearResult();
                }}
              >
                Imperial <span>lb, ft, in</span>
              </button>
            </div>

            <form className="bmi-form" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="weight">
                  Weight <span>{units === "metric" ? "(kg)" : "(lb)"}</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="weight"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder={units === "metric" ? "e.g. 68" : "e.g. 150"}
                    value={units === "metric" ? weightKg : weightLb}
                    onChange={updateValue(units === "metric" ? setWeightKg : setWeightLb)}
                    aria-describedby={error ? "form-error" : undefined}
                  />
                  <span className="input-unit">{units === "metric" ? "kg" : "lb"}</span>
                </div>
              </div>

              {units === "metric" ? (
                <div className="field-group">
                  <label htmlFor="height-cm">
                    Height <span>(cm)</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      id="height-cm"
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      placeholder="e.g. 172"
                      value={heightCm}
                      onChange={updateValue(setHeightCm)}
                      aria-describedby={error ? "form-error" : undefined}
                    />
                    <span className="input-unit">cm</span>
                  </div>
                </div>
              ) : (
                <div className="field-group">
                  <label>Height</label>
                  <div className="height-inputs">
                    <div className="input-wrap">
                      <input
                        id="height-ft"
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        placeholder="5"
                        value={feet}
                        onChange={updateValue(setFeet)}
                        aria-label="Height in feet"
                        aria-describedby={error ? "form-error" : undefined}
                      />
                      <span className="input-unit">ft</span>
                    </div>
                    <div className="input-wrap">
                      <input
                        id="height-in"
                        type="number"
                        min="0"
                        max="11.9"
                        step="any"
                        inputMode="decimal"
                        placeholder="7"
                        value={inches}
                        onChange={updateValue(setInches)}
                        aria-label="Height in inches"
                        aria-describedby={error ? "form-error" : undefined}
                      />
                      <span className="input-unit">in</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="form-error" id="form-error" role="alert">
                  <span aria-hidden="true">!</span>
                  {error}
                </p>
              )}

              <div className="form-actions">
                <button className="calculate-button" type="submit">
                  Calculate my BMI
                  <span aria-hidden="true">↗</span>
                </button>
                <button className="reset-button" type="button" onClick={handleReset}>
                  Clear
                </button>
              </div>
            </form>

            <section
              className={`result-panel${result ? " has-result" : ""}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="result-topline">
                <span className="result-label">YOUR RESULT</span>
                {result && (
                  <span className={`result-badge ${result.category.className}`}>
                    <span />
                    {result.category.name}
                  </span>
                )}
              </div>
              {result ? (
                <>
                  <div className="result-number">
                    <strong key={result.value}>{result.value.toFixed(1)}</strong>
                    <span>BMI</span>
                  </div>
                  <div
                    className="bmi-scale"
                    style={{ "--marker-position": markerPosition }}
                    aria-label={`BMI scale. Your result is ${result.value.toFixed(1)}, in the ${result.category.name} range.`}
                  >
                    <div className="scale-marker">
                      <span />
                    </div>
                    <div className="scale-segments">
                      <span className="underweight" />
                      <span className="healthy" />
                      <span className="overweight" />
                      <span className="obesity" />
                    </div>
                  </div>
                  <div className="scale-labels" aria-hidden="true">
                    <span>Under</span>
                    <span>Healthy</span>
                    <span>Over</span>
                    <span>30+</span>
                  </div>
                </>
              ) : (
                <div className="result-empty">
                  <span className="empty-sparkle" aria-hidden="true">✳</span>
                  <p>Your BMI result will appear here</p>
                </div>
              )}
            </section>

            <p className="disclaimer">
              BMI is a general screening tool, not a diagnosis. It may not suit
              everyone; speak with a healthcare professional for personal advice.
            </p>
          </section>
        </section>

        <section className="wellness-section" id="wellness" aria-labelledby="wellness-title">
          <div className="wellness-intro">
            <span className="section-eyebrow">A HEALTHIER PERSPECTIVE</span>
            <h2 id="wellness-title">
              A little context
              <br />
              <span>goes a long way.</span>
            </h2>
            <p>
              Your result is just one small piece of your wellbeing. Keep the
              bigger picture in view.
            </p>
            <div className="slider-controls">
              <button
                type="button"
                className="slider-arrow"
                onClick={() => changeSlide(-1)}
                aria-label="Previous wellness note"
              >
                ←
              </button>
              <div className="slider-dots" role="group" aria-label="Choose a wellness note">
                {wellnessSlides.map((item, index) => (
                  <button
                    type="button"
                    key={item.number}
                    className={index === activeSlide ? "slider-dot active" : "slider-dot"}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show wellness note ${index + 1}`}
                    aria-pressed={index === activeSlide}
                  />
                ))}
              </div>
              <button
                type="button"
                className="slider-arrow"
                onClick={() => changeSlide(1)}
                aria-label="Next wellness note"
              >
                →
              </button>
              <span className="slider-count">
                0{activeSlide + 1} <span>/</span> 0{wellnessSlides.length}
              </span>
            </div>
          </div>

          <article className="wellness-slide" aria-live="polite" aria-atomic="true">
            <div className="slide-topline">
              <span className="slide-icon" aria-hidden="true">✳</span>
              <span>{slide.label}</span>
              <span className="slide-number">{slide.number}</span>
            </div>
            <div className="slide-content" key={slide.number}>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
            <div className="slide-progress" aria-hidden="true">
              <span style={{ width: `${((activeSlide + 1) / wellnessSlides.length) * 100}%` }} />
            </div>
          </article>
        </section>

        <section className="how-section" aria-labelledby="how-title">
          <div className="how-heading">
            <span className="section-eyebrow">SIMPLE BY DESIGN</span>
            <h2 id="how-title">A quick check-in, in three steps.</h2>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Choose your units</h3>
              <p>Use metric or imperial measurements—whichever feels familiar.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Add your details</h3>
              <p>Enter your height and weight to calculate your BMI estimate.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <h3>Understand the result</h3>
              <p>See the general adult range and remember to consider your context.</p>
            </article>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-main">
            <div className="footer-brand-block">
              <a className="brand footer-brand" href="#home" aria-label="Wellwise home">
                <span className="brand-mark" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                <span>wellwise</span>
              </a>
              <p>A little more in tune with you.</p>
            </div>
            <div className="footer-links">
              <span className="footer-heading">EXPLORE</span>
              <a href="#home">Home</a>
              <a href="#calculator">BMI calculator</a>
              <a href="#wellness">Wellness notes</a>
            </div>
            <div className="footer-note">
              <span className="footer-heading">A NOTE ON YOUR HEALTH</span>
              <p>
                This tool is for general information only and is not a substitute
                for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Made for a healthier perspective.</span>
            <a href="#home">Back to top ↑</a>
            <span>Take care of you <span aria-hidden="true">♡</span></span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
