function getProgress(){
  return JSON.parse(localStorage.getItem("salvationTrainerProgress") || "{}");
}
function setProgress(p){
  localStorage.setItem("salvationTrainerProgress", JSON.stringify(p));
}
function completeModule(key){
  const p = getProgress();
  p[key] = { completed:true, date:new Date().toISOString() };
  setProgress(p);
  alert("Marked complete on this device.");
  renderTeacherProgress();
}
function markFlashcard(idx){
  const p = getProgress();
  p.flashcards = p.flashcards || {};
  p.flashcards[idx] = { known:true, date:new Date().toISOString() };
  setProgress(p);
  alert("Flashcard marked known.");
}
function saveTextareas(){
  document.querySelectorAll("textarea[data-save]").forEach(t => {
    const key = "answer-" + t.dataset.save;
    t.value = localStorage.getItem(key) || "";
    t.addEventListener("input", () => localStorage.setItem(key, t.value));
  });
}
function renderTeacherProgress(){
  const el = document.getElementById("teacherProgress");
  if(!el) return;
  const p = getProgress();
  const modules = ["foundation","lesson-1","lesson-2","lesson-3","lesson-4","lesson-5","lesson-6"];
  let html = "<ul>";
  modules.forEach(m => {
    html += `<li><strong>${m}</strong>: ${p[m]?.completed ? "Complete" : "Not complete"}</li>`;
  });
  const known = p.flashcards ? Object.keys(p.flashcards).length : 0;
  html += `<li><strong>Flashcards known:</strong> ${known}</li>`;
  html += "</ul>";
  html += `<button class="btn" onclick="localStorage.removeItem('salvationTrainerProgress'); location.reload();">Reset Progress</button>`;
  el.innerHTML = html;
}
document.addEventListener("DOMContentLoaded", () => {
  saveTextareas();
  renderTeacherProgress();
});

/* UPGRADED SLIDE VIEWER */
function initialiseSlideViewers(){
  document.querySelectorAll("[data-slide-viewer]").forEach(viewer=>{
    const slides=Array.from(viewer.querySelectorAll(".teaching-slide"));
    const prev=viewer.querySelector("[data-slide-prev]");
    const next=viewer.querySelector("[data-slide-next]");
    const count=viewer.querySelector("[data-slide-count]");
    const lessonId=viewer.dataset.lessonId||"unknown";
    const storageKey=`salvation-slide-${lessonId}`;
    let current=Number(localStorage.getItem(storageKey)||0);
    if(current<0||current>=slides.length)current=0;

    function showSlide(index){
      current=Math.max(0,Math.min(index,slides.length-1));
      slides.forEach((slide,idx)=>slide.classList.toggle("active",idx===current));
      if(count)count.textContent=`${current+1} / ${slides.length}`;
      if(prev)prev.disabled=current===0;
      if(next)next.disabled=current===slides.length-1;
      localStorage.setItem(storageKey,String(current));
    }

    if(prev)prev.addEventListener("click",()=>showSlide(current-1));
    if(next)next.addEventListener("click",()=>showSlide(current+1));
    document.addEventListener("keydown",(event)=>{
      if(event.key==="ArrowLeft")showSlide(current-1);
      if(event.key==="ArrowRight")showSlide(current+1);
    });
    showSlide(current);
  });
}
document.addEventListener("DOMContentLoaded",initialiseSlideViewers);
