/* ============================================================ */
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbcy77dETLh0HZMeaStUk3KaHu4kpcgCJReK_c3xWiL_qpA17-jBILLTJjPaSwo0sKKVhLhQ/exec";

const form = document.getElementById("applicationForm");
const steps = Array.from(document.querySelectorAll(".step"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const stepLabel = document.getElementById("stepLabel");
const stepName = document.getElementById("stepName");
const progressFill = document.getElementById("progressFill");
const statusEl = document.getElementById("formStatus");
const reviewList = document.getElementById("reviewList");
const successScreen = document.getElementById("successScreen");
const appIdOut = document.getElementById("appIdOut");
const backHomeBtn = document.getElementById("backHomeBtn");
const applyNowBtn = document.getElementById("applyNowBtn");

const STEP_NAMES = ["Personal Information","Academic Information","Position & Team","Contribution & Commitment"];
let current = 1;
const totalSteps = steps.length;

function getValue(name){
  const el = form.elements[name];
  if(!el) return "";
  if(el instanceof RadioNodeList || (el.length && !el.tagName)) return el.value || "";
  return el.value.trim();
}
function setError(name, message){
  const el = form.querySelector('[data-error-for="' + name + '"]');
  const field = form.elements[name];
  if(el) el.textContent = message || "";
  if(field && field.classList){
    if(message) field.classList.add("invalid");
    else field.classList.remove("invalid");
  }
}
function clearAllErrors(){
  form.querySelectorAll(".error").forEach(function(e){ e.textContent = ""; });
  form.querySelectorAll(".invalid").forEach(function(e){ e.classList.remove("invalid"); });
}
function showStatus(msg, type){
  statusEl.textContent = msg;
  statusEl.className = "status" + (type ? " " + type : "");
}
function scrollToForm(){
  document.getElementById("apply").scrollIntoView({behavior:"smooth", block:"start"});
}
function normalizePhone(raw){
  if(!raw) return "";
  let d = String(raw).replace(/\D/g, "");
  if(d.startsWith("92") && d.length === 12) d = "0" + d.slice(2);
  else if(d.length === 10 && d.startsWith("3")) d = "0" + d;
  return d;
}

function validateStep(step){
  clearAllErrors();
  let ok = true;

  if(step === 1){
    const name = getValue("fullName");
    if(!name){ setError("fullName","Please enter your full name."); ok = false; }
    else if(name.length < 3){ setError("fullName","Name looks too short."); ok = false; }

    if(!getValue("studentId")){ setError("studentId","Please enter your student ID."); ok = false; }

    const email = getValue("email");
    if(!email){ setError("email","Please enter your email."); ok = false; }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError("email","Enter a valid email address."); ok = false; }

    const phone = normalizePhone(getValue("contactNumber"));
    if(!phone){ setError("contactNumber","Please enter your contact number."); ok = false; }
    else if(!/^03\d{9}$/.test(phone)){ setError("contactNumber","Enter a valid Pakistani number."); ok = false; }
  }
  if(step === 2){
    if(!getValue("program")){ setError("program","Please select your program."); ok = false; }
    if(!getValue("semester")){ setError("semester","Please select your semester."); ok = false; }
    if(!getValue("section")){ setError("section","Please enter your section."); ok = false; }
  }
  if(step === 3){
    if(!getValue("position")){ setError("position","Please select a position."); ok = false; }
    if(!getValue("team")){ setError("team","Please select a team."); ok = false; }
  }
  if(step === 4){
    const c = getValue("contribution");
    if(!c){ setError("contribution","Please tell us how you can contribute."); ok = false; }
    else if(c.length < 30){ setError("contribution","Please write at least 30 characters."); ok = false; }
    if(!getValue("shortNotice")){ setError("shortNotice","Please answer this question."); ok = false; }
    if(!getValue("otherSociety")){ setError("otherSociety","Please answer this question."); ok = false; }
    if(!getValue("activeParticipation")){ setError("activeParticipation","Please answer this question."); ok = false; }
    if(!getValue("priorExperience")){ setError("priorExperience","Please answer this question."); ok = false; }
  }
  return ok;
}

function renderStep(){
  steps.forEach(function(s){
    s.classList.toggle("active", Number(s.dataset.step) === current);
  });
  stepLabel.textContent = "Step " + current + " of " + totalSteps;
  stepName.textContent = STEP_NAMES[current - 1];
  progressFill.style.width = ((current / totalSteps) * 100) + "%";
  prevBtn.hidden = (current === 1);
  nextBtn.hidden = (current === totalSteps);
  submitBtn.hidden = (current !== totalSteps);
  if(current === totalSteps) renderReview();
  showStatus("");
}

nextBtn.addEventListener("click", function(){
  if(!validateStep(current)){ showStatus("Please complete the required fields.","error"); return; }
  current++; renderStep(); scrollToForm();
});
prevBtn.addEventListener("click", function(){
  current--; renderStep(); scrollToForm();
});

function renderReview(){
  const fields = [
    ["Full Name","fullName"],["Student ID","studentId"],["Email","email"],
    ["Contact Number","contactNumber"],["Program","program"],["Semester","semester"],
    ["Section","section"],["Position","position"],["Team","team"],
    ["Contribution","contribution"],["Short Notice","shortNotice"],
    ["Other Society","otherSociety"],["Other Society Details","otherSocietyDetails"],
    ["Active Participation","activeParticipation"],["Prior Experience","priorExperience"]
  ];
  reviewList.innerHTML = fields.map(function(pair){
    const val = getValue(pair[1]) || "—";
    return "<dt>" + pair[0] + "</dt><dd>" + escapeHtml(val) + "</dd>";
  }).join("");
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}

form.addEventListener("submit", async function(e){
  e.preventDefault();
  if(submitBtn.disabled) return;

  for(let s = 1; s <= totalSteps; s++){
    if(!validateStep(s)){
      current = s; renderStep();
      showStatus("Please complete the required fields.","error");
      scrollToForm(); return;
    }
  }

  const payload = {
    fullName: getValue("fullName"),
    studentId: getValue("studentId"),
    email: getValue("email"),
    contactNumber: normalizePhone(getValue("contactNumber")),
    program: getValue("program"),
    semester: getValue("semester"),
    section: getValue("section"),
    position: getValue("position"),
    team: getValue("team"),
    contribution: getValue("contribution"),
    shortNotice: getValue("shortNotice"),
    otherSociety: getValue("otherSociety"),
    otherSocietyDetails: getValue("otherSocietyDetails"),
    activeParticipation: getValue("activeParticipation"),
    priorExperience: getValue("priorExperience")
  };

  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = "Submitting...";
  showStatus("Submitting your application...","info");

  try{
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); }
    catch(parseErr){
      throw new Error("Server returned non-JSON. Preview: " + text.slice(0, 150));
    }
    if(!data.success) throw new Error(data.error || "Submission failed.");

    appIdOut.textContent = data.applicationId || "—";
    form.hidden = true;
    document.querySelector(".progress-wrap").hidden = true;
    successScreen.hidden = false;
    window.scrollTo({top:0, behavior:"smooth"});
  } catch(err){
    console.error("Submission error:", err);
    showStatus("Something went wrong while submitting your application. Please try again. (" + err.message + ")","error");
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

if(applyNowBtn){
  applyNowBtn.addEventListener("click", function(e){
    e.preventDefault(); scrollToForm();
  });
}
backHomeBtn.addEventListener("click", function(){
  successScreen.hidden = true;
  form.hidden = false;
  document.querySelector(".progress-wrap").hidden = false;
  form.reset(); clearAllErrors(); current = 1; renderStep();
  window.scrollTo({top:0, behavior:"smooth"});
});
renderStep();
