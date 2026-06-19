// ==========================================================================
// CONFIGURATION (Hier kannst du deine Daten anpassen)
// ==========================================================================

// 1. Datum der Hochzeit (Format: "Monat Tag, Jahr Stunden:Minuten:Sekunden")
// Beispiel: "September 12, 2026 10:00:00"
const WEDDING_DATE_STRING = "July 24, 2026 10:00:00";

// 2. Dein Dropbox-Dateianfrage-Link (Dropbox File Request Link)
// Erstelle eine Dateianfrage in Dropbox und füge den Link hier ein.
const DROPBOX_UPLOAD_URL = "https://www.dropbox.com/request/secx57ce78j7kumvcx4z";


// ==========================================================================
// SYSTEM LOGIC (Ab hier muss normalerweise nichts geändert werden)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initDropboxLinkAndQRCode();
    initCountdown();
});

/**
 * Richtet den Dropbox Button und generiert den QR-Code dynamisch.
 */
function initDropboxLinkAndQRCode() {
    const dropboxBtn = document.getElementById("dropbox-btn");
    const qrImg = document.getElementById("qr-code-img");
    const qrLoading = document.querySelector(".qr-loading");

    if (dropboxBtn) {
        dropboxBtn.href = DROPBOX_UPLOAD_URL;
    }

    if (qrImg) {
        // Nutzt die freie QR-Code-Generator-API von qrserver.com
        // Der Link wird URL-codiert, um sicherzustellen, dass Sonderzeichen korrekt verarbeitet werden.
        const encodedUrl = encodeURIComponent(DROPBOX_UPLOAD_URL);
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}&margin=10`;
        
        qrImg.src = qrApiUrl;

        // Sobald das Bild geladen ist, blenden wir den Lade-Hinweis aus und zeigen das Bild
        qrImg.addEventListener("load", () => {
            qrImg.classList.add("loaded");
            if (qrLoading) {
                qrLoading.style.display = "none";
            }
        });
    }
}

/**
 * Berechnet und aktualisiert den Countdown-Timer zur Hochzeit.
 */
function initCountdown() {
    const targetDate = new Date(WEDDING_DATE_STRING).getTime();

    // DOM Elemente
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // Falls die IDs nicht im HTML existieren, brechen wir ab
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Funktion zur Aktualisierung des Countdowns
    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // Wenn das Hochzeitsdatum erreicht oder überschritten ist
        if (difference < 0) {
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            
            // Text unter dem Countdown anpassen
            const subTitle = document.querySelector(".hero-sub");
            if (subTitle) {
                subTitle.textContent = "Der große Tag ist da!";
            }
            clearInterval(timerInterval);
            return;
        }

        // Berechnungen für Tage, Stunden, Minuten und Sekunden
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Werte mit führender Null formatieren und ins HTML schreiben
        daysEl.textContent = days.toString().padStart(2, "0");
        hoursEl.textContent = hours.toString().padStart(2, "0");
        minutesEl.textContent = minutes.toString().padStart(2, "0");
        secondsEl.textContent = seconds.toString().padStart(2, "0");
    };

    // Führe das erste Mal sofort aus und starte dann das Intervall (jede Sekunde)
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}
