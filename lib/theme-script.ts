// Runs before paint: stored theme, Konami mode, "js" flag for motion, and whether the intro already played.
export const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(sessionStorage.getItem("mode")==="ida")d.dataset.mode="ida";if(sessionStorage.getItem("seen"))d.dataset.seen=""}catch(e){d.dataset.seen=""}})()`;

// CTF step 1 lives in the page source.
export const sourceNote = `<!--
  field note 01
  -------------
  You read source. Good sign.
  The page forgets things; the console remembers them.
-->`;
