import { conversation } from "@/content/site";

/** Illustration of the booking step for the proposal deck (07/10). The live version is a
 *  Cal.com / Calendly inline embed themed in KARTÚ colours, with these three questions. */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// October 2026 starts on a Thursday
const LEAD = 3;
const AVAILABLE = new Set([13, 14, 15, 16, 20, 21, 22, 23, 27, 28, 29, 30]);
const SELECTED_DAY = 15;
const TIMES = ["10:00", "11:30", "14:00", "16:30"];
const SELECTED_TIME = "11:30";

export function BookingCalendarMock() {
  const cells = [...Array(LEAD).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  return (
    <div className="booking" aria-hidden="true">
      <div className="booking__head">
        <span className="booking__step">Step 1 of 2</span>
        <span className="booking__title">{conversation.call.title}</span>
        <span className="booking__meta">{conversation.call.meta}</span>
      </div>
      <div className="booking__body">
        <div className="booking__cal">
          <div className="booking__month">October 2026</div>
          <div className="booking__grid">
            {DAYS.map((d) => (
              <span key={d} className="booking__dow">
                {d}
              </span>
            ))}
            {cells.map((n, i) => (
              <span key={i} className={`booking__day ${n && AVAILABLE.has(n) ? "is-open" : ""} ${n === SELECTED_DAY ? "is-selected" : ""}`}>
                {n ?? ""}
              </span>
            ))}
          </div>
        </div>
        <div className="booking__times">
          <div className="booking__month">Thursday 15 October</div>
          {TIMES.map((t) => (
            <span key={t} className={`booking__time ${t === SELECTED_TIME ? "is-selected" : ""}`}>
              {t}
            </span>
          ))}
          <span className="booking__tz">London time (GMT+1)</span>
        </div>
      </div>
    </div>
  );
}

export function BookingQuestionsMock() {
  const picked = ["Full renovation", "London", "3–6 months"];
  return (
    <div className="booking" aria-hidden="true">
      <div className="booking__head">
        <span className="booking__step">Step 2 of 2</span>
        <span className="booking__title">Thursday 15 October, 11:30</span>
        <span className="booking__meta">A few questions so we can prepare — about 30 seconds</span>
      </div>
      <div className="booking__form">
        <div className="booking__row">
          <label className="booking__field">
            <span>Name</span>
            <span className="booking__input">Emma Collins</span>
          </label>
          <label className="booking__field">
            <span>Email</span>
            <span className="booking__input">emma@example.com</span>
          </label>
        </div>
        {conversation.questions.map((q) => (
          <div key={q.q} className="booking__q">
            <span className="booking__q-label">{q.q}</span>
            <div className="booking__chips">
              {q.a.map((a) => (
                <span key={a} className={`booking__chip ${picked.includes(a) ? "is-selected" : ""}`}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
        <label className="booking__field">
          <span>Anything we should know? (optional)</span>
          <span className="booking__input booking__input--area">Victorian terrace, ground floor and kitchen extension. Plans attached via link.</span>
        </label>
        <span className="booking__submit">Confirm booking</span>
      </div>
    </div>
  );
}
