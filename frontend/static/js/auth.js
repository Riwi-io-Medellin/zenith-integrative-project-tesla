function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("bi-eye-slash");
        eyeIcon.classList.add("bi-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("bi-eye");
        eyeIcon.classList.add("bi-eye-slash");
    }
}
// LOGIN
const toggleLogin = document.getElementById("toggleLoginPassword");
if (toggleLogin) {
    toggleLogin.addEventListener("click", function () {
        togglePassword("loginPassword", "loginEyeIcon");
    });
}

// REGISTER
const toggleRegister = document.getElementById("toggleRegisterPassword");
if (toggleRegister) {
    toggleRegister.addEventListener("click", function () {
        togglePassword("registerPassword", "registerEyeIcon");
    });
}

const toggleConfirm = document.getElementById("toggleConfirmPassword");
if (toggleConfirm) {
    toggleConfirm.addEventListener("click", function () {
        togglePassword("confirmRegisterPassword", "confirmEyeIcon");
    });
}