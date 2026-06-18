// auth-state.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  const loginBtn = document.querySelector('[data-auth="login"]');
  const signupBtn = document.querySelector('[data-auth="signup"]');
  const profileBtn = document.querySelector('[data-auth="profile"]');
  const logoutBtn = document.querySelector('[data-auth="logout"]');

  if (!user) {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (signupBtn) signupBtn.style.display = "inline-flex";
    if (profileBtn) profileBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    return;
  }

  const profileSnap = await getDoc(doc(db, "profiles", user.uid));
  if (!profileSnap.exists() && !location.pathname.endsWith("profile-setup.html")) {
    location.href = "profile-setup.html";
    return;
  }

  if (loginBtn) loginBtn.style.display = "none";
  if (signupBtn) signupBtn.style.display = "none";
  if (profileBtn) profileBtn.style.display = "inline-flex";
  if (logoutBtn) logoutBtn.style.display = "inline-flex";
});

const logoutBtn = document.querySelector('[data-auth="logout"]');
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    location.href = "login.html";
  });
}
