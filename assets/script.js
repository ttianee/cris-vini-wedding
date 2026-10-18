
/* Add your Google Apps Script Web App URL here after completing README setup. */
const FORM_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

/* Letter opening */
const hero = document.querySelector(".hero");
const openButton = document.querySelector("#openLetter");
const letter = document.querySelector("#letter");

/* Background music */
const weddingMusic = new Audio("./assets/music/wedding-theme.mp3");
weddingMusic.loop = true;
weddingMusic.preload = "auto";
weddingMusic.volume = 0;

let musicStarted = false;
let fadeTimer = null;

/* Start the music after the visitor opens the letter. */
async function startWeddingMusic() {
  if (musicStarted) return;

  try {
    weddingMusic.volume = 0;
    await weddingMusic.play();
    musicStarted = true;

    // Gradually increase the volume for a gentle entrance.
    let volume = 0;

    fadeTimer = window.setInterval(() => {
      volume = Math.min(volume + 0.02, 0.35);
      weddingMusic.volume = volume;

      if (volume >= 0.35) {
        window.clearInterval(fadeTimer);
      }
    }, 200);

    const musicButton = document.querySelector("#musicToggle");
    if (musicButton) {
      musicButton.textContent = "♫ Music on";
      musicButton.setAttribute("aria-pressed", "true");
    }
  } catch (error) {
    console.warn(
      "Music could not start. The visitor may need to interact with the page again.",
      error
    );
  }
}

openButton?.addEventListener("click", () => {
  hero?.classList.add("opened");
  openButton.setAttribute("aria-expanded", "true");

  // Opening the seal is the visitor's interaction that starts the music.
  startWeddingMusic();

  window.setTimeout(() => {
    if (hero) hero.hidden = true;

    if (letter) {
      letter.hidden = false;
      letter.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    }
  }, 420);
});

/* Optional play/pause button, if present in the HTML. */
const musicButton = document.querySelector("#musicToggle");

musicButton?.addEventListener("click", async () => {
  if (weddingMusic.paused) {
    try {
      await weddingMusic.play();
      musicButton.textContent = "♫ Music on";
      musicButton.setAttribute("aria-pressed", "true");
    } catch (error) {
      console.warn("Music could not start:", error);
    }
  } else {
    weddingMusic.pause();
    musicButton.textContent = "♫ Play music";
    musicButton.setAttribute("aria-pressed", "false");
  }
});

/* RSVP form */
const form = document.querySelector("#guestForm");
const status = document.querySelector("#formStatus");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!status) return;

  status.textContent = "";
  status.classList.remove("error");

  const isPortuguese = document.documentElement.lang === "pt-BR";
  const say = (english, portuguese) =>
    isPortuguese ? portuguese : english;

  if (!FORM_ENDPOINT.startsWith("https://script.google.com/")) {
    status.textContent = say(
      "The form is not connected yet. Follow the README to enable private responses.",
      "O formulário ainda não está conectado. Siga o README para ativar as respostas privadas."
    );
    status.classList.add("error");
    return;
  }

  const data = new FormData(form);

  const payload = {
    language: isPortuguese ? "pt-BR" : "en",
    fullName: String(data.get("fullName") || "").trim(),
    email: String(data.get("email") || "").trim(),
    attendance: String(data.get("attendance") || ""),
    partySize: String(data.get("partySize") || ""),
    guestNames: String(data.get("guestNames") || "").trim(),
    message: String(data.get("message") || "").trim(),
    privacyConsent: document.querySelector("#privacy")?.checked ?? false,
    submittedAt: new Date().toISOString()
  };

  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = say("Sending…", "Enviando…");
  }

  try {
    await fetch(FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    form.reset();

    status.textContent = say(
      "Thank you for replying! This is an early indication, not the final RSVP.",
      "Obrigada pela resposta! Esta é uma indicação inicial, não a confirmação final."
    );
  } catch (error) {
    console.error("RSVP submission failed:", error);

    status.textContent = say(
      "We could not send your reply. Please try again later.",
      "Não foi possível enviar sua resposta. Tente novamente mais tarde."
    );

    status.classList.add("error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = say(
        "Send our reply ↗",
        "Enviar resposta ↗"
      );
    }
  }
});
